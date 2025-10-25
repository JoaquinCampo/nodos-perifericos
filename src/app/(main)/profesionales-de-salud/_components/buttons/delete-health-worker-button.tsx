"use client";

import { useState } from "react";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { deleteHealthWorkerAction } from "~/server/actions/health-worker";

interface DeleteHealthWorkerButtonProps {
  healthWorker: {
    id: string;
    user: {
      firstName: string | null;
      lastName: string | null;
    };
  };
}

export function DeleteHealthWorkerButton({
  healthWorker,
}: DeleteHealthWorkerButtonProps) {
  const [open, setOpen] = useState(false);

  const { execute, isExecuting } = useAction(deleteHealthWorkerAction, {
    onSuccess: () => {
      toast.success("Profesional de salud eliminado exitosamente");
      setOpen(false);
    },
    onError: ({ error }) => {
      toast.error(
        error.serverError ?? "Error al eliminar el profesional de salud",
      );
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="text-destructive hover:text-destructive h-8 w-8 p-0"
        >
          <Trash2 className="size-4" />
          <span className="sr-only">Eliminar</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Eliminar Profesional de Salud</DialogTitle>
          <DialogDescription>
            ¿Estás seguro de que deseas eliminar a{" "}
            <strong>
              {healthWorker.user.firstName} {healthWorker.user.lastName}
            </strong>
            ? Esta acción no se puede deshacer.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isExecuting}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={() => execute({ healthWorkerId: healthWorker.id })}
            disabled={isExecuting}
          >
            {isExecuting ? "Eliminando..." : "Eliminar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
