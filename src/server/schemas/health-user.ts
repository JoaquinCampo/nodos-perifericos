import { z } from "zod";
import { ciSchema } from "~/lib/validation/ci";
import { dateOfBirthSchema } from "~/lib/validation/date";
import { phoneOrUndefinedSchema } from "~/lib/validation/phone";
import { stringOrUndefinedSchema } from "~/lib/validation/string";

export const createHealthUserSchema = z.object({
  ci: ciSchema,
  firstName: z.string().min(1, "El nombre es requerido"),
  lastName: z.string().min(1, "El apellido es requerido"),
  gender: z.enum(["MALE", "FEMALE", "OTHER"], {
    required_error: "Género es requerido",
  }),
  email: z.string().email("El email ingresado no es válido"),
  phone: phoneOrUndefinedSchema,
  address: stringOrUndefinedSchema,
  dateOfBirth: dateOfBirthSchema,
});

export type CreateHealthUserSchema = z.infer<typeof createHealthUserSchema>;

export const findAllHealthUsersSchema = z.object({
  pageIndex: z.number().default(0),
  pageSize: z.number().default(20),
  name: z.string().optional(),
  ci: z.string().optional(),
  clinic: z.string().optional(),
});

export type FindAllHealthUsersSchema = z.infer<typeof findAllHealthUsersSchema>;

export const createAccessRequestSchema = z.object({
  healthUserCi: z.string().min(1, "El CI del usuario de salud es requerido"),
  healthWorkerCi: z
    .string()
    .min(1, "El CI del profesional de salud es requerido"),
  clinicName: z.string().min(1, "El nombre de la clínica es requerido"),
});

export type CreateAccessRequestSchema = z.infer<
  typeof createAccessRequestSchema
>;

export const findAllAccessRequestsSchema = z.object({
  healthUserCi: stringOrUndefinedSchema,
  healthWorkerCi: stringOrUndefinedSchema,
  clinicName: stringOrUndefinedSchema,
});

export type FindAllAccessRequestsSchema = z.infer<
  typeof findAllAccessRequestsSchema
>;

export const findHealthUserClinicalHistorySchema = z.object({
  healthUserCi: ciSchema,
  clinicName: z.string().min(1, "El nombre de la clínica es requerido"),
  healthWorkerCi: ciSchema,
  providerName: z.string().min(1, "El nombre del proveedor es requerido"),
});

export type FindHealthUserClinicalHistorySchema = z.infer<
  typeof findHealthUserClinicalHistorySchema
>;
