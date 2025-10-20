"use server";

import { signIn } from "~/server/auth";
import { createSafeActionClient } from "next-safe-action";
import { z } from "zod";
import { redirect } from "next/navigation";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import * as authController from "~/server/controllers/auth";
import {
  sendVerificationEmailSchema,
  signUpSchema,
} from "~/server/schemas/auth";

const actionClient = createSafeActionClient();

const signInSchema = z.object({
  clinicId: z.string().min(1, "Debes seleccionar una clínica"),
  ci: z.string().min(1, "La cédula es requerida"),
  password: z.string().min(1, "La contraseña es requerida"),
});

export const signInAction = actionClient
  .inputSchema(signInSchema)
  .action(async ({ parsedInput: { clinicId, ci, password } }) => {
    try {
      await signIn("credentials", {
        clinicId,
        ci,
        password,
        redirect: false,
      });
    } catch (error) {
      if (isRedirectError(error)) {
        throw error;
      }

      throw new Error("Clínica, CI o contraseña incorrectos");
    }

    redirect("/");
  });

export const sendVerificationEmailAction = actionClient
  .inputSchema(sendVerificationEmailSchema)
  .action(async ({ parsedInput }) => {
    try {
      const result = await authController.sendVerificationEmail(parsedInput);
      return result;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error("Error al enviar el email de verificación");
    }
  });

export const signUpAction = actionClient
  .inputSchema(signUpSchema)
  .action(async ({ parsedInput }) => {
    try {
      await authController.signUp(parsedInput);
      return { success: true };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error("Error al completar el registro");
    }
  });
