"use client";

import { useState, useEffect } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { DataTable } from "~/components/data-table";
import { ArrowUpDown, Pencil, Trash2, Plus } from "lucide-react";
import { Button } from "~/components/ui/button";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  createClinicAdminAction,
  updateClinicAdminAction,
  deleteClinicAdminAction,
} from "~/server/actions/clinic-admin";

type Admin = {
  id: string;
  user: {
    id: string;
    ci: string | null;
    firstName: string | null;
    lastName: string | null;
    email: string;
    phone: string | null;
    createdAt: Date;
  };
};

const adminFormSchema = z.object({
  firstName: z.string().min(1, "El nombre es requerido"),
  lastName: z.string().min(1, "El apellido es requerido"),
  ci: z.string().min(1, "La cédula es requerida"),
  email: z.string().email("El email no es válido"),
  phone: z.string().optional(),
});

type AdminFormValues = z.infer<typeof adminFormSchema>;

function CreateAdminDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const form = useForm<AdminFormValues>({
    resolver: zodResolver(adminFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      ci: "",
      email: "",
      phone: "",
    },
  });

  const { execute: createAdmin, isExecuting } = useAction(
    createClinicAdminAction,
    {
      onSuccess: () => {
        toast.success("Administrador creado exitosamente");
        form.reset();
        onOpenChange(false);
      },
      onError: ({ error }) => {
        toast.error(error.serverError ?? "Error al crear el administrador");
      },
    },
  );

  const onSubmit = (data: AdminFormValues) => {
    createAdmin(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Crear Administrador</DialogTitle>
          <DialogDescription>
            Completa los datos para crear un nuevo administrador.
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
                onClick={() => onOpenChange(false)}
                disabled={isExecuting}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isExecuting}>
                {isExecuting ? "Creando..." : "Crear"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

function EditAdminDialog({
  admin,
  open,
  onOpenChange,
}: {
  admin: Admin | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const form = useForm<AdminFormValues>({
    resolver: zodResolver(adminFormSchema),
    defaultValues: {
      firstName: admin?.user.firstName ?? "",
      lastName: admin?.user.lastName ?? "",
      ci: admin?.user.ci ?? "",
      email: admin?.user.email ?? "",
      phone: admin?.user.phone ?? "",
    },
  });

  useEffect(() => {
    if (admin) {
      form.reset({
        firstName: admin.user.firstName ?? "",
        lastName: admin.user.lastName ?? "",
        ci: admin.user.ci ?? "",
        email: admin.user.email,
        phone: admin.user.phone ?? "",
      });
    }
  }, [admin, form]);

  const { execute: updateAdmin, isExecuting } = useAction(
    updateClinicAdminAction,
    {
      onSuccess: () => {
        toast.success("Administrador actualizado exitosamente");
        onOpenChange(false);
      },
      onError: ({ error }) => {
        toast.error(
          error.serverError ?? "Error al actualizar el administrador",
        );
      },
    },
  );

  const onSubmit = (data: AdminFormValues) => {
    if (!admin) return;
    updateAdmin({
      clinicAdminId: admin.id,
      ...data,
    });
  };

  if (!admin) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
                onClick={() => onOpenChange(false)}
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

function DeleteAdminDialog({
  admin,
  open,
  onOpenChange,
}: {
  admin: Admin | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { execute: deleteAdmin, isExecuting } = useAction(
    deleteClinicAdminAction,
    {
      onSuccess: () => {
        toast.success("Administrador eliminado exitosamente");
        onOpenChange(false);
      },
      onError: ({ error }) => {
        toast.error(error.serverError ?? "Error al eliminar el administrador");
      },
    },
  );

  const handleDelete = () => {
    if (!admin) return;
    deleteAdmin({ clinicAdminId: admin.id });
  };

  if (!admin) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
            onClick={() => onOpenChange(false)}
            disabled={isExecuting}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={isExecuting}
          >
            {isExecuting ? "Eliminando..." : "Eliminar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

const columns: ColumnDef<Admin>[] = [
  {
    accessorKey: "user.firstName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="-ml-4"
        >
          Nombre
          <ArrowUpDown className="ml-2 size-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const firstName = row.original.user.firstName;
      const lastName = row.original.user.lastName;

      if (!firstName && !lastName) {
        return (
          <div className="text-muted-foreground text-xs">(no asignado)</div>
        );
      }

      return (
        <div className="font-medium">
          {firstName} {lastName}
        </div>
      );
    },
  },
  {
    accessorKey: "user.ci",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="-ml-4"
        >
          CI
          <ArrowUpDown className="ml-2 size-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return row.original.user.ci ? (
        <div>{row.original.user.ci}</div>
      ) : (
        <div className="text-muted-foreground text-xs">(no asignado)</div>
      );
    },
  },
  {
    accessorKey: "user.email",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="-ml-4"
        >
          Email
          <ArrowUpDown className="ml-2 size-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return <div className="lowercase">{row.original.user.email}</div>;
    },
  },
  {
    accessorKey: "user.phone",
    header: "Teléfono",
    cell: ({ row }) => {
      return row.original.user.phone ? (
        <div>{row.original.user.phone}</div>
      ) : (
        <div className="text-muted-foreground text-xs">(no asignado)</div>
      );
    },
  },
  {
    accessorKey: "user.createdAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="-ml-4"
        >
          Fecha de Registro
          <ArrowUpDown className="ml-2 size-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <div>
          {new Date(row.original.user.createdAt).toLocaleDateString("es-UY", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "Acciones",
    cell: ({ row, table }) => {
      const admin = row.original;
      const { onEdit, onDelete } = table.options.meta as {
        onEdit: (admin: Admin) => void;
        onDelete: (admin: Admin) => void;
      };

      return (
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(admin)}
            className="h-8 w-8 p-0"
          >
            <Pencil className="size-4" />
            <span className="sr-only">Editar</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(admin)}
            className="text-destructive hover:text-destructive h-8 w-8 p-0"
          >
            <Trash2 className="size-4" />
            <span className="sr-only">Eliminar</span>
          </Button>
        </div>
      );
    },
  },
];

interface AdministratorsTableProps {
  data: Admin[];
}

export function AdministratorsTable({ data }: AdministratorsTableProps) {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null);

  const handleEdit = (admin: Admin) => {
    setSelectedAdmin(admin);
    setEditDialogOpen(true);
  };

  const handleDelete = (admin: Admin) => {
    setSelectedAdmin(admin);
    setDeleteDialogOpen(true);
  };

  return (
    <>
      <div className="mb-4 flex justify-end">
        <Button onClick={() => setCreateDialogOpen(true)}>
          <Plus className="mr-2 size-4" />
          Crear Administrador
        </Button>
      </div>
      <DataTable
        columns={columns}
        data={data}
        meta={{
          onEdit: handleEdit,
          onDelete: handleDelete,
        }}
      />
      <CreateAdminDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
      />
      <EditAdminDialog
        admin={selectedAdmin}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
      />
      <DeleteAdminDialog
        admin={selectedAdmin}
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
      />
    </>
  );
}
