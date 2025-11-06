import { authGuard } from "~/server/auth/auth-guard";
import { findAllClinicalDocuments } from "~/server/services/clinical-document";
import { ClinicalDocumentsTable } from "./_components/clinical-documents-table";
import { CreateClinicalDocumentButton } from "./_components/buttons/create-document-button";

export default async function ClinicalDocumentsPage() {
  const session = await authGuard("HealthWorkers");

  const documents = await findAllClinicalDocuments({
    clinicId: session.user.clinic.id,
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Documentos Clínicos</h1>
          <p className="text-muted-foreground mt-2">
            Gestiona los documentos clínicos de la clínica
          </p>
        </div>
        <CreateClinicalDocumentButton />
      </div>

      <ClinicalDocumentsTable data={documents} />
    </div>
  );
}
