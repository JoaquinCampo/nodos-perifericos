"use client";

import { Button } from "~/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useAction } from "next-safe-action/hooks";
import { createAccessRequestAction } from "~/server/actions/health-user";

interface RequestAccessButtonProps {
  healthUserCi: string;
  healthWorkerCi: string;
  clinicName: string;
  hasPendingRequest: boolean;
}

export function RequestAccessButton(props: RequestAccessButtonProps) {
  const { healthUserCi, healthWorkerCi, clinicName, hasPendingRequest } = props;

  const router = useRouter();

  const { execute, isExecuting } = useAction(createAccessRequestAction, {
    onSuccess: () => {
      toast.success("Solicitud de acceso creada exitosamente");
      router.refresh();
    },
    onError: ({ error }) => {
      toast.error(error.serverError ?? "Error al crear la solicitud de acceso");
    },
  });

  const handleRequestAccess = async () => {
    execute({ healthUserCi, healthWorkerCi, clinicName });
  };

  return (
    <Button
      onClick={handleRequestAccess}
      disabled={hasPendingRequest || isExecuting}
      variant={hasPendingRequest ? "outline" : "default"}
    >
      {hasPendingRequest
        ? "Solicitud Pendiente"
        : isExecuting
          ? "Solicitando..."
          : "Solicitar Acceso"}
    </Button>
  );
}
