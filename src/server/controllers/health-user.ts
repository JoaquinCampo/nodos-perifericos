import * as healthUserService from "~/server/services/health-user";
import type {
  CreateAccessRequestSchema,
  CreateHealthUserSchema,
  FindAllAccessRequestsSchema,
  FindAllHealthUsersSchema,
  FindHealthUserClinicalHistorySchema,
} from "~/server/schemas/health-user";

export const findAllHealthUsers = async (input: FindAllHealthUsersSchema) => {
  return await healthUserService.findAllHealthUsers(input);
};

export const createHealthUser = async (input: CreateHealthUserSchema) => {
  return await healthUserService.createHealthUser(input);
};

export const findClinicalHistory = async (healthUserCi: string) => {
  return await healthUserService.findClinicalHistory(healthUserCi);
};

export const findHealthUserClinicalHistory = async (
  input: FindHealthUserClinicalHistorySchema,
) => {
  return await healthUserService.findHealthUserClinicalHistory(input);
};

export const createAccessRequest = async (input: CreateAccessRequestSchema) => {
  return await healthUserService.createAccessRequest(input);
};

export const findAllAccessRequests = async (
  input: FindAllAccessRequestsSchema,
) => {
  return await healthUserService.findAllAccessRequests(input);
};
