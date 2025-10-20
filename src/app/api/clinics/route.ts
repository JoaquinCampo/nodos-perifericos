import { NextResponse } from "next/server";
import * as clinicController from "~/server/controllers/clinic";
import { createClinicSchema } from "~/server/schemas/clinic";

export async function POST(request: Request) {
  try {
    const body = createClinicSchema.parse(await request.json());

    const clinic = await clinicController.createClinic(body);

    return NextResponse.json(clinic, { status: 201 });
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
