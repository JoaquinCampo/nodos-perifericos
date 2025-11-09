import { authGuard } from "~/server/auth/auth-guard";
import { HealthUsersTable } from "./_components/health-users-table";
import { HealthUsersFilters } from "./_components/filters";
import type { SearchParams } from "nuqs";
import { loadSearchParams } from "./_components/search-params";
import { findAllHealthUsers } from "~/server/controllers/health-user";
import { CreateHealthUserButton } from "./_components/create-health-user-button";

interface HealthUsersPageProps {
  searchParams: Promise<SearchParams>;
}

export default async function HealthUsersPage(props: HealthUsersPageProps) {
  const { searchParams: searchParamsPromise } = props;

  const session = await authGuard("HealthUsers");
  const searchParams = await loadSearchParams(searchParamsPromise);

  const healthUsersResponse = await findAllHealthUsers({
    ...searchParams,
  });

  const isClinicAdmin = !!session.user.clinicAdmin;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Usuarios de Salud</h1>
          <p className="text-muted-foreground mt-2">
            Gestiona los usuarios de salud de la clínica
          </p>
        </div>
        {isClinicAdmin && <CreateHealthUserButton />}
      </div>

      <HealthUsersFilters />

      <HealthUsersTable
        data={healthUsersResponse}
        searchParams={searchParams}
      />
    </div>
  );
}
