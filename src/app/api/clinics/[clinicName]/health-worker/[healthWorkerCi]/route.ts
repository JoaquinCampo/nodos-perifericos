import { NextResponse } from "next/server";
import * as healthWorkerController from "~/server/controllers/health-worker";

export async function GET(
  request: Request,
  {
    params,
  }: {
    params: Promise<{ clinicName: string; healthWorkerCi: string }>;
  },
) {
  const { clinicName, healthWorkerCi } = await params;

  const healthWorker = await healthWorkerController.findHealthWorkerByCi(
    healthWorkerCi,
    clinicName,
  );

  if (!healthWorker) {
    return NextResponse.json(
      { error: "Profesional de salud no encontrado" },
      { status: 404 },
    );
  }

  return NextResponse.json(healthWorker, { status: 200 });
}
