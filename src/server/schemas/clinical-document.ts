import z from "zod";
import { ciSchema } from "~/lib/validation/ci";

export const createClinicalDocumentSchema = z.object({
  title: z.string().min(1, "El título es requerido"),
  description: z.string().optional(),
  healthUserCi: ciSchema,
  documentType: z.enum(["consultation", "lab_results", "radiology", "prescription"]),
  content: z.string().optional(), // For text content
  // File will be handled separately in the controller
});

export type CreateClinicalDocumentSchema = z.infer<typeof createClinicalDocumentSchema>;

export const findAllClinicalDocumentsSchema = z.object({
  clinicId: z.string().min(1, "La clínica es requerida"),
  healthUserCi: z.string().optional(),
  healthWorkerId: z.string().optional(),
  documentType: z.string().optional(),
  status: z.string().optional(),
});

export type FindAllClinicalDocumentsSchema = z.infer<typeof findAllClinicalDocumentsSchema>;

export const updateClinicalDocumentSchema = z.object({
  id: z.string().min(1, "El identificador es requerido"),
  title: z.string().optional(),
  description: z.string().optional(),
  documentType: z.enum(["consultation", "lab_results", "radiology", "prescription"]).optional(),
  status: z.enum(["draft", "final", "signed"]).optional(),
});

export type UpdateClinicalDocumentSchema = z.infer<typeof updateClinicalDocumentSchema>;

export const deleteClinicalDocumentSchema = z.object({
  id: z.string().min(1, "El identificador es requerido"),
});

export type DeleteClinicalDocumentSchema = z.infer<typeof deleteClinicalDocumentSchema>;
