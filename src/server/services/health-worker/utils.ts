import { auth } from "~/server/auth";
import { db } from "~/server/db";

export const checkCanFindAllHealthWorkers = async (clinicId: string) => {
  const session = await auth();

  if (session?.user.clinic.id !== clinicId) {
    throw new Error(
      "No tienes permisos para ver los profesionales de esta clínica",
    );
  }
};

export const checkCanCreateHealthWorker = async (clinicId: string) => {
  const session = await auth();

  if (!session?.user.clinicAdmin || session?.user.clinic.id !== clinicId) {
    throw new Error(
      "No tienes permisos para crear un profesional en esta clínica",
    );
  }
};

export const checkCanUpdateHealthWorker = async (healthWorkerId: string) => {
  const session = await auth();

  if (
    !session?.user.clinicAdmin &&
    session?.user.healthWorker?.id !== healthWorkerId
  ) {
    throw new Error("No tienes permisos para actualizar este profesional");
  }

  const healthWorker = await db.healthWorker.findUnique({
    where: {
      id: healthWorkerId,
    },
    include: {
      user: true,
    },
  });

  if (session?.user.clinic.id !== healthWorker?.user.clinicId) {
    throw new Error("No tienes permisos para actualizar este profesional");
  }
};

export const checkCanDeleteHealthWorker = async (healthWorkerId: string) => {
  const session = await auth();

  if (!session?.user.clinicAdmin) {
    throw new Error("No tienes permisos para eliminar este profesional");
  }

  const healthWorker = await db.healthWorker.findUnique({
    where: {
      id: healthWorkerId,
    },
    include: {
      user: true,
    },
  });

  if (session?.user.clinic.id !== healthWorker?.user.clinicId) {
    throw new Error("No tienes permisos para eliminar este profesional");
  }
};
