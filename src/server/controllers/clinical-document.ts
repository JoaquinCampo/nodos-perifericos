import * as clinicalDocumentService from "~/server/services/clinical-document";
import type {
  GetPresignedUrlSchema,
  CreateClinicalDocumentSchema,
} from "~/server/schemas/clinical-document";

export const getPresignedUploadUrl = async (input: GetPresignedUrlSchema) => {
  return await clinicalDocumentService.getPresignedUploadUrl(input);
};

export const createClinicalDocument = async (
  input: CreateClinicalDocumentSchema,
): Promise<string> => {
  return await clinicalDocumentService.createClinicalDocument(input);
};
