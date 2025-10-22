import type { Prisma } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

import { db } from "~/server/db";
import type {
  ClinicAdminIdSchema,
  CreateClinicAdminSchema,
  FindAllClinicAdminsSchema,
  UpdateClinicAdminSchema,
} from "~/server/schemas/clinic-admin";

const clinicAdminInclude = {
  user: {
    select: {
      id: true,
      ci: true,
      firstName: true,
      lastName: true,
      email: true,
      phone: true,
      createdAt: true,
    },
  },
};

const combineName = (firstName?: string | null, lastName?: string | null) => {
  return [firstName, lastName].filter(Boolean).join(" ").trim();
};

const extractUniqueConstraintMessage = (
  error: PrismaClientKnownRequestError,
) => {
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

export const findAllClinicAdmins = async (input: FindAllClinicAdminsSchema) => {
  const { clinicId } = input;

  return await db.clinicAdmin.findMany({
    where: {
      user: {
        clinicId,
      },
    },
    include: clinicAdminInclude,
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const findClinicAdminById = async (input: ClinicAdminIdSchema) => {
  const { clinicId, clinicAdminId } = input;

  const clinicAdmin = await db.clinicAdmin.findFirst({
    where: {
      id: clinicAdminId,
      user: {
        clinicId,
      },
    },
    include: clinicAdminInclude,
  });

  if (!clinicAdmin) {
    throw new Error("Administrador no encontrado para esta clínica");
  }

  return clinicAdmin;
};

export const createClinicAdmin = async (input: CreateClinicAdminSchema) => {
  const { clinicId, firstName, lastName, ci, email, phone } = input;

  try {
    const clinicAdmin = await db.clinicAdmin.create({
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
          },
        },
      },
      include: clinicAdminInclude,
    });

    return clinicAdmin;
  } catch (error) {
    if (
      error instanceof PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw new Error(extractUniqueConstraintMessage(error));
    }

    throw error;
  }
};

export const updateClinicAdmin = async (input: UpdateClinicAdminSchema) => {
  const { clinicId, clinicAdminId, ...fields } = input;

  const existing = await db.clinicAdmin.findFirst({
    where: {
      id: clinicAdminId,
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
    throw new Error("Administrador no encontrado para esta clínica");
  }

  const nextFirstName =
    fields.firstName ??
    existing.user.firstName ??
    existing.user.name?.split(" ")[0] ??
    "";

  const nextLastName =
    fields.lastName ??
    existing.user.lastName ??
    existing.user.name?.split(" ").slice(1).join(" ") ??
    "";

  const updatePayload: Prisma.UserUpdateInput = {};

  if (fields.firstName !== undefined)
    updatePayload.firstName = fields.firstName;
  if (fields.lastName !== undefined) updatePayload.lastName = fields.lastName;
  if (fields.ci !== undefined) updatePayload.ci = fields.ci;
  if (fields.email !== undefined) updatePayload.email = fields.email;
  if (fields.phone !== undefined) updatePayload.phone = fields.phone;

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
    if (
      error instanceof PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw new Error(extractUniqueConstraintMessage(error));
    }

    throw error;
  }

  return await findClinicAdminById({ clinicId, clinicAdminId });
};

export const deleteClinicAdmin = async (input: ClinicAdminIdSchema) => {
  const { clinicId, clinicAdminId } = input;

  const existing = await db.clinicAdmin.findFirst({
    where: {
      id: clinicAdminId,
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
    throw new Error("Administrador no encontrado para esta clínica");
  }

  await db.user.delete({
    where: { id: existing.user.id },
  });

  return { success: true as const };
};
