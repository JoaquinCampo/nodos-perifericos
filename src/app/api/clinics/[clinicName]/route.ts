import { NextResponse } from "next/server";
import * as clinicController from "~/server/controllers/clinic";

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

  return NextResponse.json(clinic, { status: 200 });
}
