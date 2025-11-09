import { auth } from "~/server/auth";

export const checkCanFindAllHealthUsers = async () => {
  const session = await auth();

  if (!session?.user.clinicAdmin) {
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
