"use server";

import { revalidatePath } from "next/cache";
import { Paths } from "~/lib/constants/paths";
import { actionClient } from "~/lib/safe-action";
import * as healthUserController from "~/server/controllers/health-user";
import {
  createAccessRequestSchema,
  createHealthUserSchema,
} from "~/server/schemas/health-user";

export const createHealthUserAction = actionClient
  .inputSchema(createHealthUserSchema)
  .action(async ({ parsedInput }) => {
    try {
      const createdHealthUser =
        await healthUserController.createHealthUser(parsedInput);
      revalidatePath(Paths.HealthUsers);
      return createdHealthUser;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error("Error al crear el usuario de salud");
    }
  });

export const createAccessRequestAction = actionClient
  .inputSchema(createAccessRequestSchema)
  .action(async ({ parsedInput }) => {
    try {
      const createdAccessRequest =
        await healthUserController.createAccessRequest(parsedInput);
      // Revalidate both the general health users page and the specific user page
      revalidatePath(Paths.HealthUsers);
      revalidatePath(`/usuarios-de-salud/${parsedInput.healthUserCi}`);
      return createdAccessRequest;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error("Error al crear la solicitud de acceso");
    }
  });
