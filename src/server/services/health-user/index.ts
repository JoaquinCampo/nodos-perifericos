import type {
  CreateHealthUserSchema,
  FindAllHealthUsersSchema,
} from "~/server/schemas/health-user";
import {
  checkCanCreateHealthUser,
  checkCanFindAllHealthUsers,
} from "~/server/services/health-user/utils";
import type { FindAllHealthUsersResponse, HealthUser } from "./types";
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
