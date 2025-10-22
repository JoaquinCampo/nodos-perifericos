import type { Prisma } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

import { db } from "~/server/db";
import type {
  CreateHealthWorkerSchema,
  HealthWorkerIdSchema,
  ListHealthWorkersSchema,
  UpdateHealthWorkerSchema,
} from "~/server/schemas/health-worker";

const healthWorkerInclude = {
  user: {
    select: {
      id: true,
      name: true,
      firstName: true,
      lastName: true,
      email: true,
      phone: true,
      ci: true,
      address: true,
      dateOfBirth: true,
      clinicId: true,
    },
  },
};

const formatDateOfBirth = (value?: string) => {
  if (!value) return undefined;
  return new Date(`${value}T00:00:00.000Z`);
};

const combineName = (firstName?: string | null, lastName?: string | null) => {
  return [firstName, lastName].filter(Boolean).join(" ").trim();
};

const extractUniqueConstraintMessage = (error: PrismaClientKnownRequestError) => {
  const target = error.meta?.target;
  const matchesTarget = (field: string) => {
    if (Array.isArray(target)) return target.includes(field);
    if (typeof target === "string") return target.includes(field);
    return false;
  };

  if (matchesTarget("email")) {
    return "Ya existe un usuario con este email en la clínica";
  }

  if (matchesTarget("ci")) {
    return "Ya existe un usuario con esta cédula en la clínica";
  }

  if (matchesTarget("phone")) {
    return "Ya existe un usuario con este teléfono en la clínica";
  }

  return "Ya existe un usuario con datos duplicados en la clínica";
};

export const listHealthWorkers = async (input: ListHealthWorkersSchema) => {
  const { clinicId, search } = input;
  const normalizedSearch = search?.trim();

  const healthWorkers = await db.healthWorker.findMany({
    where: {
      user: {
        clinicId,
        ...(normalizedSearch
          ? {
              OR: [
                { name: { contains: normalizedSearch, mode: "insensitive" } },
                { email: { contains: normalizedSearch, mode: "insensitive" } },
                { ci: { contains: normalizedSearch, mode: "insensitive" } },
                { phone: { contains: normalizedSearch, mode: "insensitive" } },
              ],
            }
          : {}),
      },
    },
    include: healthWorkerInclude,
    orderBy: {
      user: {
        name: "asc",
      },
    },
  });

  return healthWorkers;
};

export const findHealthWorkerById = async (input: HealthWorkerIdSchema) => {
  const { clinicId, healthWorkerId } = input;

  const healthWorker = await db.healthWorker.findFirst({
    where: {
      id: healthWorkerId,
      user: {
        clinicId,
      },
    },
    include: healthWorkerInclude,
  });

  if (!healthWorker) {
    throw new Error("Profesional de salud no encontrado para esta clínica");
  }

  return healthWorker;
};

export const createHealthWorker = async (input: CreateHealthWorkerSchema) => {
  const {
    clinicId,
    firstName,
    lastName,
    ci,
    email,
    phone,
    address,
    dateOfBirth,
  } = input;

  try {
    const healthWorker = await db.healthWorker.create({
      data: {
        user: {
          create: {
            clinicId,
            firstName,
            lastName,
            name: combineName(firstName, lastName) || email,
            ci,
            email,
            phone,
            address,
            dateOfBirth: formatDateOfBirth(dateOfBirth),
          },
        },
      },
      include: healthWorkerInclude,
    });

    return healthWorker;
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError && error.code === "P2002") {
      throw new Error(extractUniqueConstraintMessage(error));
    }

    throw error;
  }
};

export const updateHealthWorker = async (input: UpdateHealthWorkerSchema) => {
  const { clinicId, healthWorkerId, ...fields } = input;

  const existing = await db.healthWorker.findFirst({
    where: {
      id: healthWorkerId,
      user: {
        clinicId,
      },
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          firstName: true,
          lastName: true,
        },
      },
    },
  });

  if (!existing) {
    throw new Error("Profesional de salud no encontrado para esta clínica");
  }

  const nextFirstName =
    fields.firstName ?? existing.user.firstName ?? existing.user.name?.split(" ")[0] ?? "";

  const nextLastName =
    fields.lastName ??
    existing.user.lastName ??
    existing.user.name
      ?.split(" ")
      .slice(1)
      .join(" ") ??
    "";

  const updatePayload: Prisma.UserUpdateInput = {};

  if (fields.firstName !== undefined) updatePayload.firstName = fields.firstName;
  if (fields.lastName !== undefined) updatePayload.lastName = fields.lastName;
  if (fields.ci !== undefined) updatePayload.ci = fields.ci;
  if (fields.email !== undefined) updatePayload.email = fields.email;
  if (fields.phone !== undefined) updatePayload.phone = fields.phone;
  if (fields.address !== undefined) updatePayload.address = fields.address;
  if (fields.dateOfBirth !== undefined) {
    updatePayload.dateOfBirth = formatDateOfBirth(fields.dateOfBirth);
  }

  const combinedName = combineName(nextFirstName, nextLastName);
  if (combinedName) {
    updatePayload.name = combinedName;
  }

  try {
    await db.user.update({
      where: { id: existing.user.id },
      data: updatePayload,
    });
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError && error.code === "P2002") {
      throw new Error(extractUniqueConstraintMessage(error));
    }

    throw error;
  }

  return await findHealthWorkerById({ clinicId, healthWorkerId });
};

export const deleteHealthWorker = async (input: HealthWorkerIdSchema) => {
  const { clinicId, healthWorkerId } = input;

  const existing = await db.healthWorker.findFirst({
    where: {
      id: healthWorkerId,
      user: {
        clinicId,
      },
    },
    include: {
      user: {
        select: {
          id: true,
        },
      },
    },
  });

  if (!existing) {
    throw new Error("Profesional de salud no encontrado para esta clínica");
  }

  await db.user.delete({
    where: { id: existing.user.id },
  });

  return { success: true as const };
};
