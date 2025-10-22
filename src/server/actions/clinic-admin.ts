"use server";

import { createSafeActionClient } from "next-safe-action";
import { revalidatePath } from "next/cache";

import { requireClinicAdminContext } from "~/server/auth/utils";
import * as clinicAdminController from "~/server/controllers/clinic-admin";
import {
  clinicAdminIdSchema,
  createClinicAdminSchema,
  updateClinicAdminSchema,
} from "~/server/schemas/clinic-admin";

const actionClient = createSafeActionClient();

export const createClinicAdminAction = actionClient
  .inputSchema(createClinicAdminSchema.omit({ clinicId: true }))
  .action(async ({ parsedInput }) => {
    const { clinicId } = await requireClinicAdminContext();

    const result = await clinicAdminController.createClinicAdmin({
      ...parsedInput,
      clinicId,
    });

    revalidatePath("/admin/administradores");

    return result;
  });

export const updateClinicAdminAction = actionClient
  .inputSchema(updateClinicAdminSchema.omit({ clinicId: true }))
  .action(async ({ parsedInput }) => {
    const { clinicId } = await requireClinicAdminContext();

    const result = await clinicAdminController.updateClinicAdmin({
      ...parsedInput,
      clinicId,
    });

    revalidatePath("/admin/administradores");

    return result;
  });

export const deleteClinicAdminAction = actionClient
  .inputSchema(clinicAdminIdSchema.omit({ clinicId: true }))
  .action(async ({ parsedInput }) => {
    const { clinicId, sessionUserId } = await requireClinicAdminContext();

    const clinicAdmin = await clinicAdminController.findClinicAdminById({
      ...parsedInput,
      clinicId,
    });

    if (clinicAdmin.user.id === sessionUserId) {
      throw new Error("No puedes eliminar tu propia cuenta de administrador");
    }

    const result = await clinicAdminController.deleteClinicAdmin({
      ...parsedInput,
      clinicId,
    });

    revalidatePath("/admin/administradores");

    return result;
  });
