import { auth } from "~/server/auth";

export const checkCanUploadLogo = async () => {
  const session = await auth();

  if (!session?.user.clinicAdmin) {
    throw new Error("No tienes permisos para subir logos");
  }
};

