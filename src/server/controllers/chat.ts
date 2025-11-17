import * as chatService from "~/server/services/chat";
import type { SendMessageInput } from "../schemas/chat";

export const sendMessage = async (input: SendMessageInput) => {
  return await chatService.sendMessage(input);
};
