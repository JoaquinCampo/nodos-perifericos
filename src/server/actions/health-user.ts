"use server";

import { revalidatePath } from "next/cache";
import { Paths } from "~/lib/constants/paths";
import { actionClient } from "~/lib/safe-action";
import * as healthUserController from "~/server/controllers/health-user";
import { createHealthUserSchema } from "~/server/schemas/health-user";

export const createHealthUserAction = actionClient
  .inputSchema(createHealthUserSchema)
  .action(async ({ parsedInput }) => {
    try {
      const createdHealthUser = await healthUserController.createHealthUserController(parsedInput);
      revalidatePath(Paths.HealthUsers);
      return createdHealthUser;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error("Error al crear el usuario de salud");
    }
  });
