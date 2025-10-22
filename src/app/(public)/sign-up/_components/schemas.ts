import { z } from "zod";

export const signUpFormSchema = z
  .object({
    clinicId: z.string().min(1, "Debes seleccionar una clínica"),
    email: z.string().email("El email no es válido"),
    password: z
      .string()
      .min(8, "La contraseña debe tener al menos 8 caracteres"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

export const otpSchema = z.object({
  verificationCode: z
    .string()
    .length(6, "El código debe tener 6 dígitos")
    .regex(/^\d+$/, "El código debe contener solo números"),
});

export type SignUpFormValues = z.infer<typeof signUpFormSchema>;
export type OTPValues = z.infer<typeof otpSchema>;
