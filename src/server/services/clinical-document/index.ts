import type {
  GetPresignedUrlSchema,
  CreateClinicalDocumentSchema,
} from "~/server/schemas/clinical-document";
import { fetchApi } from "~/lib/hcen-api";
import type { GetPresignedUrlResponse } from "./types";
import {
  checkCanCreateClinicalDocument,
  checkCanGetPresignedUploadUrl,
} from "./utils";

export const getPresignedUploadUrl = async (
  input: GetPresignedUrlSchema,
): Promise<GetPresignedUrlResponse> => {
  await checkCanGetPresignedUploadUrl(input);

  try {
    return await fetchApi<GetPresignedUrlResponse>({
      path: "clinical-documents/upload-url",
      method: "POST",
      body: input,
    });
  } catch (error) {
    console.error("Error getting presigned upload url:", error);
    throw new Error("Error al obtener la URL de carga", { cause: error });
  }
};

export const createClinicalDocument = async (
  input: CreateClinicalDocumentSchema,
): Promise<string> => {
  await checkCanCreateClinicalDocument(input);

  try {
    const response = await fetchApi<{ doc_id: string }>({
      path: "clinical-documents",
      method: "POST",
      body: input,
    });
    return response.doc_id;
  } catch (error) {
    console.error("Error creating clinical document:", error);
    throw new Error("Error al crear el documento clínico", { cause: error });
  }
};
