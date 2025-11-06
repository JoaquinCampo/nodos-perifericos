import { z } from "zod";

export const createHealthUserSchema = z.object({
  ci: z
    .string()
    .min(1, "CI es requerido")
    .regex(/^[0-9]+$/, "CI debe contener solo números"),
  firstName: z
    .string()
    .min(1, "Nombre es requerido")
    .max(50, "Nombre debe tener menos de 50 caracteres"),
  lastName: z
    .string()
    .min(1, "Apellido es requerido")
    .max(50, "Apellido debe tener menos de 50 caracteres"),
  gender: z.enum(["MALE", "FEMALE", "OTHER"], {
    required_error: "Género es requerido",
  }),
  email: z
    .string()
    .min(1, "Email es requerido")
    .email("Email debe tener un formato válido"),
  phone: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^[\+]?[0-9\s\-\(\)]+$/.test(val),
      "Teléfono debe tener un formato válido"
    ),
  address: z
    .string()
    .max(200, "Dirección debe tener menos de 200 caracteres")
    .optional(),
  dateOfBirth: z
    .date({
      required_error: "Fecha de nacimiento es requerida",
    })
    .refine(
      (date) => date <= new Date(),
      "Fecha de nacimiento no puede ser futura"
    )
    .refine(
      (date) => {
        const age = new Date().getFullYear() - date.getFullYear();
        return age >= 0 && age <= 150;
      },
      "Fecha de nacimiento inválida"
    ),
  clinicNames: z.array(z.string()).min(1, "Al menos una clínica es requerida"),
});

export type CreateHealthUserSchema = z.infer<typeof createHealthUserSchema>;
