"use server";

import { revalidatePath } from "next/cache";
import { Paths } from "~/lib/constants/paths";
import { actionClient } from "~/lib/safe-action";
import * as clinicAdminController from "~/server/controllers/clinic-admin";
import {
  createClinicAdminSchema,
  deleteClinicAdminSchema,
  updateClinicAdminSchema,
} from "~/server/schemas/clinic-admin";

export const createClinicAdminAction = actionClient
  .inputSchema(createClinicAdminSchema)
  .action(async ({ parsedInput }) => {
    try {
      const createdClinicAdmin =
        await clinicAdminController.createClinicAdmin(parsedInput);
      revalidatePath(Paths.ClinicAdmins);
      return createdClinicAdmin;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error("Error al crear el administrador");
    }
  });

export const updateClinicAdminAction = actionClient
  .inputSchema(updateClinicAdminSchema)
  .action(async ({ parsedInput }) => {
    try {
      const updatedClinicAdmin =
        await clinicAdminController.updateClinicAdmin(parsedInput);
      revalidatePath(Paths.ClinicAdmins);
      return updatedClinicAdmin;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error("Error al actualizar el administrador");
    }
  });

export const deleteClinicAdminAction = actionClient
  .inputSchema(deleteClinicAdminSchema)
  .action(async ({ parsedInput }) => {
    try {
      const deletedClinicAdmin =
        await clinicAdminController.deleteClinicAdmin(parsedInput);
      revalidatePath(Paths.ClinicAdmins);
      return deletedClinicAdmin;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error("Error al eliminar el administrador");
    }
  });
