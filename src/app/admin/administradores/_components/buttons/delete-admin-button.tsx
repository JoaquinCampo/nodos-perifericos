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
import { deleteClinicAdminAction } from "~/server/actions/clinic-admin";

interface DeleteAdminButtonProps {
  admin: {
    id: string;
    user: {
      firstName: string | null;
      lastName: string | null;
    };
  };
}

export function DeleteAdminButton({ admin }: DeleteAdminButtonProps) {
  const [open, setOpen] = useState(false);

  const { execute, isExecuting } = useAction(deleteClinicAdminAction, {
    onSuccess: () => {
      toast.success("Administrador eliminado exitosamente");
      setOpen(false);
    },
    onError: ({ error }) => {
      toast.error(error.serverError ?? "Error al eliminar el administrador");
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
          <DialogTitle>Eliminar Administrador</DialogTitle>
          <DialogDescription>
            ¿Estás seguro de que deseas eliminar a{" "}
            <strong>
              {admin.user.firstName} {admin.user.lastName}
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
            onClick={() => execute({ clinicAdminId: admin.id })}
            disabled={isExecuting}
          >
            {isExecuting ? "Eliminando..." : "Eliminar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
