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

interface ConversationMessage {
  role: string;
  content: string;
}

export async function sendMessage(input: {
  healthUserCi: string;
  message: string;
  conversationHistory: ConversationMessage[];
}) {
  const { healthUserCi, message, conversationHistory } = input;

  // Call the HCEN API with the conversation history from the client
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

    return {
      answer: response.answer,
      sources: response.sources,
    };
  } catch (error) {
    console.error("Error calling chat API:", error);
    throw new Error(
      "No se pudo obtener una respuesta. Por favor, intenta nuevamente.",
    );
  }
}
