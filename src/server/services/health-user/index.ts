import { db } from "~/server/db";

export const findClinicalHistory = async (healthUserCi: string) => {
  return await db.clinicalDocument.findMany({
    where: { healthUserCi },
    include: {
      clinic: true,
      healthWorker: true,
    },
  });
};
