import { auth } from "~/server/auth";
import type {
  CreateClinicalDocumentSchema,
  GetPresignedUrlSchema,
} from "~/server/schemas/clinical-document";

export const checkCanGetPresignedUploadUrl = async (
  input: GetPresignedUrlSchema,
) => {
  const session = await auth();

  if (!session?.user?.healthWorker) {
    throw new Error(
      "No tienes permisos para obtener una URL de subida de documentos",
    );
  }

  if (session?.user.clinic.name !== input.clinicName) {
    throw new Error(
      "No tienes permisos para obtener una URL de subida de documentos en esta clínica",
    );
  }

  if (session?.user.ci !== input.healthWorkerCi) {
    throw new Error(
      "No tienes permisos para obtener una URL de subida de documentos para este profesional",
    );
  }
};

export const checkCanCreateClinicalDocument = async (
  input: CreateClinicalDocumentSchema,
) => {
  const session = await auth();

  if (!session?.user?.healthWorker) {
    throw new Error("No tienes permisos para crear un documento clínico");
  }

  if (session?.user.clinic.name !== input.clinicName) {
    throw new Error(
      "No tienes permisos para crear un documento clínico en esta clínica",
    );
  }

  if (session?.user.ci !== input.healthWorkerCi) {
    throw new Error(
      "No tienes permisos para crear un documento clínico para este profesional",
    );
  }
};
