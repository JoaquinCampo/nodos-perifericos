import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { env } from "~/env";
import type { GetLogoPresignedUrlSchema } from "~/server/schemas/logo-upload";
import { checkCanUploadLogo } from "./utils";

export interface GetLogoPresignedUrlResponse {
  uploadUrl: string;
  s3Url: string;
  objectKey: string;
}

export const getLogoPresignedUploadUrl = async (
  input: GetLogoPresignedUrlSchema,
): Promise<GetLogoPresignedUrlResponse> => {
  await checkCanUploadLogo();

  const s3Client = new S3Client({
    region: env.AWS_REGION,
    credentials: {
      accessKeyId: env.AWS_ACCESS_KEY_ID,
      secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
    },
  });

  const timestamp = Date.now();
  const sanitizedFileName = input.fileName.replace(/[^a-zA-Z0-9.-]/g, "_");
  const objectKey = `logos/${timestamp}-${sanitizedFileName}`;

  const command = new PutObjectCommand({
    Bucket: env.AWS_S3_BUCKET_NAME,
    Key: objectKey,
    ContentType: input.contentType,
  });

  try {
    const uploadUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 3600,
    });

    const s3Url = `https://${env.AWS_S3_BUCKET_NAME}.s3.${env.AWS_REGION}.amazonaws.com/${objectKey}`;

    return {
      uploadUrl,
      s3Url,
      objectKey,
    };
  } catch (error) {
    console.error("Error generating presigned URL:", error);
    if (error instanceof Error) {
      throw new Error(
        `Error al generar URL de carga: ${error.message}. Verifica los permisos de IAM y la configuración del bucket.`,
      );
    }
    throw new Error("Error al generar URL de carga");
  }
};

export const deleteLogo = async (input: { logoUrl: string }): Promise<void> => {
  await checkCanUploadLogo();

  const logoUrl = input.logoUrl;

  const s3Client = new S3Client({
    region: env.AWS_REGION,
    credentials: {
      accessKeyId: env.AWS_ACCESS_KEY_ID,
      secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
    },
  });

  // Extract object key from S3 URL
  // URL format: https://bucket-name.s3.region.amazonaws.com/logos/timestamp-filename
  const urlPattern = /https:\/\/[^/]+\/(.+)$/;
  const match = urlPattern.exec(logoUrl);

  const objectKey = match?.[1];

  if (!objectKey) {
    throw new Error("URL de logo inválida");
  }

  // Verify it's in the logos folder for security
  if (!objectKey.startsWith("logos/")) {
    throw new Error("No se puede eliminar este archivo");
  }

  const command = new DeleteObjectCommand({
    Bucket: env.AWS_S3_BUCKET_NAME,
    Key: objectKey,
  });

  await s3Client.send(command);
};
