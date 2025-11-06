import { db } from "~/server/db";

export const checkCanCreateClinicalDocument = async (clinicId: string) => {
  const clinic = await db.clinic.findUnique({
    where: { id: clinicId },
    select: { id: true },
  });

  if (!clinic) {
    throw new Error("Clínica no encontrada");
  }
};

export const checkCanAccessClinicalDocument = async (documentId: string, clinicId: string) => {
  const document = await db.clinicalDocument.findUnique({
    where: { id: documentId },
    select: { clinicId: true },
  });

  if (!document) {
    throw new Error("Documento clínico no encontrado");
  }

  if (document.clinicId !== clinicId) {
    throw new Error("No tienes acceso a este documento");
  }
};
