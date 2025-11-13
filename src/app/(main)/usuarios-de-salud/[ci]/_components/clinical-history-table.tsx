"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { DataTable } from "~/components/data-table";
import { Download, Eye } from "lucide-react";
import type { ClinicalDocument } from "~/server/services/health-user/types";
import { parseLocalDate } from "~/lib/utils/date";

const createColumns = (): ColumnDef<ClinicalDocument>[] => [
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="-ml-4"
      >
        Fecha
      </Button>
    ),
    cell: ({ row }) => {
      const createdAt = row.original.createdAt;
      if (!createdAt) return null;

      return (
        <div className="text-sm">
          {format(parseLocalDate(createdAt), "d 'de' MMMM 'de' yyyy", {
            locale: es,
          })}
        </div>
      );
    },
  },
  {
    accessorKey: "clinic",
    header: "Clínica",
    cell: ({ row }) => {
      const clinic = row.original.clinic;
      return (
        <div className="space-y-1">
          <div className="text-sm font-medium">{clinic.name}</div>
          <div className="text-muted-foreground text-xs">{clinic.address}</div>
        </div>
      );
    },
  },
  {
    accessorKey: "healthWorker",
    header: "Profesional",
    cell: ({ row }) => {
      const { firstName, lastName, email } = row.original.healthWorker;
      return (
        <div className="space-y-1">
          <div className="text-sm font-medium">
            {firstName} {lastName}
          </div>
          <div className="text-muted-foreground text-xs">{email}</div>
        </div>
      );
    },
  },
  {
    id: "hasFile",
    header: "Documento",
    cell: () => {
      return (
        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className="border-green-200 bg-green-50 text-green-700"
          >
            ✓ Disponible
          </Badge>
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "Acciones",
    cell: ({ row }) => {
      const clinicalDoc = row.original;

      return (
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" asChild className="gap-2">
            <Link
              href={clinicalDoc.s3Url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Eye className="h-4 w-4" />
              Ver
            </Link>
          </Button>
          <Button variant="outline" size="sm" asChild className="gap-2">
            <Link href={clinicalDoc.s3Url} download>
              <Download className="h-4 w-4" />
              Descargar
            </Link>
          </Button>
        </div>
      );
    },
  },
];

interface ClinicalHistoryTableProps {
  data: ClinicalDocument[];
}

export function ClinicalHistoryTable({ data }: ClinicalHistoryTableProps) {
  const columns = createColumns();
  return <DataTable columns={columns} data={data} />;
}
