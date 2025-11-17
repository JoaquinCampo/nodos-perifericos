import * as logoUploadService from "~/server/services/logo-upload";
import type { GetLogoPresignedUrlSchema } from "~/server/schemas/logo-upload";

export const getLogoPresignedUploadUrl = async (
  input: GetLogoPresignedUrlSchema,
) => {
  return await logoUploadService.getLogoPresignedUploadUrl(input);
};

export const deleteLogo = async (input: { logoUrl: string }) => {
  return await logoUploadService.deleteLogo({ logoUrl: input.logoUrl });
};
