import { NextResponse } from "next/server";
import { authGuard } from "~/server/auth/auth-guard";
import { findClinicalDocumentByIdController } from "~/server/controllers/clinical-document";

// Import the function directly to avoid bundling issues
async function getSignedUrlForFile(key: string, expiresIn = 3600): Promise<string> {
  // Import dynamically to avoid bundling issues
  const { getSignedUrl } = await import("@aws-sdk/s3-request-presigner");
  const { GetObjectCommand } = await import("@aws-sdk/client-s3");
  const { s3Client, BUCKET_NAME } = await import("~/lib/s3-client");

  if (!s3Client) {
    // For development fallback, return the local URL
    return `/uploads/${key}`;
  }

  try {
    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    });

    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn });
    return signedUrl;
  } catch (error) {
    console.error("Error generating signed URL:", error);
    throw new Error("Unable to generate secure file access URL");
  }
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await authGuard("HealthWorkers");
    const { id } = await params;

    const document = await findClinicalDocumentByIdController(id);

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

    // Check if document has a file
    if (!document.s3Key) {
      return NextResponse.json(
        { error: "Este documento no tiene archivo adjunto" },
        { status: 400 },
      );
    }

    // Generate signed URL (expires in 1 hour)
    const signedUrl = await getSignedUrlForFile(document.s3Key, 3600);

    return NextResponse.json({
      signedUrl,
      expiresIn: 3600, // 1 hour in seconds
      fileName: document.title,
      contentType: document.contentType,
    });

  } catch (error) {
    console.error("Error generating signed URL:", error);
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}
