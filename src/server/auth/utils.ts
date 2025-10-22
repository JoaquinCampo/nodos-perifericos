import { auth } from "~/server/auth";

interface ClinicAdminContext {
  sessionUserId: string;
  clinicId: string;
}

export const requireClinicAdminContext = async (): Promise<ClinicAdminContext> => {
  const session = await auth();

  if (!session || !session.user?.clinicAdmin) {
    throw new Error("Clinic admin session required");
  }

  const clinicId = session.user.clinic?.id;

  if (!clinicId) {
    // TODO: replace mocked clinic ID once session stores the clinic explicitly.
    return {
      sessionUserId: session.user.id,
      clinicId: "MOCKED_CLINIC_ID",
    };
  }

  return {
    sessionUserId: session.user.id,
    clinicId,
  };
};
