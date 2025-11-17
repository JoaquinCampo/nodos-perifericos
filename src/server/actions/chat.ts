"use server";

import { actionClient } from "~/lib/safe-action";
import { sendMessageSchema } from "../schemas/chat";
import { sendMessage as sendMessageController } from "../controllers/chat";
import { authGuard } from "../auth/auth-guard";

export const sendMessage = actionClient
  .inputSchema(sendMessageSchema)
  .action(async ({ parsedInput }) => {
    await authGuard("HealthWorkers");

    const result = await sendMessageController({
      healthUserCi: parsedInput.healthUserCi,
      message: parsedInput.message,
      conversationHistory: parsedInput.conversationHistory,
    });

    return result;
  });
