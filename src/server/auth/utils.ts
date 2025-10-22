import { auth } from "~/server/auth";

interface ClinicAdminContext {
  sessionUserId: string;
  clinicId: string;
}

export const requireClinicAdminContext =
  async (): Promise<ClinicAdminContext> => {
    const session = await auth();

    if (!session?.user?.clinicAdmin) {
      throw new Error("Clinic admin session required");
    }

    const clinicId = session.user.clinic?.id;

    if (!clinicId) {
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
