import { db } from "~/server/db";

export const findAllHealthUsers = async (clinicId: string) => {
  return await db.user.findMany({
    where: {
      clinicId,
      ci: {
        not: null, // Only users with CI (health users)
      },
    },
    orderBy: [
      { firstName: 'asc' },
      { lastName: 'asc' },
    ],
  });
};

export const findClinicalHistory = async (healthUserCi: string) => {
  return await db.clinicalDocument.findMany({
    where: { healthUserCi },
    include: {
      clinic: true,
      healthWorker: {
        include: {
          user: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};
