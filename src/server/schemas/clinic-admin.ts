import z from "zod";

const nameField = z.string().min(1, "El nombre es requerido");
const lastNameField = z.string().min(1, "El apellido es requerido");
const ciField = z.string().min(1, "La cédula es requerida");
const emailField = z.string().email("El email no es válido");
const phoneField = z.string().min(1, "El teléfono es requerido");

const baseClinicScopedSchema = z.object({
  clinicId: z.string().min(1, "La clínica es requerida"),
});

export const findAllClinicAdminsSchema = baseClinicScopedSchema;

export type FindAllClinicAdminsSchema = z.infer<
  typeof findAllClinicAdminsSchema
>;

export const clinicAdminIdSchema = baseClinicScopedSchema.extend({
  clinicAdminId: z.string().min(1, "El identificador es requerido"),
});

export type ClinicAdminIdSchema = z.infer<typeof clinicAdminIdSchema>;

export const createClinicAdminSchema = baseClinicScopedSchema.extend({
  firstName: nameField,
  lastName: lastNameField,
  ci: ciField,
  email: emailField,
  phone: phoneField.optional(),
});

export type CreateClinicAdminSchema = z.infer<typeof createClinicAdminSchema>;

export const updateClinicAdminSchema = baseClinicScopedSchema.extend({
  clinicAdminId: z.string().min(1, "El identificador es requerido"),
  firstName: nameField.optional(),
  lastName: lastNameField.optional(),
  ci: ciField.optional(),
  email: emailField.optional(),
  phone: phoneField.optional(),
});

export type UpdateClinicAdminSchema = z.infer<typeof updateClinicAdminSchema>;
