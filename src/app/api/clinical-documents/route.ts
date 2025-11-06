import { NextResponse } from "next/server";
import { authGuard } from "~/server/auth/auth-guard";
import * as clinicalDocumentController from "~/server/controllers/clinical-document";
import { createClinicalDocumentSchema, findAllClinicalDocumentsSchema } from "~/server/schemas/clinical-document";
import { uploadClinicalDocument } from "~/lib/file-upload";

export async function POST(request: Request) {
  try {
    const session = await authGuard("HealthWorkers");

    const formData = await request.formData();

    // Parse basic fields
    const baseData = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      healthUserCi: formData.get("healthUserCi") as string,
      documentType: formData.get("documentType") as string,
      content: formData.get("content") as string,
    };

    const validatedData = createClinicalDocumentSchema.parse(baseData);

    // Handle file upload
    let fileData: Awaited<ReturnType<typeof uploadClinicalDocument>> | undefined;
    const file = formData.get("file") as File | null;

    if (file && file.size > 0) {
      fileData = await uploadClinicalDocument(
        file,
        session.user.clinic.id,
        "temp-" + Date.now() // We'll update this with the real document ID
      );
    }

    const document = await clinicalDocumentController.createClinicalDocumentController({
      ...validatedData,
      clinicId: session.user.clinic.id,
      healthWorkerId: session.user.healthWorker!.id,
      contentUrl: fileData?.url,
      s3Key: fileData?.key,
      fileSize: fileData?.size,
      contentType: fileData?.contentType,
    });

    return NextResponse.json(document, { status: 201 });

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

export async function GET(request: Request) {
  try {
    const session = await authGuard("HealthWorkers");

    const { searchParams } = new URL(request.url);
    const filters = findAllClinicalDocumentsSchema.parse({
      clinicId: session.user.clinic.id,
      healthUserCi: searchParams.get("healthUserCi") ?? undefined,
      healthWorkerId: searchParams.get("healthWorkerId") ?? undefined,
      documentType: searchParams.get("documentType") ?? undefined,
      status: searchParams.get("status") ?? undefined,
    });

    const documents = await clinicalDocumentController.findAllClinicalDocumentsController(filters);

    return NextResponse.json(documents, { status: 200 });
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
