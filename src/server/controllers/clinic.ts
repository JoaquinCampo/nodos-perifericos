import * as clinicService from "~/server/services/clinic";
import type { CreateClinicSchema } from "~/server/schemas/clinic";

export const findAllClinics = async () => {
  return await clinicService.findAllClinics();
};

export const createClinic = async (input: CreateClinicSchema) => {
  return await clinicService.createClinic(input);
};

export const findClinicByName = async (clinicName: string) => {
  return await clinicService.findClinicByName(clinicName);
};
