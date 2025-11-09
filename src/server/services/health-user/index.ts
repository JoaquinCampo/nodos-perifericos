import type {
  CreateAccessRequestSchema,
  CreateHealthUserSchema,
  FindAllAccessRequestsSchema,
  FindAllHealthUsersSchema,
  FindHealthUserClinicalHistorySchema,
} from "~/server/schemas/health-user";
import {
  checkCanCreateAccessRequest,
  checkCanCreateHealthUser,
  checkCanFindAllAccessRequests,
  checkCanFindAllHealthUsers,
  checkCanFindHealthUserClinicalHistory,
} from "~/server/services/health-user/utils";
import type {
  FindAllAccessRequestsResponse,
  FindAllHealthUsersResponse,
  FindHealthUserByCiResponse,
  HealthUser,
} from "~/server/services/health-user/types";
import { fetchApi } from "~/lib/hcen-api";
import { db } from "~/server/db";

export const findAllHealthUsers = async (input: FindAllHealthUsersSchema) => {
  const { pageIndex, pageSize, name, ci, clinic } = input;

  await checkCanFindAllHealthUsers();

  try {
    return await fetchApi<FindAllHealthUsersResponse>({
      path: "health-users",
      method: "GET",
      searchParams: {
        pageIndex: pageIndex.toString(),
        pageSize: pageSize.toString(),
        ...(name && { name }),
        ...(ci && { ci }),
        ...(clinic && { clinic }),
      },
    });
  } catch (error) {
    console.error("Error fetching health users:", error);
    throw new Error("Error al obtener los usuarios de salud", { cause: error });
  }
};

export const createHealthUser = async (input: CreateHealthUserSchema) => {
  const clinicName = await checkCanCreateHealthUser();

  try {
    const dateOfBirth = input.dateOfBirth.toISOString().split("T")[0];

    return await fetchApi<HealthUser>({
      path: "health-users",
      method: "POST",
      body: {
        ci: input.ci,
        firstName: input.firstName,
        lastName: input.lastName,
        gender: input.gender,
        email: input.email,
        phone: input.phone ?? null,
        address: input.address ?? null,
        dateOfBirth,
        clinicNames: [clinicName],
      },
    });
  } catch (error) {
    console.error("Error creating health user:", error);
    throw new Error("Error al crear el usuario de salud", { cause: error });
  }
};

export const findClinicalHistory = async (healthUserCi: string) => {
  return await db.clinicalDocument.findMany({
    where: {
      healthUserCi,
    },
    include: {
      clinic: true,
      healthWorker: {
        include: {
          user: {
            omit: {
              password: true,
            },
          },
        },
      },
    },
  });
};

export const findHealthUserClinicalHistory = async (
  input: FindHealthUserClinicalHistorySchema,
) => {
  const { healthUserCi, clinicName, healthWorkerCi } = input;

  await checkCanFindHealthUserClinicalHistory(input);

  try {
    return await fetchApi<FindHealthUserByCiResponse>({
      path: `health-users/${healthUserCi}/clinical-history`,
      method: "GET",
      searchParams: {
        clinicName: clinicName,
        healthWorkerCi: healthWorkerCi,
      },
    });
  } catch (error) {
    console.error("Error fetching health user by CI:", error);
    throw new Error(
      "Error al obtener la historia clínica del usuario de salud",
      { cause: error },
    );
  }
};

export const createAccessRequest = async (input: CreateAccessRequestSchema) => {
  await checkCanCreateAccessRequest(input);

  try {
    await fetchApi<void>({
      path: "access-requests",
      method: "POST",
      body: input,
    });
  } catch (error) {
    console.error("Error creating access request:", error);
    throw new Error("Error al crear la solicitud de acceso", { cause: error });
  }
};

export const findAllAccessRequests = async (
  input: FindAllAccessRequestsSchema,
) => {
  await checkCanFindAllAccessRequests(input);

  try {
    return await fetchApi<FindAllAccessRequestsResponse>({
      path: "access-requests",
      method: "GET",
      searchParams: {
        ...(input.healthUserCi && { healthUserCi: input.healthUserCi }),
        ...(input.healthWorkerCi && { healthWorkerCi: input.healthWorkerCi }),
        ...(input.clinicName && { clinicName: input.clinicName }),
      },
    });
  } catch (error) {
    console.error("Error fetching access requests:", error);
    throw new Error("Error al obtener las solicitudes de acceso", {
      cause: error,
    });
  }
};
