"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { ServerDataTable } from "~/components/server-data-table";
import { DocumentViewer } from "./document-viewer";
import type { ClinicalDocument } from "@prisma/client";

const createColumns = (): ColumnDef<ClinicalDocument & {
  clinic: { name: string };
  healthWorker: { user: { firstName: string; lastName: string } };
}>[] => [
  {
    accessorKey: "title",
    header: "Título",
    cell: ({ row }) => (
      <div className="font-medium">
        {row.original.title}
      </div>
    ),
  },
  {
    accessorKey: "healthUserCi",
    header: "CI Usuario",
    cell: ({ row }) => (
      <div className="font-mono text-sm">
        {row.original.healthUserCi}
      </div>
    ),
  },
  {
    accessorKey: "documentType",
    header: "Tipo",
    cell: ({ row }) => {
      const typeLabels: Record<string, string> = {
        consultation: "Consulta",
        lab_results: "Análisis",
        radiology: "Radiología",
        prescription: "Receta",
      };

      return (
        <Badge variant="secondary">
          {typeLabels[row.original.documentType] ?? row.original.documentType}
        </Badge>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Estado",
    cell: ({ row }) => {
      const statusLabels: Record<string, string> = {
        draft: "Borrador",
        final: "Final",
        signed: "Firmado",
      };

      const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
        draft: "secondary",
        final: "default",
        signed: "outline",
      };

      return (
        <Badge variant={variants[row.original.status] ?? "secondary"}>
          {statusLabels[row.original.status] ?? row.original.status}
        </Badge>
      );
    },
  },
  {
    id: "hasFile",
    header: "Archivo",
    cell: ({ row }) => {
      const hasFile = !!row.original.contentUrl;
      return (
        <div className="flex items-center gap-2">
          {hasFile ? (
            <Badge variant="outline" className="text-green-600 border-green-200">
              ✓ Adjunto
            </Badge>
          ) : (
            <Badge variant="secondary">
              Solo texto
            </Badge>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "healthWorker",
    header: "Profesional",
    cell: ({ row }) => {
      const { firstName, lastName } = row.original.healthWorker.user;
      return (
        <div className="text-sm">
          {firstName} {lastName}
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="-ml-4"
      >
        Fecha Creación
      </Button>
    ),
    cell: ({ row }) => (
      <div className="text-sm text-muted-foreground">
        {format(new Date(row.original.createdAt), "d 'de' MMMM 'de' yyyy", {
          locale: es,
        })}
      </div>
    ),
  },
  {
    id: "actions",
    header: "Acciones",
    cell: ({ row }) => {
      const document = row.original;
      return (
        <div className="flex items-center gap-2">
          <DocumentViewer
            document={document}
            trigger={
              <Button variant="outline" size="sm">
                Ver
              </Button>
            }
          />
          {document.s3Key && (
            <Button
              variant="outline"
              size="sm"
              onClick={async () => {
                try {
                  const response = await fetch(`/api/clinical-documents/${document.id}/signed-url`);
                  if (response.ok) {
                    const data = await response.json() as { signedUrl: string };
                    window.open(data.signedUrl, '_blank');
                  } else {
                    const errorData = await response.json().catch(() => ({})) as { error?: string };
                    console.error('Error getting download URL:', errorData.error);
                    alert('Error al obtener el enlace de descarga. Intente nuevamente.');
                  }
                } catch (error) {
                  console.error('Error getting download URL:', error);
                  alert('Error de conexión. Verifique su conexión a internet.');
                }
              }}
            >
              Descargar
            </Button>
          )}
        </div>
      );
    },
  },
];

interface ClinicalDocumentsTableProps {
  data: Array<ClinicalDocument & {
    clinic: { name: string };
    healthWorker: { user: { firstName: string; lastName: string } };
  }>;
}

export function ClinicalDocumentsTable({ data }: ClinicalDocumentsTableProps) {
  const columns = createColumns();
  return (
    <ServerDataTable
      columns={columns}
      data={data}
      pagination={{ totalCount: data.length, totalPages: 1 }}
    />
  );
}
