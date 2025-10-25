"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { DataTable } from "~/components/data-table";
import { Button } from "~/components/ui/button";
import { EditHealthWorkerButton } from "./buttons/edit-health-worker-button";
import { DeleteHealthWorkerButton } from "./buttons/delete-health-worker-button";

type HealthWorker = {
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
  healthWorkerSpecialities: {
    speciality: {
      name: string;
    };
  }[];
};

const createColumns = (isClinicAdmin: boolean): ColumnDef<HealthWorker>[] => [
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
    accessorKey: "healthWorkerSpecialities",
    header: "Especialidades",
    cell: ({ row }) => {
      const specialities = row.original.healthWorkerSpecialities;
      return specialities.length > 0 ? (
        <div className="flex flex-wrap gap-1">
          {specialities.map((spec, idx) => (
            <span
              key={idx}
              className="bg-primary/10 text-primary rounded-md px-2 py-1 text-xs capitalize"
            >
              {spec.speciality.name}
            </span>
          ))}
        </div>
      ) : (
        <div className="text-muted-foreground text-xs">
          (sin especialidades)
        </div>
      );
    },
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
          cell: ({ row }: { row: { original: HealthWorker } }) => (
            <div className="flex gap-2">
              <EditHealthWorkerButton healthWorker={row.original} />
              <DeleteHealthWorkerButton healthWorker={row.original} />
            </div>
          ),
        } as ColumnDef<HealthWorker>,
      ]
    : []),
];

interface HealthWorkersTableProps {
  data: HealthWorker[];
  isClinicAdmin: boolean;
}

export function HealthWorkersTable({
  data,
  isClinicAdmin,
}: HealthWorkersTableProps) {
  const columns = createColumns(isClinicAdmin);
  return <DataTable columns={columns} data={data} />;
}
