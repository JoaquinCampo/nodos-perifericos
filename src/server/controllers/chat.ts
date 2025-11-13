import * as chatService from "~/server/services/chat";
import type {
  SendMessageInput,
  GetConversationInput,
  DeleteConversationInput,
  CreateConversationInput,
} from "../schemas/chat";

export const sendMessage = async (
  input: SendMessageInput & { healthWorkerCi: string },
) => {
  return await chatService.sendMessage(input);
};

export const getConversation = async (
  input: GetConversationInput & { healthWorkerCi: string },
) => {
  return await chatService.getOrCreateConversation(input);
};

export const listConversations = async (input: {
  healthWorkerCi: string;
  healthUserCi?: string;
}) => {
  return await chatService.listConversations(input);
};

export const deleteConversation = async (
  input: DeleteConversationInput & { healthWorkerCi: string },
) => {
  return await chatService.deleteConversation(input);
};

export const createConversation = async (
  input: CreateConversationInput & { healthWorkerCi: string },
) => {
  return await chatService.createNewConversation(input);
};
