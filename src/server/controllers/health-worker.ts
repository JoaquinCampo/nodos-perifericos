import * as healthWorkerService from "~/server/services/health-worker";
import type {
  CreateHealthWorkerSchema,
  FetchHealthWorkerFromHcenSchema,
  HealthWorkerIdSchema,
  ListHealthWorkersSchema,
  UpdateHealthWorkerSchema,
} from "~/server/schemas/health-worker";

export const listHealthWorkers = async (input: ListHealthWorkersSchema) => {
  return await healthWorkerService.listHealthWorkers(input);
};

export const findHealthWorkerById = async (input: HealthWorkerIdSchema) => {
  return await healthWorkerService.findHealthWorkerById(input);
};

export const createHealthWorker = async (input: CreateHealthWorkerSchema) => {
  return await healthWorkerService.createHealthWorker(input);
};

export const updateHealthWorker = async (input: UpdateHealthWorkerSchema) => {
  return await healthWorkerService.updateHealthWorker(input);
};

export const deleteHealthWorker = async (input: HealthWorkerIdSchema) => {
  return await healthWorkerService.deleteHealthWorker(input);
};

export const fetchHealthWorkerFromHcen = async (
  input: FetchHealthWorkerFromHcenSchema,
) => {
  return await healthWorkerService.fetchHealthWorkerFromHcen(input);
};
