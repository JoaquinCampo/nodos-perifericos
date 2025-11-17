"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Link2 } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useRouter } from "next/navigation";
import { Button } from "~/components/ui/button";
import type {
  FindAllHealthUsersResponse,
  HealthUser,
} from "~/server/services/health-user/types";
import { ServerDataTable } from "~/components/server-data-table";
import { parseLocalDate } from "~/lib/utils/date";
import { linkClinicToHealthUserAction } from "~/server/actions/health-user";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";

const createColumns = (
  loggedInClinicName: string,
  isClinicAdmin: boolean,
  onLinkSuccess: () => void,
): ColumnDef<HealthUser>[] => [
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
    cell: ({ row }) => <div>{row.original.ci}</div>,
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
    header: "Clínicas",
    cell: ({ row }) => {
      const clinics = row.original.clinics;

      return (
        <div
          className="max-w-xs truncate"
          title={clinics.map((clinic) => clinic.name).join(", ")}
        >
          {clinics.map((clinic) => clinic.name).join(", ")}
        </div>
      );
    },
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
        {format(
          parseLocalDate(row.original.dateOfBirth),
          "d 'de' MMMM 'de' yyyy",
          {
            locale: es,
          },
        )}
      </div>
    ),
  },
  ...(isClinicAdmin
    ? [
        {
          id: "actions",
          header: "Acciones",
          cell: ({ row }: { row: { original: HealthUser } }) => {
            const healthUser = row.original;
            const belongsToClinic = healthUser.clinics.some(
              (clinic: { name: string }) => clinic.name === loggedInClinicName,
            );

            if (belongsToClinic) {
              return (
                <div className="text-muted-foreground text-sm">
                  Ya vinculado
                </div>
              );
            }

            return (
              <LinkClinicButton
                healthUserCi={healthUser.ci}
                clinicName={loggedInClinicName}
                onSuccess={onLinkSuccess}
              />
            );
          },
        },
      ]
    : []),
];

interface LinkClinicButtonProps {
  healthUserCi: string;
  clinicName: string;
  onSuccess: () => void;
}

function LinkClinicButton({
  healthUserCi,
  clinicName,
  onSuccess,
}: LinkClinicButtonProps) {
  const { execute, isExecuting } = useAction(linkClinicToHealthUserAction, {
    onSuccess: () => {
      toast.success("Clínica vinculada exitosamente");
      onSuccess();
    },
    onError: ({ error }) => {
      toast.error(
        error.serverError ?? "Error al vincular la clínica al usuario de salud",
      );
    },
  });

  const handleLink = () => {
    execute({
      healthUserCi,
      clinicName,
    });
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={(e) => {
        e.stopPropagation();
        handleLink();
      }}
      disabled={isExecuting}
    >
      <Link2 className="mr-2 size-4" />
      {isExecuting ? "Vinculando..." : "Vincular"}
    </Button>
  );
}

interface HealthUsersTableProps {
  data: FindAllHealthUsersResponse;
  isHealthWorker?: boolean;
  loggedInClinicName: string;
  isClinicAdmin: boolean;
}

export function HealthUsersTable(props: HealthUsersTableProps) {
  const { data, isHealthWorker, loggedInClinicName, isClinicAdmin } = props;

  const router = useRouter();

  const handleLinkSuccess = () => {
    router.refresh();
  };

  const columns = createColumns(
    loggedInClinicName,
    isClinicAdmin,
    handleLinkSuccess,
  );

  const handleRowClick = (row: HealthUser) => {
    if (isHealthWorker) {
      router.push(`/usuarios-de-salud/${row.ci}`);
    }
  };

  return (
    <ServerDataTable
      columns={columns}
      data={data.items}
      pagination={{ totalCount: data.total, totalPages: data.totalPages }}
      onRowClick={handleRowClick}
    />
  );
}
