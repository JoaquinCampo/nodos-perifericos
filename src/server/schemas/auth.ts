import z from "zod";

export const findUserByEmailAndClinicIdSchema = z.object({
  clinicId: z.string(),
  ci: z.string(),
});

export type FindUserByCiAndClinicIdSchema = z.infer<
  typeof findUserByEmailAndClinicIdSchema
>;

export const findUserByIdSchema = z.object({
  id: z.string(),
});

export type FindUserByIdSchema = z.infer<typeof findUserByIdSchema>;
