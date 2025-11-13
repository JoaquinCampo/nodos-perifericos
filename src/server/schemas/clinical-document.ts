import z from "zod";

export const getPresignedUrlSchema = z.object({
  fileName: z.string().min(1, "El nombre del archivo es requerido"),
  contentType: z.string().min(1, "El tipo de contenido es requerido"),
  healthUserCi: z.string().min(1, "La CI del usuario de salud es requerida"),
  healthWorkerCi: z
    .string()
    .min(1, "La CI del profesional de salud es requerida"),
  clinicName: z.string().min(1, "El nombre de la clínica es requerido"),
  providerName: z.string().min(1, "El nombre del proveedor es requerido"),
});

export type GetPresignedUrlSchema = z.infer<typeof getPresignedUrlSchema>;

export const createClinicalDocumentSchema = z.object({
  healthUserCi: z.string().min(1, "La CI del usuario de salud es requerida"),
  healthWorkerCi: z
    .string()
    .min(1, "La CI del profesional de salud es requerida"),
  clinicName: z.string().min(1, "El nombre de la clínica es requerido"),
  s3Url: z.string().min(1, "La URL de S3 es requerida"),
});

export type CreateClinicalDocumentSchema = z.infer<
  typeof createClinicalDocumentSchema
>;
