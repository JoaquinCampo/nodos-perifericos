import { z } from "zod";
import { stringOrUndefinedSchema } from "~/lib/validation/string";

export const updateConfigurationSchema = z.object({
  configurationId: z.string().min(1, "El identificador es requerido"),
  portalTitle: stringOrUndefinedSchema,
  sidebarTextColor: stringOrUndefinedSchema,
  sidebarBackgroundColor: stringOrUndefinedSchema,
  backgroundColor: stringOrUndefinedSchema,
  iconTextColor: stringOrUndefinedSchema,
  iconBackgroundColor: stringOrUndefinedSchema,
  cardBackgroundColor: stringOrUndefinedSchema,
  cardTextColor: stringOrUndefinedSchema,
});

export type UpdateConfigurationSchema = z.infer<
  typeof updateConfigurationSchema
>;

export const resetConfigurationSchema = z.object({
  configurationId: z.string().min(1, "El identificador es requerido"),
});

export type ResetConfigurationSchema = z.infer<typeof resetConfigurationSchema>;
