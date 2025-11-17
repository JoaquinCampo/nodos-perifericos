import z from "zod";

export const getLogoPresignedUrlSchema = z.object({
  fileName: z.string().min(1, "El nombre del archivo es requerido"),
  contentType: z.string().min(1, "El tipo de contenido es requerido"),
});

export type GetLogoPresignedUrlSchema = z.infer<
  typeof getLogoPresignedUrlSchema
>;

export const deleteLogoSchema = z.object({
  logoUrl: z.string().min(1, "La URL del logo es requerida"),
});

export type DeleteLogoSchema = z.infer<typeof deleteLogoSchema>;
