import type {
  CreateClinicalDocumentSchema,
  FindAllClinicalDocumentsSchema,
  UpdateClinicalDocumentSchema,
  DeleteClinicalDocumentSchema,
} from "~/server/schemas/clinical-document";
import * as clinicalDocumentService from "~/server/services/clinical-document";

export const createClinicalDocumentController = async (
  data: CreateClinicalDocumentSchema & {
    clinicId: string;
    healthWorkerId: string;
    contentUrl?: string;
    s3Key?: string;
    fileSize?: number;
    contentType?: string;
  },
) => {
  return await clinicalDocumentService.createClinicalDocument(data);
};

export const findAllClinicalDocumentsController = async (
  filters: FindAllClinicalDocumentsSchema,
) => {
  return await clinicalDocumentService.findAllClinicalDocuments(filters);
};

export const findClinicalDocumentByIdController = async (id: string) => {
  return await clinicalDocumentService.findClinicalDocumentById(id);
};

export const updateClinicalDocumentController = async (
  data: UpdateClinicalDocumentSchema & { clinicId: string },
) => {
  return await clinicalDocumentService.updateClinicalDocument(data);
};

export const deleteClinicalDocumentController = async (
  data: DeleteClinicalDocumentSchema & { clinicId: string },
) => {
  return await clinicalDocumentService.deleteClinicalDocumentService(data);
};
