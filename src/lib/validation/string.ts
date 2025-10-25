import z from "zod";

export const stringOrUndefinedSchema = z
  .string()
  .optional()
  .transform((val) => (val === "" ? undefined : val));
