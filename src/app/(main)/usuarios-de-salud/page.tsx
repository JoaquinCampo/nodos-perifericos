import { fetchHealthUsers } from "~/lib/hcen-api/health-users";
import { HealthUsersTable } from "./_components/health-users-table";
import { HealthUsersFilters } from "./_components/filters";
import type { SearchParams } from "nuqs";
import { loadSearchParams } from "./_components/search-params";

interface HealthUsersPageProps {
  searchParams: Promise<SearchParams>;
}

export default async function HealthUsersPage(props: HealthUsersPageProps) {
  const { searchParams: searchParamsPromise } = props;

  const searchParams = await loadSearchParams(searchParamsPromise);

  const healthUsersResponse = await fetchHealthUsers(
    searchParams.pageIndex + 1,
    searchParams.pageSize,
    searchParams.username,
    searchParams.ci,
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Usuarios de Salud</h1>
        <p className="text-muted-foreground mt-2">
          Gestiona los usuarios de salud de la clínica
        </p>
      </div>

      <HealthUsersFilters />

      <HealthUsersTable
        data={healthUsersResponse}
        searchParams={searchParams}
      />
    </div>
  );
}
