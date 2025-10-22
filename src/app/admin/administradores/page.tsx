import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { authGuard } from "~/server/auth/auth-guard";
import { findAllClinicAdmins } from "~/server/services/clinic-admin";
import { AdministratorsTable } from "./_components/administrators-table";

export default async function AdministratorsPage() {
  const session = await authGuard("Administrators");

  const admins = await findAllClinicAdmins({
    clinicId: session.user.clinic!.id,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Administradores</h1>
        <p className="text-muted-foreground mt-2">
          Gestiona los administradores de la clínica
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Administradores</CardTitle>
        </CardHeader>
        <CardContent>
          <AdministratorsTable data={admins} />
        </CardContent>
      </Card>
    </div>
  );
}
