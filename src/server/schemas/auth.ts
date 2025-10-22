import z from "zod";

export const findUserByEmailAndClinicIdSchema = z.object({
  clinicId: z.string(),
  email: z.string().email("El email no es válido"),
});

export type FindUserByEmailAndClinicIdSchema = z.infer<
  typeof findUserByEmailAndClinicIdSchema
>;

export const findUserByIdSchema = z.object({
  id: z.string(),
});

export type FindUserByIdSchema = z.infer<typeof findUserByIdSchema>;

export const sendVerificationEmailSchema = z.object({
  email: z.string().email("El email no es válido"),
  clinicId: z.string(),
});

export type SendVerificationEmailSchema = z.infer<
  typeof sendVerificationEmailSchema
>;

export const signUpSchema = z.object({
  email: z.string().email("El email no es válido"),
  password: z.string().min(1, "La contraseña es requerida"),
  verificationCode: z.string().min(1, "El código de verificación es requerido"),
  token: z.string().min(1, "El token es requerido"),
});

export type SignUpSchema = z.infer<typeof signUpSchema>;

export const signInSchema = z.object({
  clinicId: z.string().min(1, "Debes seleccionar una clínica"),
  email: z.string().email("El email no es válido"),
  password: z.string().min(1, "La contraseña es requerida"),
});

export type SignInSchema = z.infer<typeof signInSchema>;
