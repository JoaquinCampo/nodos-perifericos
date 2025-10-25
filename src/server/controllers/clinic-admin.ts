import type {
  CreateClinicAdminSchema,
  DeleteClinicAdminSchema,
  FindAllClinicAdminsSchema,
  UpdateClinicAdminSchema,
} from "~/server/schemas/clinic-admin";
import * as clinicAdminService from "~/server/services/clinic-admin";

export const findAllClinicAdmins = async (input: FindAllClinicAdminsSchema) => {
  return await clinicAdminService.findAllClinicAdmins(input);
};

export const createClinicAdmin = async (input: CreateClinicAdminSchema) => {
  return await clinicAdminService.createClinicAdmin(input);
};

export const updateClinicAdmin = async (input: UpdateClinicAdminSchema) => {
  return await clinicAdminService.updateClinicAdmin(input);
};

export const deleteClinicAdmin = async (input: DeleteClinicAdminSchema) => {
  return await clinicAdminService.deleteClinicAdmin(input);
};
