"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { DataTable } from "~/components/data-table";
import { Button } from "~/components/ui/button";
import { EditAdminButton } from "./buttons/edit-admin-button";
import { DeleteAdminButton } from "./buttons/delete-admin-button";

type Admin = {
  id: string;
  user: {
    ci: string | null;
    firstName: string | null;
    lastName: string | null;
    email: string;
    phone: string | null;
    dateOfBirth: Date | null;
    address: string | null;
    createdAt: Date;
  };
};

const createColumns = (isClinicAdmin: boolean): ColumnDef<Admin>[] => [
  {
    accessorKey: "user.firstName",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="-ml-4"
      >
        Nombre
        <ArrowUpDown className="ml-2 size-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const { firstName, lastName } = row.original.user;
      return firstName || lastName ? (
        <div className="font-medium">
          {firstName} {lastName}
        </div>
      ) : (
        <div className="text-muted-foreground text-xs">(no asignado)</div>
      );
    },
  },
  {
    accessorKey: "user.ci",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="-ml-4"
      >
        CI
        <ArrowUpDown className="ml-2 size-4" />
      </Button>
    ),
    cell: ({ row }) =>
      row.original.user.ci ? (
        <div>{row.original.user.ci}</div>
      ) : (
        <div className="text-muted-foreground text-xs">(no asignado)</div>
      ),
  },
  {
    accessorKey: "user.email",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="-ml-4"
      >
        Email
        <ArrowUpDown className="ml-2 size-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="lowercase">{row.original.user.email}</div>
    ),
  },
  {
    accessorKey: "user.phone",
    header: "Teléfono",
    cell: ({ row }) =>
      row.original.user.phone ? (
        <div>{row.original.user.phone}</div>
      ) : (
        <div className="text-muted-foreground text-xs">(no asignado)</div>
      ),
  },
  {
    accessorKey: "user.createdAt",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="-ml-4"
      >
        Fecha de Registro
        <ArrowUpDown className="ml-2 size-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div>
        {format(row.original.user.createdAt, "d 'de' MMMM 'de' yyyy", {
          locale: es,
        })}
      </div>
    ),
  },
  ...(isClinicAdmin
    ? [
        {
          id: "actions",
          header: "Acciones",
          cell: ({ row }: { row: { original: Admin } }) => (
            <div className="flex gap-2">
              <EditAdminButton admin={row.original} />
              <DeleteAdminButton admin={row.original} />
            </div>
          ),
        } as ColumnDef<Admin>,
      ]
    : []),
];

interface AdministratorsTableProps {
  data: Admin[];
  isClinicAdmin: boolean;
}

export function AdministratorsTable({
  data,
  isClinicAdmin,
}: AdministratorsTableProps) {
  const columns = createColumns(isClinicAdmin);
  return <DataTable columns={columns} data={data} />;
}
