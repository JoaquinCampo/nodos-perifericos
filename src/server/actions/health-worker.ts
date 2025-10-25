"use server";

import { revalidatePath } from "next/cache";
import { actionClient } from "~/lib/safe-action";
import * as healthWorkerController from "~/server/controllers/health-worker";
import {
  createHealthWorkerSchema,
  deleteHealthWorkerSchema,
  updateHealthWorkerSchema,
} from "~/server/schemas/health-worker";

export const createHealthWorkerAction = actionClient
  .inputSchema(createHealthWorkerSchema)
  .action(async ({ parsedInput }) => {
    try {
      const createdHealthWorker =
        await healthWorkerController.createHealthWorker(parsedInput);
      revalidatePath("/profesionales-de-salud");
      return createdHealthWorker;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error("Error al crear el profesional de salud");
    }
  });

export const updateHealthWorkerAction = actionClient
  .inputSchema(updateHealthWorkerSchema)
  .action(async ({ parsedInput }) => {
    try {
      const updatedHealthWorker =
        await healthWorkerController.updateHealthWorker(parsedInput);
      revalidatePath("/profesionales-de-salud");
      return updatedHealthWorker;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error("Error al actualizar el profesional de salud");
    }
  });

export const deleteHealthWorkerAction = actionClient
  .inputSchema(deleteHealthWorkerSchema)
  .action(async ({ parsedInput }) => {
    try {
      const deletedHealthWorker =
        await healthWorkerController.deleteHealthWorker(parsedInput);
      revalidatePath("/profesionales-de-salud");
      return deletedHealthWorker;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error("Error al eliminar el profesional de salud");
    }
  });
