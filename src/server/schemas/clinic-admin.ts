import z from "zod";
import { ciOrUndefinedSchema, ciSchema } from "~/lib/validation/ci";
import {
  dateOfBirthOrNullOrUndefinedSchema,
  dateOfBirthOrUndefinedSchema,
} from "~/lib/validation/date";
import { emailOrUndefinedSchema } from "~/lib/validation/email";
import { phoneOrUndefinedSchema } from "~/lib/validation/phone";
import { stringOrUndefinedSchema } from "~/lib/validation/string";

export const findAllClinicAdminsSchema = z.object({
  clinicId: z.string().min(1, "La clínica es requerida"),
});

export type FindAllClinicAdminsSchema = z.infer<
  typeof findAllClinicAdminsSchema
>;

export const createClinicAdminSchema = z.object({
  ci: ciSchema,
  firstName: z.string().min(1, "El nombre es requerido"),
  lastName: z.string().min(1, "El apellido es requerido"),
  email: z.string().email("El email no es válido"),
  phone: phoneOrUndefinedSchema,
  address: stringOrUndefinedSchema,
  dateOfBirth: dateOfBirthOrUndefinedSchema,
  clinicId: z.string().min(1, "La clínica es requerida"),
});

export type CreateClinicAdminSchema = z.infer<typeof createClinicAdminSchema>;

export const updateClinicAdminSchema = z.object({
  clinicAdminId: z.string().min(1, "El identificador es requerido"),
  firstName: stringOrUndefinedSchema,
  lastName: stringOrUndefinedSchema,
  ci: ciOrUndefinedSchema,
  email: emailOrUndefinedSchema,
  phone: phoneOrUndefinedSchema,
  address: stringOrUndefinedSchema,
  dateOfBirth: dateOfBirthOrNullOrUndefinedSchema,
});

export type UpdateClinicAdminSchema = z.infer<typeof updateClinicAdminSchema>;

export const deleteClinicAdminSchema = z.object({
  clinicAdminId: z.string().min(1, "El identificador es requerido"),
});

export type DeleteClinicAdminSchema = z.infer<typeof deleteClinicAdminSchema>;
