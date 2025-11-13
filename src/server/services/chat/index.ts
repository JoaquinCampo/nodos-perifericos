import { db } from "~/server/db";
import { fetchApi } from "~/lib/hcen-api";

interface ChatResponseDTO {
  answer: string;
  sources: Array<{
    documentId: string;
    documentTitle: string;
    chunkContent: string;
    similarity: number;
  }>;
}

async function findHealthWorkerByCI(healthWorkerCi: string) {
  const healthWorker = await db.healthWorker.findFirst({
    where: {
      user: {
        ci: healthWorkerCi,
      },
    },
  });

  if (!healthWorker) {
    throw new Error("Trabajador de salud no encontrado");
  }

  return healthWorker;
}

export async function getOrCreateConversation(input: {
  healthUserCi: string;
  healthWorkerCi: string;
  conversationId?: string;
}) {
  const { healthUserCi, healthWorkerCi, conversationId } = input;

  const healthWorker = await findHealthWorkerByCI(healthWorkerCi);

  // If conversationId is provided, fetch that conversation
  if (conversationId) {
    const conversation = await db.conversation.findUnique({
      where: {
        id: conversationId,
      },
      include: {
        messages: {
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });

    if (!conversation) {
      throw new Error("Conversación no encontrada");
    }

    // Verify the conversation belongs to this health worker
    if (conversation.healthWorkerId !== healthWorker.id) {
      throw new Error("No tienes permiso para acceder a esta conversación");
    }

    return conversation;
  }

  // Otherwise, find or create a conversation for this health user and health worker
  let conversation = await db.conversation.findFirst({
    where: {
      healthUserCi,
      healthWorkerId: healthWorker.id,
    },
    include: {
      messages: {
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });

  conversation ??= await db.conversation.create({
    data: {
      healthUserCi,
      healthWorkerId: healthWorker.id,
    },
    include: {
      messages: {
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });

  return conversation;
}

export async function sendMessage(input: {
  healthUserCi: string;
  healthWorkerCi: string;
  message: string;
  conversationId?: string;
}) {
  const { healthUserCi, healthWorkerCi, message, conversationId } = input;

  // Get or create conversation
  const conversation = await getOrCreateConversation({
    healthUserCi,
    healthWorkerCi,
    conversationId,
  });

  // Save user message
  const userMessage = await db.message.create({
    data: {
      conversationId: conversation.id,
      role: "user",
      content: message,
    },
  });

  // Prepare conversation history for the API
  const conversationHistory = conversation.messages.map((msg) => ({
    role: msg.role,
    content: msg.content,
  }));

  // Add the new user message to history
  conversationHistory.push({
    role: "user",
    content: message,
  });

  // Call the HCEN API
  try {
    const response = await fetchApi<ChatResponseDTO>({
      path: "clinical-history/chat",
      method: "POST",
      body: {
        query: message,
        conversationHistory,
        healthUserCi,
        documentId: null,
      },
    });

    // Save assistant message
    const assistantMessage = await db.message.create({
      data: {
        conversationId: conversation.id,
        role: "assistant",
        content: response.answer,
      },
    });

    return {
      conversationId: conversation.id,
      userMessage,
      assistantMessage,
      sources: response.sources,
    };
  } catch (error) {
    console.error("Error calling chat API:", error);
    throw new Error(
      "No se pudo obtener una respuesta. Por favor, intenta nuevamente.",
    );
  }
}

export async function listConversations(input: {
  healthWorkerCi: string;
  healthUserCi?: string;
}) {
  const { healthWorkerCi, healthUserCi } = input;

  const healthWorker = await findHealthWorkerByCI(healthWorkerCi);

  const conversations = await db.conversation.findMany({
    where: {
      healthWorkerId: healthWorker.id,
      ...(healthUserCi ? { healthUserCi } : {}),
    },
    include: {
      messages: {
        orderBy: {
          createdAt: "desc",
        },
        take: 1, // Get the last message for preview
      },
      _count: {
        select: {
          messages: true,
        },
      },
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

  return conversations;
}

export async function deleteConversation(input: {
  conversationId: string;
  healthWorkerCi: string;
}) {
  const { conversationId, healthWorkerCi } = input;

  const healthWorker = await findHealthWorkerByCI(healthWorkerCi);

  // Verify the conversation belongs to this health worker
  const conversation = await db.conversation.findUnique({
    where: {
      id: conversationId,
    },
  });

  if (!conversation) {
    throw new Error("Conversación no encontrada");
  }

  if (conversation.healthWorkerId !== healthWorker.id) {
    throw new Error("No tienes permiso para eliminar esta conversación");
  }

  const healthUserCi = conversation.healthUserCi;

  // Delete the conversation (messages will be cascade deleted)
  await db.conversation.delete({
    where: {
      id: conversationId,
    },
  });

  return { success: true, healthUserCi };
}

export async function createNewConversation(input: {
  healthUserCi: string;
  healthWorkerCi: string;
}) {
  const { healthUserCi, healthWorkerCi } = input;

  const healthWorker = await findHealthWorkerByCI(healthWorkerCi);

  // Create a new conversation
  const conversation = await db.conversation.create({
    data: {
      healthUserCi,
      healthWorkerId: healthWorker.id,
    },
    include: {
      messages: true,
    },
  });

  return conversation;
}
