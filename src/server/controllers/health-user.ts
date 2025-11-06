import { createHealthUser, type CreateHealthUserData } from "~/lib/hcen-api/health-users";
import * as clinicalHistoryService from "~/server/services/health-user";
import type { CreateHealthUserSchema } from "~/server/schemas/health-user";

export const createHealthUserController = async (data: CreateHealthUserSchema) => {
  // Transform the data to match HCEN's expected format
  const hcenData: CreateHealthUserData = {
    ci: data.ci,
    firstName: data.firstName,
    lastName: data.lastName,
    gender: data.gender,
    email: data.email,
    dateOfBirth: data.dateOfBirth.toISOString().split('T')[0]!,
    clinicNames: data.clinicNames,
  };

  // Add optional fields only if they exist
  if (data.phone) {
    hcenData.phone = data.phone;
  }
  if (data.address) {
    hcenData.address = data.address;
  }

  return await createHealthUser(hcenData);
};

export const findClinicalHistory = async (healthUserCi: string) => {
  return await clinicalHistoryService.findClinicalHistory(healthUserCi);
};
