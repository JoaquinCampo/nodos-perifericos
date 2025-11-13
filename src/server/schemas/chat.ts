import { z } from "zod";

export const sendMessageSchema = z.object({
  healthUserCi: z.string().min(1, "CI del usuario de salud es requerido"),
  message: z.string().min(1, "El mensaje no puede estar vacío"),
  conversationId: z.string().optional(),
});

export const getConversationSchema = z.object({
  healthUserCi: z.string().min(1, "CI del usuario de salud es requerido"),
  conversationId: z.string().optional(),
});

export const listConversationsSchema = z.object({
  healthUserCi: z.string().optional(),
});

export const deleteConversationSchema = z.object({
  conversationId: z.string().min(1, "ID de conversación es requerido"),
});

export const createConversationSchema = z.object({
  healthUserCi: z.string().min(1, "CI del usuario de salud es requerido"),
});

export type SendMessageInput = z.infer<typeof sendMessageSchema>;
export type GetConversationInput = z.infer<typeof getConversationSchema>;
export type ListConversationsInput = z.infer<typeof listConversationsSchema>;
export type DeleteConversationInput = z.infer<typeof deleteConversationSchema>;
export type CreateConversationInput = z.infer<typeof createConversationSchema>;
