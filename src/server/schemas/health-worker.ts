import z from "zod";
import { ciOrUndefinedSchema, ciSchema } from "~/lib/validation/ci";
import { dateOfBirthOrUndefinedSchema } from "~/lib/validation/date";
import { emailOrUndefinedSchema } from "~/lib/validation/email";
import { phoneOrUndefinedSchema } from "~/lib/validation/phone";
import { stringOrUndefinedSchema } from "~/lib/validation/string";

export const findAllHealthWorkersSchema = z.object({
  clinicId: z.string().min(1, "La clínica es requerida"),
});

export type FindAllHealthWorkersSchema = z.infer<
  typeof findAllHealthWorkersSchema
>;

export const createHealthWorkerSchema = z.object({
  ci: ciSchema,
  firstName: z.string().min(1, "El nombre es requerido"),
  lastName: z.string().min(1, "El apellido es requerido"),
  email: z.string().email("El email no es válido"),
  phone: phoneOrUndefinedSchema,
  address: stringOrUndefinedSchema,
  dateOfBirth: dateOfBirthOrUndefinedSchema,
  clinicId: z.string().min(1, "La clínica es requerida"),
  specialities: z.array(z.string()).optional(),
});

export type CreateHealthWorkerSchema = z.infer<typeof createHealthWorkerSchema>;

export const updateHealthWorkerSchema = z.object({
  healthWorkerId: z.string().min(1, "El identificador es requerido"),
  ci: ciOrUndefinedSchema,
  firstName: stringOrUndefinedSchema,
  lastName: stringOrUndefinedSchema,
  email: emailOrUndefinedSchema,
  phone: phoneOrUndefinedSchema,
  address: stringOrUndefinedSchema,
  dateOfBirth: dateOfBirthOrUndefinedSchema,
  specialities: z.array(z.string()).optional(),
});

export type UpdateHealthWorkerSchema = z.infer<typeof updateHealthWorkerSchema>;

export const deleteHealthWorkerSchema = z.object({
  healthWorkerId: z.string().min(1, "El identificador es requerido"),
});

export type DeleteHealthWorkerSchema = z.infer<typeof deleteHealthWorkerSchema>;
