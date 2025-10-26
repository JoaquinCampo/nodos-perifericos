import { auth } from "~/server/auth";
import { db } from "~/server/db";

export const checkCanUpdateConfiguration = async (configurationId: string) => {
  const session = await auth();

  if (!session?.user.clinicAdmin) {
    throw new Error("No tienes permisos para actualizar esta configuración");
  }

  const configuration = await db.configuration.findUnique({
    where: { id: configurationId },
  });

  if (!configuration) {
    throw new Error("Configuración no encontrada");
  }

  if (session?.user.clinic.id !== configuration.clinicId) {
    throw new Error("No tienes permisos para actualizar esta configuración");
  }
};
