"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Button } from "~/components/ui/button";
import type {
  FindAllHealthUsersResponse,
  HealthUser,
} from "~/lib/hcen-api/health-users";
import type { SearchParams } from "./search-params";
import { ServerDataTable } from "~/components/server-data-table";

const createColumns = (): ColumnDef<HealthUser>[] => [
  {
    accessorKey: "firstName",
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
      const { firstName, lastName } = row.original;
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
    accessorKey: "ci",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="-ml-4"
      >
        Documento
        <ArrowUpDown className="ml-2 size-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div>
        {row.original.ci}
      </div>
    ),
  },
  {
    accessorKey: "email",
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
    cell: ({ row }) => <div className="lowercase">{row.original.email}</div>,
  },
  {
    id: "clinicNames",
    accessorFn: (healthUser) => healthUser.clinicNames.join(", "),
    header: "Clínicas",
    cell: ({ row }) => {
      const clinics = row.original.clinicNames;

      if (!clinics?.length) {
        return (
          <div className="text-muted-foreground text-xs">(sin clínicas)</div>
        );
      }

      const joinedNames = clinics.join(", ");

      return (
        <div className="max-w-xs truncate" title={joinedNames}>
          {joinedNames}
        </div>
      );
    },
  },
  {
    accessorKey: "phone",
    header: "Teléfono",
    cell: ({ row }) =>
      row.original.phone ? (
        <div>{row.original.phone}</div>
      ) : (
        <div className="text-muted-foreground text-xs">(no asignado)</div>
      ),
  },
  {
    accessorKey: "gender",
    header: "Género",
    cell: ({ row }) => {
      const gender = row.original.gender;
      return (
        <div className="capitalize">
          {gender === "MALE"
            ? "Masculino"
            : gender === "FEMALE"
              ? "Femenino"
              : "Otro"}
        </div>
      );
    },
  },
  {
    accessorKey: "dateOfBirth",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="-ml-4"
      >
        Fecha de Nacimiento
        <ArrowUpDown className="ml-2 size-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div>
        {format(new Date(row.original.dateOfBirth), "d 'de' MMMM 'de' yyyy", {
          locale: es,
        })}
      </div>
    ),
  },
  {
    accessorKey: "createdAt",
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
        {format(new Date(row.original.createdAt), "d 'de' MMMM 'de' yyyy", {
          locale: es,
        })}
      </div>
    ),
  },
];

interface HealthUsersTableProps {
  data: FindAllHealthUsersResponse;
  searchParams: SearchParams;
}

export function HealthUsersTable({ data }: HealthUsersTableProps) {
  const columns = createColumns();
  return (
    <ServerDataTable
      columns={columns}
      data={data.items}
      pagination={{ totalCount: data.totalItems, totalPages: data.totalPages }}
    />
  );
}
