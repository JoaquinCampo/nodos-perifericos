import z from "zod";

export const dateOfBirthSchema = z.coerce
  .date()
  .refine(
    (val) => val instanceof Date && val < new Date(),
    "La fecha de nacimiento debe ser anterior a la fecha actual",
  );

export const dateOfBirthOrUndefinedSchema = z.coerce
  .date()
  .optional()
  .refine(
    (val) => !val || (val instanceof Date && val < new Date()),
    "La fecha de nacimiento debe ser anterior a la fecha actual",
  )
  .transform((val) => val ?? undefined);

export const dateOfBirthOrNullOrUndefinedSchema = z.coerce
  .date()
  .nullable()
  .optional()
  .refine(
    (val) => !val || (val instanceof Date && val < new Date()),
    "La fecha de nacimiento debe ser anterior a la fecha actual",
  );
