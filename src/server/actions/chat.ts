"use server";

import { revalidatePath } from "next/cache";
import { actionClient } from "~/lib/safe-action";
import {
  sendMessageSchema,
  getConversationSchema,
  listConversationsSchema,
  deleteConversationSchema,
  createConversationSchema,
} from "../schemas/chat";
import {
  sendMessage as sendMessageController,
  getConversation as getConversationController,
  listConversations as listConversationsController,
  deleteConversation as deleteConversationController,
  createConversation as createConversationController,
} from "../controllers/chat";
import { authGuard } from "../auth/auth-guard";
import { HealthWorkerPaths } from "~/lib/constants/paths";

export const sendMessage = actionClient
  .inputSchema(sendMessageSchema)
  .action(async ({ parsedInput }) => {
    const session = await authGuard("HealthWorkers");

    const result = await sendMessageController({
      healthUserCi: parsedInput.healthUserCi,
      healthWorkerCi: session.user.ci,
      message: parsedInput.message,
      conversationId: parsedInput.conversationId,
    });

    // Revalidate the health user page to refresh conversation data
    revalidatePath(HealthWorkerPaths.ClinicalHistory(parsedInput.healthUserCi));

    return result;
  });

export const getConversation = actionClient
  .inputSchema(getConversationSchema)
  .action(async ({ parsedInput }) => {
    const session = await authGuard("HealthWorkers");

    const conversation = await getConversationController({
      healthUserCi: parsedInput.healthUserCi,
      healthWorkerCi: session.user.ci,
      conversationId: parsedInput.conversationId,
    });

    return conversation;
  });

export const listConversations = actionClient
  .inputSchema(listConversationsSchema)
  .action(async ({ parsedInput }) => {
    const session = await authGuard("HealthWorkers");

    const conversations = await listConversationsController({
      healthWorkerCi: session.user.ci,
      healthUserCi: parsedInput.healthUserCi,
    });

    return conversations;
  });

export const deleteConversation = actionClient
  .inputSchema(deleteConversationSchema)
  .action(async ({ parsedInput }) => {
    const session = await authGuard("HealthWorkers");

    const result = await deleteConversationController({
      conversationId: parsedInput.conversationId,
      healthWorkerCi: session.user.ci,
    });

    // Revalidate the health user page
    if (result.healthUserCi) {
      revalidatePath(HealthWorkerPaths.ClinicalHistory(result.healthUserCi));
    }

    return { success: result.success };
  });

export const createConversation = actionClient
  .inputSchema(createConversationSchema)
  .action(async ({ parsedInput }) => {
    const session = await authGuard("HealthWorkers");

    const conversation = await createConversationController({
      healthUserCi: parsedInput.healthUserCi,
      healthWorkerCi: session.user.ci,
    });

    // Revalidate the health user page
    revalidatePath(HealthWorkerPaths.ClinicalHistory(parsedInput.healthUserCi));

    return conversation;
  });
