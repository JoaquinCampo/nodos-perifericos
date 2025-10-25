import type {
  CreateHealthWorkerSchema,
  DeleteHealthWorkerSchema,
  FindAllHealthWorkersSchema,
  UpdateHealthWorkerSchema,
} from "~/server/schemas/health-worker";
import * as healthWorkerService from "~/server/services/health-worker";

export const findAllHealthWorkers = async (
  input: FindAllHealthWorkersSchema,
) => {
  return await healthWorkerService.findAllHealthWorkers(input);
};

export const createHealthWorker = async (input: CreateHealthWorkerSchema) => {
  return await healthWorkerService.createHealthWorker(input);
};

export const updateHealthWorker = async (input: UpdateHealthWorkerSchema) => {
  return await healthWorkerService.updateHealthWorker(input);
};

export const deleteHealthWorker = async (input: DeleteHealthWorkerSchema) => {
  return await healthWorkerService.deleteHealthWorker(input);
};
