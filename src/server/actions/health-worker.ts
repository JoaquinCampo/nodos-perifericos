"use server";

import { createSafeActionClient } from "next-safe-action";

import { requireClinicAdminContext } from "~/server/auth/utils";
import * as healthWorkerController from "~/server/controllers/health-worker";
import {
  createHealthWorkerSchema,
  fetchHealthWorkerFromHcenSchema,
  healthWorkerIdSchema,
  listHealthWorkersSchema,
  updateHealthWorkerSchema,
} from "~/server/schemas/health-worker";

const actionClient = createSafeActionClient();

export const listHealthWorkersAction = actionClient
  .inputSchema(listHealthWorkersSchema.omit({ clinicId: true }))
  .action(async ({ parsedInput }) => {
    const { clinicId } = await requireClinicAdminContext();

    return await healthWorkerController.listHealthWorkers({
      ...parsedInput,
      clinicId,
    });
  });

export const findHealthWorkerByIdAction = actionClient
  .inputSchema(healthWorkerIdSchema.omit({ clinicId: true }))
  .action(async ({ parsedInput }) => {
    const { clinicId } = await requireClinicAdminContext();

    return await healthWorkerController.findHealthWorkerById({
      ...parsedInput,
      clinicId,
    });
  });

export const createHealthWorkerAction = actionClient
  .inputSchema(createHealthWorkerSchema.omit({ clinicId: true }))
  .action(async ({ parsedInput }) => {
    const { clinicId } = await requireClinicAdminContext();

    return await healthWorkerController.createHealthWorker({
      ...parsedInput,
      clinicId,
    });
  });

export const updateHealthWorkerAction = actionClient
  .inputSchema(updateHealthWorkerSchema.omit({ clinicId: true }))
  .action(async ({ parsedInput }) => {
    const { clinicId } = await requireClinicAdminContext();

    return await healthWorkerController.updateHealthWorker({
      ...parsedInput,
      clinicId,
    });
  });

export const deleteHealthWorkerAction = actionClient
  .inputSchema(healthWorkerIdSchema.omit({ clinicId: true }))
  .action(async ({ parsedInput }) => {
    const { clinicId } = await requireClinicAdminContext();

    return await healthWorkerController.deleteHealthWorker({
      ...parsedInput,
      clinicId,
    });
  });

export const fetchHealthWorkerFromHcenAction = actionClient
  .inputSchema(fetchHealthWorkerFromHcenSchema)
  .action(async ({ parsedInput }) => {
    await requireClinicAdminContext();
    return await healthWorkerController.fetchHealthWorkerFromHcen(parsedInput);
  });
