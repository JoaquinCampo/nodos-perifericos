import { db } from "~/server/db";
import type {
  CreateClinicAdminSchema,
  DeleteClinicAdminSchema,
  FindAllClinicAdminsSchema,
  UpdateClinicAdminSchema,
} from "~/server/schemas/clinic-admin";
import {
  checkCanCreateClinicAdmin,
  checkCanDeleteClinicAdmin,
  checkCanFindAllClinicAdmins,
  checkCanUpdateClinicAdmin,
} from "~/server/services/clinic-admin/utils";

export const findAllClinicAdmins = async (input: FindAllClinicAdminsSchema) => {
  const { clinicId } = input;

  await checkCanFindAllClinicAdmins(clinicId);

  return await db.clinicAdmin.findMany({
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
    },
  });
};

export const createClinicAdmin = async (input: CreateClinicAdminSchema) => {
  const { clinicId, ...fields } = input;

  await checkCanCreateClinicAdmin(clinicId);

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

  return await db.clinicAdmin.create({
    data: {
      user: {
        create: {
          clinicId,
          ...fields,
        },
      },
    },
  });
};

export const updateClinicAdmin = async (input: UpdateClinicAdminSchema) => {
  const { clinicAdminId, ...fields } = input;

  await checkCanUpdateClinicAdmin(clinicAdminId);

  const currentClinicAdmin = await db.clinicAdmin.findUnique({
    where: { id: clinicAdminId },
    include: { user: true },
  });

  if (!currentClinicAdmin) {
    throw new Error("Administrador no encontrado");
  }

  const existing = await db.user.findFirst({
    where: {
      clinicId: currentClinicAdmin.user.clinicId,
      id: {
        not: currentClinicAdmin.userId,
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

  return db.clinicAdmin.update({
    where: { id: clinicAdminId },
    data: {
      user: {
        update: fields,
      },
    },
  });
};

export const deleteClinicAdmin = async (input: DeleteClinicAdminSchema) => {
  const { clinicAdminId } = input;

  await checkCanDeleteClinicAdmin(clinicAdminId);

  const clinicAdmin = await db.clinicAdmin.findUnique({
    where: { id: clinicAdminId },
    select: { userId: true },
  });

  if (!clinicAdmin) {
    throw new Error("Administrador no encontrado");
  }

  return await db.user.delete({
    where: { id: clinicAdmin.userId },
  });
};
