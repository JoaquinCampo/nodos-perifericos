import * as clinicalHistoryService from "~/server/services/health-user";

export const findClinicalHistory = async (healthUserCi: string) => {
  return await clinicalHistoryService.findClinicalHistory(healthUserCi);
};
