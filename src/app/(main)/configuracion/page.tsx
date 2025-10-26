import { authGuard } from "~/server/auth/auth-guard";
import { ConfigurationForm } from "./_components/configuration-form";

export default async function ConfigurationPage() {
  const session = await authGuard("Configuration");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Configuración</h1>
        <p className="text-muted-foreground mt-2">
          Personaliza la apariencia y configuración de tu clínica
        </p>
      </div>

      <div className="bg-card rounded-lg border p-6">
        <ConfigurationForm configuration={session.user.clinic.configuration} />
      </div>
    </div>
  );
}
