import { NextResponse } from "next/server";
import * as clinicalHistoryController from "~/server/controllers/health-user";

export async function GET(
  request: Request,
  {
    params,
  }: {
    params: Promise<{ healthUserCi: string }>;
  },
) {
  try {
    const { healthUserCi } = await params;

    const clinicalHistory =
      await clinicalHistoryController.findClinicalHistory(healthUserCi);

    if (!clinicalHistory) {
      return NextResponse.json(
        { error: "Historial clínico no encontrado" },
        { status: 404 },
      );
    }

    return NextResponse.json(clinicalHistory, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 },
    );
  }
}
