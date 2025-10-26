import { Users, Stethoscope, Shield, Settings } from "lucide-react";
import { authGuard } from "~/server/auth/auth-guard";
import { AuthenticatedPaths, AdminPaths } from "~/lib/constants/paths";
import { PageCard } from "./_components/page-card";
import { DEFAULT_CONFIGURATION } from "~/lib/constants/configuration";

const pages = (isClinicAdmin: boolean) => [
  {
    title: "Usuarios de Salud",
    description:
      "Visualiza y gestiona los usuarios de salud registrados en la clínica. Consulta historiales médicos, actualiza información personal y administra permisos de acceso.",
    icon: Users,
    path: AuthenticatedPaths.HealthUsers,
    visible: true,
  },
  {
    title: "Profesionales de Salud",
    description:
      "Administra el equipo médico de la clínica. Gestiona perfiles profesionales, especialidades, horarios de atención y asignación de pacientes.",
    icon: Stethoscope,
    path: AuthenticatedPaths.HealthWorkers,
    visible: true,
  },
  {
    title: "Administradores",
    description: isClinicAdmin
      ? "Gestiona los administradores de la clínica. Crea, edita y elimina cuentas de administradores con acceso completo al sistema."
      : "Consulta la lista de administradores de la clínica y su información de contacto.",
    icon: Shield,
    path: AuthenticatedPaths.ClinicAdmins,
    visible: true,
  },
  {
    title: "Configuración",
    description:
      "Configura los ajustes generales de la clínica, personaliza parámetros del sistema y gestiona las preferencias de la organización.",
    icon: Settings,
    path: AdminPaths.Configuration,
    visible: isClinicAdmin,
  },
];

export default async function DashboardPage() {
  const session = await authGuard("Dashboard");

  const isClinicAdmin = !!session.user.clinicAdmin;
  const visiblePages = pages(isClinicAdmin).filter((page) => page.visible);

  const config = session.user.clinic.configuration;

  const cardConfig = {
    cardBackgroundColor:
      config?.cardBackgroundColor ?? DEFAULT_CONFIGURATION.cardBackgroundColor,
    cardTextColor: config?.cardTextColor ?? DEFAULT_CONFIGURATION.cardTextColor,
    iconBackgroundColor:
      config?.iconBackgroundColor ?? DEFAULT_CONFIGURATION.iconBackgroundColor,
    iconTextColor: config?.iconTextColor ?? DEFAULT_CONFIGURATION.iconTextColor,
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold">
          Bienvenido, {session.user.firstName ?? session.user.email}
        </h1>
        <p className="text-muted-foreground mt-3 text-lg">
          {session.user.clinic.name}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {visiblePages.map((page) => (
          <PageCard key={page.path} page={page} configuration={cardConfig} />
        ))}
      </div>
    </div>
  );
}
