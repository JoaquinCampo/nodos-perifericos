import { z } from "zod";

const conversationMessageSchema = z.object({
  role: z.string(),
  content: z.string(),
});

export const sendMessageSchema = z.object({
  healthUserCi: z.string().min(1, "CI del usuario de salud es requerido"),
  message: z.string().min(1, "El mensaje no puede estar vacío"),
  conversationHistory: z.array(conversationMessageSchema),
});

export type SendMessageInput = z.infer<typeof sendMessageSchema>;
