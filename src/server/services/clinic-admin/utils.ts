import { auth } from "~/server/auth";
import { db } from "~/server/db";

export const checkCanFindAllClinicAdmins = async (clinicId: string) => {
  const session = await auth();

  if (session?.user.clinic.id !== clinicId) {
    throw new Error(
      "No tienes permisos para ver los administradores de esta clínica",
    );
  }
};

export const checkCanCreateClinicAdmin = async (clinicId: string) => {
  const session = await auth();

  if (session?.user.clinic.id !== clinicId) {
    throw new Error(
      "No tienes permisos para crear administradores en esta clínica",
    );
  }
};

export const checkCanUpdateClinicAdmin = async (clinicAdminId: string) => {
  const session = await auth();

  if (!session?.user.clinicAdmin) {
    throw new Error("No tienes permisos para actualizar este administrador");
  }

  const clinicAdmin = await db.clinicAdmin.findUnique({
    where: {
      id: clinicAdminId,
    },
    include: {
      user: true,
    },
  });

  if (session?.user.clinic.id !== clinicAdmin?.user.clinicId) {
    throw new Error("No tienes permisos para actualizar este administrador");
  }
};

export const checkCanDeleteClinicAdmin = async (clinicAdminId: string) => {
  const session = await auth();

  if (!session?.user.clinicAdmin) {
    throw new Error("No tienes permisos para eliminar este administrador");
  }

  const clinicAdmin = await db.clinicAdmin.findUnique({
    where: {
      id: clinicAdminId,
    },
    include: {
      user: true,
    },
  });

  if (session?.user.clinic.id !== clinicAdmin?.user.clinicId) {
    throw new Error("No tienes permisos para eliminar este administrador");
  }
};
