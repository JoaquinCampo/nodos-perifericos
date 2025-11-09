import * as healthUserService from "~/server/services/health-user";
import type {
  CreateHealthUserSchema,
  FindAllHealthUsersSchema,
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
