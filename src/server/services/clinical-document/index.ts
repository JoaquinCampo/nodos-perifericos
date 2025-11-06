import { db } from "~/server/db";
import type {
  CreateClinicalDocumentSchema,
  FindAllClinicalDocumentsSchema,
  UpdateClinicalDocumentSchema,
  DeleteClinicalDocumentSchema,
} from "~/server/schemas/clinical-document";
import {
  checkCanCreateClinicalDocument,
  checkCanAccessClinicalDocument,
} from "~/server/services/clinical-document/utils";
import { deleteClinicalDocument } from "~/lib/file-upload";

export const findAllClinicalDocuments = async (
  input: FindAllClinicalDocumentsSchema,
) => {
  const { clinicId, healthUserCi, healthWorkerId, documentType, status } = input;

  return await db.clinicalDocument.findMany({
    where: {
      clinicId,
      ...(healthUserCi && { healthUserCi }),
      ...(healthWorkerId && { healthWorkerId }),
      ...(documentType && { documentType }),
      ...(status && { status }),
    },
    include: {
      clinic: true,
      healthWorker: {
        include: {
          user: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const findClinicalDocumentById = async (id: string) => {
  return await db.clinicalDocument.findUnique({
    where: { id },
    include: {
      clinic: true,
      healthWorker: {
        include: {
          user: true,
        },
      },
    },
  });
};

export const createClinicalDocument = async (
  input: CreateClinicalDocumentSchema & {
    clinicId: string;
    healthWorkerId: string;
    contentUrl?: string;
    s3Key?: string;
    fileSize?: number;
    contentType?: string;
  },
) => {
  const {
    clinicId,
    healthWorkerId,
    contentUrl,
    s3Key,
    fileSize,
    contentType,
    ...data
  } = input;

  await checkCanCreateClinicalDocument(clinicId);

  return await db.clinicalDocument.create({
    data: {
      ...data,
      clinicId,
      healthWorkerId,
      contentUrl,
      s3Key,
      fileSize,
      contentType,
    },
    include: {
      clinic: true,
      healthWorker: {
        include: {
          user: true,
        },
      },
    },
  });
};

export const updateClinicalDocument = async (
  input: UpdateClinicalDocumentSchema & { clinicId: string },
) => {
  const { id, clinicId, ...updateData } = input;

  await checkCanAccessClinicalDocument(id, clinicId);

  return await db.clinicalDocument.update({
    where: { id },
    data: updateData,
    include: {
      clinic: true,
      healthWorker: {
        include: {
          user: true,
        },
      },
    },
  });
};

export const deleteClinicalDocumentService = async (
  input: DeleteClinicalDocumentSchema & { clinicId: string },
) => {
  const { id, clinicId } = input;

  await checkCanAccessClinicalDocument(id, clinicId);

  // Get document to check if it has an S3 file to delete
  const document = await db.clinicalDocument.findUnique({
    where: { id },
    select: { s3Key: true },
  });

  if (!document) {
    throw new Error("Documento no encontrado");
  }

  // Delete S3 file if it exists
  if (document.s3Key) {
    try {
      await deleteClinicalDocument(document.s3Key);
    } catch (error) {
      // Log but don't fail the deletion - file might already be deleted
      console.warn(`Failed to delete S3 file ${document.s3Key}:`, error);
    }
  }

  return await db.clinicalDocument.delete({
    where: { id },
  });
};
