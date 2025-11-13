"use server";

import { actionClient } from "~/lib/safe-action";
import {
  getPresignedUploadUrl,
  createClinicalDocument,
} from "~/server/controllers/clinical-document";
import {
  getPresignedUrlSchema,
  createClinicalDocumentSchema,
} from "~/server/schemas/clinical-document";

export const getPresignedUrlAction = actionClient
  .inputSchema(getPresignedUrlSchema)
  .action(async ({ parsedInput }) => {
    return await getPresignedUploadUrl(parsedInput);
  });

export const createClinicalDocumentAction = actionClient
  .inputSchema(createClinicalDocumentSchema)
  .action(async ({ parsedInput }) => {
    return await createClinicalDocument(parsedInput);
  });
