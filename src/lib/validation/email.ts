import z from "zod";

export const emailOrUndefinedSchema = z
  .string()
  .optional()
  .transform((val) => (val === "" ? undefined : val))
  .pipe(z.string().email("El email no es válido").optional());
