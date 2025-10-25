"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";
import { Pencil } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { updateClinicAdminAction } from "~/server/actions/clinic-admin";
import {
  type UpdateClinicAdminSchema,
  updateClinicAdminSchema,
} from "~/server/schemas/clinic-admin";

interface EditAdminButtonProps {
  admin: {
    id: string;
    user: {
      ci: string | null;
      firstName: string | null;
      lastName: string | null;
      email: string;
      phone: string | null;
      dateOfBirth: Date | null;
      address: string | null;
    };
  };
}

export function EditAdminButton({ admin }: EditAdminButtonProps) {
  const [open, setOpen] = useState(false);

  const form = useForm<UpdateClinicAdminSchema>({
    resolver: zodResolver(updateClinicAdminSchema),
    defaultValues: {
      clinicAdminId: admin.id,
      firstName: admin.user.firstName ?? "",
      lastName: admin.user.lastName ?? "",
      ci: admin.user.ci ?? "",
      email: admin.user.email,
      phone: admin.user.phone ?? "",
      address: admin.user.address ?? "",
      dateOfBirth: admin.user.dateOfBirth ?? undefined,
    },
  });

  const { execute, isExecuting } = useAction(updateClinicAdminAction, {
    onSuccess: () => {
      toast.success("Administrador actualizado exitosamente");
      setOpen(false);
    },
    onError: ({ error }) => {
      toast.error(error.serverError ?? "Error al actualizar el administrador");
    },
  });

  const onSubmit = (data: UpdateClinicAdminSchema) => {
    execute(data);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <Pencil className="size-4" />
          <span className="sr-only">Editar</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Administrador</DialogTitle>
          <DialogDescription>
            Modifica los datos del administrador.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input placeholder="Juan" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Apellido</FormLabel>
                  <FormControl>
                    <Input placeholder="Pérez" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="ci"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CI</FormLabel>
                  <FormControl>
                    <Input placeholder="12345678" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="juan@ejemplo.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Teléfono (opcional)</FormLabel>
                  <FormControl>
                    <Input placeholder="099123456" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isExecuting}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isExecuting}>
                {isExecuting ? "Guardando..." : "Guardar"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
