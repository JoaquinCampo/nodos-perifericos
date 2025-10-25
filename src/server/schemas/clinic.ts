import z from "zod";
import { createClinicAdminSchema } from "./clinic-admin";

export const createClinicSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  email: z.string().email("El email no es válido"),
  phone: z.string().min(1, "El teléfono es requerido"),
  address: z.string().min(1, "La dirección es requerida"),
  clinicAdmin: createClinicAdminSchema.omit({ clinicId: true }),
});

export type CreateClinicSchema = z.infer<typeof createClinicSchema>;
