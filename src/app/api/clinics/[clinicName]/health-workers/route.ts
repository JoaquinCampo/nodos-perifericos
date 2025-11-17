import { NextResponse } from "next/server";
import * as clinicController from "~/server/controllers/clinic";
import * as healthWorkerController from "~/server/controllers/health-worker";

export async function GET(
  request: Request,
  {
    params,
  }: {
    params: Promise<{ clinicName: string }>;
  },
) {
  const { clinicName } = await params;

  const clinic = await clinicController.findClinicByName(clinicName);

  if (!clinic) {
    return NextResponse.json(
      { error: "Clínica no encontrada" },
      { status: 404 },
    );
  }

  const healthWorkers =
    await healthWorkerController.findHealthWorkersByClinicName(clinicName);

  return NextResponse.json(healthWorkers ?? [], { status: 200 });
}
