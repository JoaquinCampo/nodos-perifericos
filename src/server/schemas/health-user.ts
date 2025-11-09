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
