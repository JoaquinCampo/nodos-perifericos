import { auth } from "~/server/auth";
import type {
  CreateAccessRequestSchema,
  FindAllAccessRequestsSchema,
  FindHealthUserClinicalHistorySchema,
} from "~/server/schemas/health-user";

export const checkCanFindAllHealthUsers = async () => {
  const session = await auth();

  if (!session) {
    throw new Error("No tienes permisos para ver los usuarios de salud");
  }
};

export const checkCanCreateHealthUser = async () => {
  const session = await auth();

  if (!session?.user.clinicAdmin) {
    throw new Error("No tienes permisos para crear usuarios de salud");
  }

  return session.user.clinic.name;
};

export const checkCanFindHealthUserClinicalHistory = async (
  input: FindHealthUserClinicalHistorySchema,
) => {
  const session = await auth();

  if (
    !session?.user.healthWorker ||
    session?.user.clinic.name !== input.clinicName ||
    session?.user.ci !== input.healthWorkerCi
  ) {
    throw new Error(
      "No tienes permisos para ver el historial clínico de este usuario",
    );
  }
};

export const checkCanCreateAccessRequest = async (
  input: CreateAccessRequestSchema,
) => {
  const session = await auth();

  if (!session?.user.healthWorker) {
    throw new Error("No tienes permisos para crear solicitudes de acceso");
  }

  if (session?.user.clinic.name !== input.clinicName) {
    throw new Error(
      "No tienes permisos para crear solicitudes de acceso en esta clínica",
    );
  }

  if (session?.user.ci !== input.healthWorkerCi) {
    throw new Error(
      "No tienes permisos para crear solicitudes de acceso para este profesional",
    );
  }
};

export const checkCanFindAllAccessRequests = async (
  input: FindAllAccessRequestsSchema,
) => {
  const session = await auth();

  if (!session?.user.healthWorker) {
    throw new Error("No tienes permisos para ver las solicitudes de acceso");
  }

  if (session?.user.clinic.name !== input.clinicName) {
    throw new Error(
      "No tienes permisos para ver las solicitudes de acceso en esta clínica",
    );
  }

  if (session?.user.ci !== input.healthWorkerCi) {
    throw new Error(
      "No tienes permisos para ver las solicitudes de acceso para este profesional",
    );
  }
};
