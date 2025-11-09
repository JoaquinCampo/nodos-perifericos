"use server";

import { revalidatePath } from "next/cache";
import { auth } from "~/server/auth";
import { Paths } from "~/lib/constants/paths";
import { actionClient } from "~/lib/safe-action";
import {
  createClinicalDocumentSchema,
  updateClinicalDocumentSchema,
  deleteClinicalDocumentSchema,
} from "~/server/schemas/clinical-document";
import {
  updateClinicalDocumentController,
  deleteClinicalDocumentController,
} from "~/server/controllers/clinical-document";

// Note: File uploads are now handled directly in the client component
// This action is kept for future use or non-file operations
export const createClinicalDocumentAction = actionClient
  .inputSchema(createClinicalDocumentSchema)
  .action(async ({ parsedInput: _parsedInput }) => {
    throw new Error("Use the API route directly for file uploads");
  });

export const updateClinicalDocumentAction = actionClient
  .inputSchema(updateClinicalDocumentSchema)
  .action(async ({ parsedInput }) => {
    try {
      const session = await auth();
      if (!session?.user?.clinic?.id) {
        throw new Error("Usuario no autorizado");
      }

      const updatedDocument = await updateClinicalDocumentController({
        ...parsedInput,
        clinicId: session.user.clinic.id,
      });
      return updatedDocument;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error("Error al actualizar el documento clínico");
    }
  });

export const deleteClinicalDocumentAction = actionClient
  .inputSchema(deleteClinicalDocumentSchema)
  .action(async ({ parsedInput }) => {
    try {
      const session = await auth();
      if (!session?.user?.clinic?.id) {
        throw new Error("Usuario no autorizado");
      }

      const deletedDocument = await deleteClinicalDocumentController({
        ...parsedInput,
        clinicId: session.user.clinic.id,
      });
      return deletedDocument;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error("Error al eliminar el documento clínico");
    }
  });
