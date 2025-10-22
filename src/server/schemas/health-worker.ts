import z from "zod";

const nameField = z.string().min(1, "El nombre es requerido");
const lastNameField = z.string().min(1, "El apellido es requerido");
const ciField = z.string().min(1, "La cédula es requerida");
const emailField = z.string().email("El email no es válido");
const phoneField = z.string().min(1, "El teléfono es requerido");
const addressField = z.string().min(1, "La dirección es requerida");
const dateOfBirthField = z
  .string()
  .min(1, "La fecha de nacimiento es requerida")
  .regex(/^\d{4}-\d{2}-\d{2}$/, "La fecha de nacimiento debe tener el formato YYYY-MM-DD");

const baseClinicScopedSchema = z.object({
  clinicId: z.string().min(1, "La clínica es requerida"),
});

export const listHealthWorkersSchema = baseClinicScopedSchema.extend({
  search: z.string().optional(),
});

export type ListHealthWorkersSchema = z.infer<typeof listHealthWorkersSchema>;

export const healthWorkerIdSchema = baseClinicScopedSchema.extend({
  healthWorkerId: z.string().min(1, "El identificador es requerido"),
});

export type HealthWorkerIdSchema = z.infer<typeof healthWorkerIdSchema>;

export const createHealthWorkerSchema = baseClinicScopedSchema.extend({
  firstName: nameField,
  lastName: lastNameField,
  ci: ciField,
  email: emailField,
  phone: phoneField,
  address: addressField,
  dateOfBirth: dateOfBirthField,
});

export type CreateHealthWorkerSchema = z.infer<typeof createHealthWorkerSchema>;

export const updateHealthWorkerSchema = baseClinicScopedSchema.extend({
  healthWorkerId: z.string().min(1, "El identificador es requerido"),
  firstName: nameField.optional(),
  lastName: lastNameField.optional(),
  ci: ciField.optional(),
  email: emailField.optional(),
  phone: phoneField.optional(),
  address: addressField.optional(),
  dateOfBirth: dateOfBirthField.optional(),
});

export type UpdateHealthWorkerSchema = z.infer<typeof updateHealthWorkerSchema>;

export const fetchHealthWorkerFromHcenSchema = z.object({
  ci: ciField,
});

export type FetchHealthWorkerFromHcenSchema = z.infer<
  typeof fetchHealthWorkerFromHcenSchema
>;
