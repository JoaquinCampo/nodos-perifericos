"use server";

import { signIn } from "~/server/auth";
import { createSafeActionClient } from "next-safe-action";
import { z } from "zod";
import { redirect } from "next/navigation";
import { isRedirectError } from "next/dist/client/components/redirect-error";

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
