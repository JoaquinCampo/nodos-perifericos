import { NextResponse } from "next/server";
import { authGuard } from "~/server/auth/auth-guard";
import * as clinicalDocumentController from "~/server/controllers/clinical-document";
import { updateClinicalDocumentSchema, deleteClinicalDocumentSchema } from "~/server/schemas/clinical-document";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await authGuard("HealthWorkers");
    const { id } = await params;

    const document = await clinicalDocumentController.findClinicalDocumentByIdController(id);

    if (!document) {
      return NextResponse.json(
        { error: "Documento clínico no encontrado" },
        { status: 404 },
      );
    }

    // Check if document belongs to user's clinic
    if (document.clinicId !== session.user.clinic.id) {
      return NextResponse.json(
        { error: "No tienes acceso a este documento" },
        { status: 403 },
      );
    }

    return NextResponse.json(document, { status: 200 });
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

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await authGuard("HealthWorkers");
    const { id } = await params;

    const body = await request.json() as Record<string, unknown>;
    const validatedData = updateClinicalDocumentSchema.parse({
      id,
      ...body,
    });

    const updatedDocument = await clinicalDocumentController.updateClinicalDocumentController({
      ...validatedData,
      clinicId: session.user.clinic.id,
    });

    return NextResponse.json(updatedDocument, { status: 200 });
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

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await authGuard("HealthWorkers");
    const { id } = await params;

    const validatedData = deleteClinicalDocumentSchema.parse({ id });

    const deletedDocument = await clinicalDocumentController.deleteClinicalDocumentController({
      ...validatedData,
      clinicId: session.user.clinic.id,
    });

    return NextResponse.json(deletedDocument, { status: 200 });
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
