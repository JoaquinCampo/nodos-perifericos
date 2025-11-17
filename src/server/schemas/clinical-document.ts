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
  specialtyNames: z.array(z.string()),
});

export type GetPresignedUrlSchema = z.infer<typeof getPresignedUrlSchema>;

export const createClinicalDocumentSchema = z
  .object({
    healthUserCi: z.string().min(1, "La CI del usuario de salud es requerida"),
    healthWorkerCi: z
      .string()
      .min(1, "La CI del profesional de salud es requerida"),
    clinicName: z.string().min(1, "El nombre de la clínica es requerido"),
    providerName: z.string().min(1, "El nombre del proveedor es requerido"),
    title: z.string().min(1, "El título es requerido"),
    description: z.string().optional(),
    content: z.string().optional(),
    contentUrl: z.string().optional(),
    contentType: z.string().optional(),
  })
  .refine((data) => !!(data.contentUrl ?? data.content), {
    message: "Debe proporcionar una URL de contenido o contenido del documento",
    path: ["contentUrl"],
  });

export type CreateClinicalDocumentSchema = z.infer<
  typeof createClinicalDocumentSchema
>;
