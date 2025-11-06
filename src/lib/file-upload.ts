import { DeleteObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3Client, BUCKET_NAME, BUCKET_URL } from "./s3-client";
import { randomUUID } from "crypto";
import path from "path";
import fs from "fs/promises";

export interface UploadedFile {
  key: string;
  url: string;
  size: number;
  contentType: string;
}

export const uploadClinicalDocument = async (
  file: File,
  clinicId: string,
  documentId: string
): Promise<UploadedFile> => {
  if (!s3Client || !BUCKET_NAME || !BUCKET_URL) {
    // Fallback for development: store in public directory
    const fileExtension = path.extname(file.name);
    const localKey = `dev-clinical-documents/clinic-${clinicId}/${documentId}/${randomUUID()}${fileExtension}`;

    // Create uploads directory in public folder
    const publicDir = path.join(process.cwd(), 'public');
    const uploadsDir = path.join(publicDir, 'uploads');
    await fs.mkdir(uploadsDir, { recursive: true });

    const localPath = path.join(uploadsDir, localKey);
    await fs.mkdir(path.dirname(localPath), { recursive: true });

    // Save file locally in public directory
    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(localPath, buffer);

    return {
      key: localKey,
      url: `/uploads/${localKey}`,
      size: file.size,
      contentType: file.type,
    };
  }

  // Generate unique key with clinic organization
  const fileExtension = path.extname(file.name);
  const key = `clinical-documents/clinic-${clinicId}/${documentId}/${randomUUID()}${fileExtension}`;

  try {
    const upload = new Upload({
      client: s3Client,
      params: {
        Bucket: BUCKET_NAME,
        Key: key,
        Body: Buffer.from(await file.arrayBuffer()),
        ContentType: file.type,
        Metadata: {
          originalName: file.name,
          uploadedBy: "health-worker", // Will be passed from controller
          clinicId,
          documentId,
        },
        // Enable versioning if your bucket supports it
        // Tagging: "type=clinical-document"
      },
    });

    await upload.done();

    return {
      key,
      url: `${BUCKET_URL}/${key}`,
      size: file.size,
      contentType: file.type,
    };
  } catch (error) {
    console.error("S3 upload error:", error);
    if (error instanceof Error) {
      // Provide more specific error messages
      if (error.message.includes("endpoint")) {
        throw new Error(`S3 bucket region mismatch. The bucket '${BUCKET_NAME}' may be in a different region than '${process.env.AWS_REGION ?? 'us-east-2'}'. Check your AWS_REGION environment variable.`);
      }
      if (error.message.includes("credentials")) {
        throw new Error("AWS credentials invalid or insufficient permissions.");
      }
      if (error.message.includes("NoSuchBucket")) {
        throw new Error(`S3 bucket '${BUCKET_NAME}' does not exist. Check your AWS_S3_BUCKET_NAME.`);
      }
      throw new Error(`S3 upload failed: ${error.message}`);
    }
    throw new Error("Unknown S3 upload error");
  }
};

export const deleteClinicalDocument = async (key: string): Promise<void> => {
  if (!s3Client || !BUCKET_NAME) {
    // Fallback for development: delete local file from public directory
    const publicDir = path.join(process.cwd(), 'public');
    const localPath = path.join(publicDir, 'uploads', key);
    try {
      await fs.unlink(localPath);
    } catch (error) {
      // File might not exist, ignore error
      console.warn(`Failed to delete local file ${localPath}:`, error);
    }
    return;
  }

  const command = new DeleteObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
  });

  await s3Client.send(command);
};

export async function getSignedUrlForFile(key: string, expiresIn = 3600): Promise<string> {
  if (!s3Client) {
    // For development fallback, return the local URL
    return `/uploads/${key}`;
  }

  try {
    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    });

    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn });
    return signedUrl;
  } catch (error) {
    console.error("Error generating signed URL:", error);
    throw new Error("Unable to generate secure file access URL");
  }
};
