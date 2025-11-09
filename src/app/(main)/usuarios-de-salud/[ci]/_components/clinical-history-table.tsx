"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { DataTable } from "~/components/data-table";

type ClinicalDocument = {
  id?: string;
  clinic: {
    id: string;
    name: string;
    email: string;
    phone: string;
    address: string;
    createdAt: string;
    updatedAt: string;
  };
  healthWorker: {
    id: string;
    document: string;
    documentType: string;
    firstName: string;
    lastName: string;
    gender: string;
    email: string;
    phone: string;
    dateOfBirth: string;
  };
  title: string;
  description: string;
  content: string;
  contentType: string;
  contentUrl: string;
  status?: string;
  createdAt?: string;
};

const createColumns = (): ColumnDef<ClinicalDocument>[] => [
  {
    accessorKey: "title",
    header: "Título",
    cell: ({ row }) => <div className="font-medium">{row.original.title}</div>,
  },
  {
    accessorKey: "description",
    header: "Descripción",
    cell: ({ row }) => (
      <div className="text-muted-foreground max-w-md truncate text-sm">
        {row.original.description}
      </div>
    ),
  },
  {
    accessorKey: "contentType",
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
          {typeLabels[row.original.contentType] ?? row.original.contentType}
        </Badge>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Estado",
    cell: ({ row }) => {
      const status = row.original.status;
      if (!status) return null;

      const statusLabels: Record<string, string> = {
        draft: "Borrador",
        final: "Final",
        signed: "Firmado",
      };

      const variants: Record<
        string,
        "default" | "secondary" | "destructive" | "outline"
      > = {
        draft: "secondary",
        final: "default",
        signed: "outline",
      };

      return (
        <Badge variant={variants[status] ?? "secondary"}>
          {statusLabels[status] ?? status}
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
            <Badge
              variant="outline"
              className="border-green-200 text-green-600"
            >
              ✓ Adjunto
            </Badge>
          ) : (
            <Badge variant="secondary">Solo texto</Badge>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "clinic",
    header: "Clínica",
    cell: ({ row }) => (
      <div className="text-sm">{row.original.clinic.name}</div>
    ),
  },
  {
    accessorKey: "healthWorker",
    header: "Profesional",
    cell: ({ row }) => {
      const { firstName, lastName } = row.original.healthWorker;
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
    cell: ({ row }) => {
      const createdAt = row.original.createdAt;
      if (!createdAt) return null;

      return (
        <div className="text-muted-foreground text-sm">
          {format(new Date(createdAt), "d 'de' MMMM 'de' yyyy", {
            locale: es,
          })}
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "Acciones",
    cell: ({ row }) => {
      const document = row.original;
      return (
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              // TODO: Implement document viewer
              console.log("View document:", document);
            }}
          >
            Ver
          </Button>
          {document.contentUrl && (
            <Button
              variant="outline"
              size="sm"
              onClick={async () => {
                if (document.id) {
                  try {
                    const response = await fetch(
                      `/api/clinical-documents/${document.id}/signed-url`,
                    );
                    if (response.ok) {
                      const data = (await response.json()) as {
                        signedUrl: string;
                      };
                      window.open(data.signedUrl, "_blank");
                    } else {
                      const errorData = (await response
                        .json()
                        .catch(() => ({}))) as { error?: string };
                      console.error(
                        "Error getting download URL:",
                        errorData.error,
                      );
                      alert(
                        "Error al obtener el enlace de descarga. Intente nuevamente.",
                      );
                    }
                  } catch (error) {
                    console.error("Error getting download URL:", error);
                    alert(
                      "Error de conexión. Verifique su conexión a internet.",
                    );
                  }
                } else {
                  // Fallback: open contentUrl directly
                  window.open(document.contentUrl, "_blank");
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

interface ClinicalHistoryTableProps {
  data: ClinicalDocument[];
}

export function ClinicalHistoryTable({ data }: ClinicalHistoryTableProps) {
  const columns = createColumns();
  return <DataTable columns={columns} data={data} />;
}
