"use server";

import { actionClient } from "~/lib/safe-action";
import {
  updateConfigurationSchema,
  resetConfigurationSchema,
} from "~/server/schemas/configuration";
import * as configurationController from "~/server/controllers/configuration";
import { revalidatePath } from "next/cache";
import { Paths } from "~/lib/constants/paths";
import { DEFAULT_CONFIGURATION } from "~/lib/constants/configuration";

export const updateConfigurationAction = actionClient
  .inputSchema(updateConfigurationSchema)
  .action(async ({ parsedInput }) => {
    try {
      const updatedConfiguration =
        await configurationController.updateConfiguration(parsedInput);

      revalidatePath(Paths.Configuration);

      return updatedConfiguration;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error("Error al actualizar la configuración");
    }
  });

export const resetConfigurationAction = actionClient
  .inputSchema(resetConfigurationSchema)
  .action(async ({ parsedInput }) => {
    try {
      const resetConfiguration =
        await configurationController.updateConfiguration({
          configurationId: parsedInput.configurationId,
          ...DEFAULT_CONFIGURATION,
        });

      revalidatePath(Paths.Configuration);

      return resetConfiguration;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error("Error al restablecer la configuración");
    }
  });
