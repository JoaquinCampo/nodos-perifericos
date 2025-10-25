import { authGuard } from "~/server/auth/auth-guard";
import { findAllClinicAdmins } from "~/server/services/clinic-admin";
import { AdministratorsTable } from "./_components/administrators-table";
import { CreateAdminButton } from "./_components/buttons/create-admin-button";

export default async function AdministratorsPage() {
  const session = await authGuard("ClinicAdmins");

  const admins = await findAllClinicAdmins({
    clinicId: session.user.clinic.id,
  });

  const isClinicAdmin = !!session.user.clinicAdmin;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Administradores</h1>
          <p className="text-muted-foreground mt-2">
            Gestiona los administradores de la clínica
          </p>
        </div>
        {isClinicAdmin && (
          <CreateAdminButton clinicId={session.user.clinic.id} />
        )}
      </div>

      <AdministratorsTable data={admins} isClinicAdmin={isClinicAdmin} />
    </div>
  );
}
