import { db } from "~/server/db";
import type {
  CreateHealthWorkerSchema,
  DeleteHealthWorkerSchema,
  FindAllHealthWorkersSchema,
  UpdateHealthWorkerSchema,
} from "~/server/schemas/health-worker";
import {
  checkCanCreateHealthWorker,
  checkCanDeleteHealthWorker,
  checkCanFindAllHealthWorkers,
  checkCanUpdateHealthWorker,
} from "~/server/services/health-worker/utils";

export const findAllHealthWorkers = async (
  input: FindAllHealthWorkersSchema,
) => {
  const { clinicId } = input;

  await checkCanFindAllHealthWorkers(clinicId);

  return await db.healthWorker.findMany({
    where: {
      user: {
        clinicId,
      },
    },
    include: {
      user: {
        omit: {
          password: true,
        },
      },
      healthWorkerSpecialities: {
        include: {
          speciality: true,
        },
      },
    },
  });
};

export const createHealthWorker = async (input: CreateHealthWorkerSchema) => {
  const { clinicId, specialities, ...fields } = input;

  await checkCanCreateHealthWorker(clinicId);

  const existing = await db.user.findFirst({
    where: {
      clinicId,
      OR: [
        { email: fields.email },
        { ci: fields.ci },
        ...(fields.phone ? [{ phone: fields.phone }] : []),
      ],
    },
  });

  if (existing) {
    throw new Error("Ya existe un usuario con estos datos en la clínica");
  }

  return await db.healthWorker.create({
    data: {
      user: {
        create: {
          clinicId,
          ...fields,
        },
      },
      healthWorkerSpecialities: {
        create: specialities?.map((speciality) => ({
          speciality: {
            connectOrCreate: {
              where: {
                name: speciality.toLowerCase(),
              },
              create: {
                name: speciality.toLowerCase(),
              },
            },
          },
        })),
      },
    },
  });
};

export const updateHealthWorker = async (input: UpdateHealthWorkerSchema) => {
  const { healthWorkerId, specialities, ...fields } = input;

  await checkCanUpdateHealthWorker(healthWorkerId);

  const currentHealthWorker = await db.healthWorker.findUnique({
    where: { id: healthWorkerId },
    include: { user: true },
  });

  if (!currentHealthWorker) {
    throw new Error("Profesional de salud no encontrado");
  }

  const existing = await db.user.findFirst({
    where: {
      clinicId: currentHealthWorker.user.clinicId,
      id: {
        not: currentHealthWorker.userId,
      },
      OR: [
        { email: fields.email },
        { ci: fields.ci },
        ...(fields.phone ? [{ phone: fields.phone }] : []),
      ],
    },
  });

  if (existing) {
    throw new Error("Ya existe un usuario con estos datos en la clínica");
  }

  return await db.healthWorker.update({
    where: { id: healthWorkerId },
    data: {
      user: {
        update: fields,
      },
      healthWorkerSpecialities: {
        deleteMany: {},
        create: specialities?.map((speciality) => ({
          speciality: {
            connectOrCreate: {
              where: { name: speciality.toLowerCase() },
              create: {
                name: speciality.toLowerCase(),
              },
            },
          },
        })),
      },
    },
  });
};

export const deleteHealthWorker = async (input: DeleteHealthWorkerSchema) => {
  const { healthWorkerId } = input;

  await checkCanDeleteHealthWorker(healthWorkerId);

  const healthWorker = await db.healthWorker.findUnique({
    where: { id: healthWorkerId },
    select: { userId: true },
  });

  if (!healthWorker) {
    throw new Error("Profesional de salud no encontrado");
  }

  return await db.user.delete({
    where: { id: healthWorker.userId },
  });
};
