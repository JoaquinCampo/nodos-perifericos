import {
  findAllAccessRequests,
  findHealthUserClinicalHistory,
} from "~/server/controllers/health-user";
import { authGuard } from "~/server/auth/auth-guard";
import { ClinicalHistoryTable } from "./_components/clinical-history-table";
import { RequestAccessButton } from "./_components/request-access-button";
import { Lock } from "lucide-react";

interface HealthUserPageProps {
  params: Promise<{ ci: string }>;
}

export default async function HealthUserPage(props: HealthUserPageProps) {
  const { params } = props;
  const { ci } = await params;
  const session = await authGuard("HealthWorkers");

  try {
    const clinicalHistory = await findHealthUserClinicalHistory({
      healthUserCi: ci,
      clinicName: session.user.clinic.name,
      healthWorkerCi: session.user.ci,
    });

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Historia Clínica</h1>
            <p className="text-muted-foreground mt-2">
              Historial clínico de {clinicalHistory.healthUser.firstName}{" "}
              {clinicalHistory.healthUser.lastName}
            </p>
          </div>
        </div>

        <div className="bg-card rounded-xl border p-6 shadow-sm">
          <div className="mb-4">
            <h2 className="text-xl font-semibold">Información del Usuario</h2>
            <p className="text-muted-foreground text-sm">
              Datos personales del usuario de salud
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <p className="text-muted-foreground text-sm font-medium">
                Nombre Completo
              </p>
              <p className="text-base font-semibold">
                {clinicalHistory.healthUser.firstName}{" "}
                {clinicalHistory.healthUser.lastName}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground text-sm font-medium">CI</p>
              <p className="font-mono text-base font-semibold">
                {clinicalHistory.healthUser.ci}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground text-sm font-medium">Email</p>
              <p className="text-base">{clinicalHistory.healthUser.email}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-sm font-medium">
                Teléfono
              </p>
              <p className="text-base">
                {!!clinicalHistory.healthUser.phone
                  ? clinicalHistory.healthUser.phone
                  : "No disponible"}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground text-sm font-medium">
                Dirección
              </p>
              <p className="text-base">
                {clinicalHistory.healthUser.address ?? "No disponible"}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground text-sm font-medium">
                Fecha de Nacimiento
              </p>
              <p className="text-base">
                {new Date(
                  clinicalHistory.healthUser.dateOfBirth,
                ).toLocaleDateString("es-UY")}
              </p>
            </div>
          </div>
        </div>

        <ClinicalHistoryTable data={clinicalHistory.clinicalDocuments} />
      </div>
    );
  } catch {
    const accessRequests = await findAllAccessRequests({
      healthUserCi: ci,
      healthWorkerCi: session.user.ci,
      clinicName: session.user.clinic.name,
    });

    const hasPendingRequest = accessRequests.length > 0;

    return (
      <div className="flex h-screen flex-col items-center justify-center px-4 text-center">
        <div className="mx-auto max-w-2xl">
          <div className="bg-primary/5 mx-auto mb-6 flex size-20 items-center justify-center rounded-full">
            <Lock className="text-primary size-10" />
          </div>

          <h1 className="mb-3 text-3xl font-bold">
            {hasPendingRequest
              ? "Solicitud de Acceso Pendiente"
              : "Solicitar Acceso a Historia Clínica"}
          </h1>

          <p className="text-muted-foreground mb-8 text-lg">
            {hasPendingRequest
              ? "Tu solicitud está siendo revisada por el usuario de salud"
              : "Necesitas permiso para acceder a esta información"}
          </p>

          <div className="bg-muted/30 mb-8 rounded-xl p-6">
            <p className="text-muted-foreground leading-relaxed">
              {hasPendingRequest
                ? "Ya has enviado una solicitud de acceso para ver el historial clínico de este usuario. El usuario de salud recibirá una notificación y podrá aprobar o rechazar tu solicitud. Una vez aprobada, podrás acceder a toda su información clínica."
                : "Para proteger la privacidad del usuario de salud, necesitas solicitar acceso a su historial clínico. El usuario recibirá una notificación y podrá revisar tu solicitud. Si la aprueba, tendrás acceso completo a su información médica."}
            </p>
          </div>

          <RequestAccessButton
            healthUserCi={ci}
            healthWorkerCi={session.user.ci}
            clinicName={session.user.clinic.name}
            hasPendingRequest={hasPendingRequest}
          />
        </div>
      </div>
    );
  }
}
