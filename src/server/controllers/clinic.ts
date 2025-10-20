import * as clinicService from "~/server/services/clinic";

export const findAllClinics = async () => {
  return await clinicService.findAll();
};
