import * as authService from "~/server/services/auth";
import {
  type FindUserByEmailAndClinicIdSchema,
  type FindUserByIdSchema,
  type SendVerificationEmailSchema,
  type SignUpSchema,
} from "~/server/schemas/auth";

export const findUserByEmailAndClinicId = async (
  input: FindUserByEmailAndClinicIdSchema,
) => {
  return await authService.findUserByEmailAndClinicId(input);
};

export const findUserById = async (input: FindUserByIdSchema) => {
  return await authService.findUserById(input.id);
};

export const sendVerificationEmail = async (
  input: SendVerificationEmailSchema,
) => {
  return await authService.sendVerificationEmail(input);
};

export const signUp = async (input: SignUpSchema) => {
  return await authService.signUp(input);
};
