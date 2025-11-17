"use server";

import { actionClient } from "~/lib/safe-action";
import {
  getLogoPresignedUploadUrl,
  deleteLogo,
} from "~/server/controllers/logo-upload";
import {
  getLogoPresignedUrlSchema,
  deleteLogoSchema,
} from "~/server/schemas/logo-upload";

export const getLogoPresignedUrlAction = actionClient
  .inputSchema(getLogoPresignedUrlSchema)
  .action(async ({ parsedInput }) => {
    return await getLogoPresignedUploadUrl(parsedInput);
  });

export const deleteLogoAction = actionClient
  .inputSchema(deleteLogoSchema)
  .action(async ({ parsedInput }) => {
    return await deleteLogo(parsedInput);
  });
