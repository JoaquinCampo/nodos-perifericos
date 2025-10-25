import { authGuard } from "~/server/auth/auth-guard";
import { findAllHealthWorkers } from "~/server/services/health-worker";
import { HealthWorkersTable } from "./_components/health-workers-table";
import { CreateHealthWorkerButton } from "./_components/buttons/create-health-worker-button";

export default async function HealthProfessionalsPage() {
  const session = await authGuard("HealthWorkers");

  const healthWorkers = await findAllHealthWorkers({
    clinicId: session.user.clinic.id,
  });

  const isClinicAdmin = !!session.user.clinicAdmin;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Profesionales de Salud</h1>
          <p className="text-muted-foreground mt-2">
            Gestiona los profesionales de salud de la clínica
          </p>
        </div>
        {isClinicAdmin && (
          <CreateHealthWorkerButton clinicId={session.user.clinic.id} />
        )}
      </div>

      <HealthWorkersTable data={healthWorkers} isClinicAdmin={isClinicAdmin} />
    </div>
  );
}
