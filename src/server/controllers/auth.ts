import * as authService from "~/server/services/auth";
import {
  type FindUserByCiAndClinicIdSchema,
  type FindUserByIdSchema,
} from "~/server/schemas/auth";

export const findUserByCiAndClinicId = async (
  input: FindUserByCiAndClinicIdSchema,
) => {
  return await authService.findUserByCiAndClinicId(input);
};

export const findUserById = async (input: FindUserByIdSchema) => {
  return await authService.findUserById(input.id);
};
