export interface GetPresignedUrlResponse {
  uploadUrl: string;
  s3Url: string;
  objectKey: string;
  expiresInSeconds: number;
}
