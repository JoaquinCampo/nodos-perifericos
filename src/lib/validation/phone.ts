import z from "zod";

export const phoneSchema = z
  .string()
  .min(1, "El teléfono es requerido")
  .regex(/^\+[1-9]\d{1,14}$/, "El formato del teléfono no es válido");

export const phoneOrUndefinedSchema = z
  .string()
  .optional()
  .refine(
    (val) => !val || /^\+[1-9]\d{1,14}$/.test(val),
    "El formato del teléfono no es válido",
  )
  .transform((val) => val ?? undefined);
