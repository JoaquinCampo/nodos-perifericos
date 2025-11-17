import { authGuard } from "~/server/auth/auth-guard";
import { HealthUsersTable } from "./_components/health-users-table";
import { HealthUsersFilters } from "./_components/filters";
import type { SearchParams } from "nuqs";
import { loadSearchParams } from "./_components/search-params";
import { findAllHealthUsers } from "~/server/controllers/health-user";
import { CreateHealthUserButton } from "./_components/create-health-user-button";
import { findAllClinics } from "~/server/controllers/clinic";

interface HealthUsersPageProps {
  searchParams: Promise<SearchParams>;
}

export default async function HealthUsersPage(props: HealthUsersPageProps) {
  const { searchParams: searchParamsPromise } = props;

  const session = await authGuard("HealthUsers");
  const rawSearchParams = await searchParamsPromise;
  const searchParams = await loadSearchParams(searchParamsPromise);

  const defaultClinicName = session.user.clinic.name;
  const clinicParam = rawSearchParams.clinic;
  // Handle case where clinicParam might be string[] (multiple values)
  const clinicParamValue = Array.isArray(clinicParam)
    ? clinicParam[0]
    : clinicParam;
  // Only use clinic filter if explicitly set in URL
  const clinicFilter =
    clinicParamValue !== undefined &&
    clinicParamValue !== null &&
    clinicParamValue !== ""
      ? clinicParamValue
      : undefined;

  const healthUsersResponse = await findAllHealthUsers({
    ...searchParams,
    clinic: clinicFilter,
  });

  const clinics = await findAllClinics();

  const isClinicAdmin = !!session.user.clinicAdmin;
  const isHealthWorker = !!session.user.healthWorker;

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

      <HealthUsersFilters clinics={clinics} />

      <HealthUsersTable
        data={healthUsersResponse}
        isHealthWorker={isHealthWorker}
        loggedInClinicName={defaultClinicName}
        isClinicAdmin={isClinicAdmin}
      />
    </div>
  );
}
