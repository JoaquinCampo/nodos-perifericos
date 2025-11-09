import * as clinicService from "~/server/services/clinic";
import type {
  CreateClinicSchema,
  FindAllClinicsSchema,
} from "~/server/schemas/clinic";

export const findAllClinics = async (input?: FindAllClinicsSchema) => {
  return await clinicService.findAllClinics(input);
};

export const createClinic = async (input: CreateClinicSchema) => {
  return await clinicService.createClinic(input);
};

export const findClinicByName = async (clinicName: string) => {
  return await clinicService.findClinicByName(clinicName);
};
