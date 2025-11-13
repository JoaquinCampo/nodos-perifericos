"use client";

import { useState, useEffect } from "react";
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
  const { healthUserCi, healthWorkerCi, clinicName, hasPendingRequest: initialHasPendingRequest } = props;

  const router = useRouter();
  const [optimisticHasPendingRequest, setOptimisticHasPendingRequest] = useState(initialHasPendingRequest);

  // Sync optimistic state with prop changes (e.g., after refresh)
  useEffect(() => {
    setOptimisticHasPendingRequest(initialHasPendingRequest);
  }, [initialHasPendingRequest]);

  const { execute, isExecuting } = useAction(createAccessRequestAction, {
    onSuccess: () => {
      setOptimisticHasPendingRequest(true);
      toast.success("Solicitud de acceso creada exitosamente");
      router.refresh();
    },
    onError: ({ error }) => {
      setOptimisticHasPendingRequest(initialHasPendingRequest);
      toast.error(error.serverError ?? "Error al crear la solicitud de acceso");
    },
  });

  const handleRequestAccess = async () => {
    setOptimisticHasPendingRequest(true);
    execute({ healthUserCi, healthWorkerCi, clinicName });
  };

  const displayHasPendingRequest = optimisticHasPendingRequest || isExecuting;

  return (
    <Button
      onClick={handleRequestAccess}
      disabled={displayHasPendingRequest}
      variant={displayHasPendingRequest ? "outline" : "default"}
    >
      {displayHasPendingRequest
        ? "Solicitud Pendiente"
        : "Solicitar Acceso"}
    </Button>
  );
}
