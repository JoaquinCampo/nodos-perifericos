import { S3Client } from "@aws-sdk/client-s3";
import { env } from "~/env";

// Only create S3 client if credentials are available
export const s3Client = env.AWS_ACCESS_KEY_ID && env.AWS_SECRET_ACCESS_KEY
  ? new S3Client({
      region: env.AWS_REGION,
      credentials: {
        accessKeyId: env.AWS_ACCESS_KEY_ID,
        secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
      },
      // Force path-style URLs which work better for custom domains and regional endpoints
      forcePathStyle: true,
    })
  : null;

export const BUCKET_NAME = env.AWS_S3_BUCKET_NAME;
export const BUCKET_URL = env.AWS_S3_BUCKET_URL;
