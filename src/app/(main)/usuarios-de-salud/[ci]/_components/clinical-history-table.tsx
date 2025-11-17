"use client";

import { useState } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "~/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import {
  Download,
  Eye,
  FileText,
  Link2,
  Calendar,
  Building2,
  User,
} from "lucide-react";
import type { ClinicalDocument } from "~/server/services/health-user/types";
import { parseLocalDate } from "~/lib/utils/date";

interface ClinicalHistoryTableProps {
  data: ClinicalDocument[];
}

export function ClinicalHistoryTable({ data }: ClinicalHistoryTableProps) {
  const [selectedDocument, setSelectedDocument] =
    useState<ClinicalDocument | null>(null);

  if (data.length === 0) {
    return (
      <div className="bg-card rounded-xl border p-12 text-center shadow-sm">
        <FileText className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
        <h3 className="mb-2 text-lg font-semibold">
          No hay documentos clínicos
        </h3>
        <p className="text-muted-foreground text-sm">
          Aún no se han agregado documentos a esta historia clínica
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {data.map((doc) => {
          const hasUrl = !!doc.contentUrl;

          return (
            <Card
              key={doc.id}
              className="cursor-pointer transition-all hover:shadow-md"
              onClick={() => setSelectedDocument(doc)}
            >
              <CardHeader>
                <div className="mb-2 flex items-start justify-between">
                  <Badge
                    variant={hasUrl ? "default" : "secondary"}
                    className="text-xs"
                  >
                    {hasUrl ? (
                      <>
                        <Link2 className="mr-1 h-3 w-3" />
                        URL
                      </>
                    ) : (
                      <>
                        <FileText className="mr-1 h-3 w-3" />
                        Contenido
                      </>
                    )}
                  </Badge>
                  {doc.contentType && (
                    <Badge variant="outline" className="text-xs">
                      {doc.contentType}
                    </Badge>
                  )}
                </div>
                <CardTitle className="line-clamp-2 text-base">
                  {doc.title ?? "Sin título"}
                </CardTitle>
                {doc.description && (
                  <CardDescription className="line-clamp-3">
                    {doc.description}
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="text-muted-foreground flex items-center gap-2 text-xs">
                  <Calendar className="h-3 w-3" />
                  {format(
                    parseLocalDate(doc.createdAt),
                    "d 'de' MMMM 'de' yyyy",
                    {
                      locale: es,
                    },
                  )}
                </div>
                <div className="text-muted-foreground flex items-center gap-2 text-xs">
                  <Building2 className="h-3 w-3" />
                  <span className="truncate">{doc.clinic?.name}</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Dialog
        open={!!selectedDocument}
        onOpenChange={() => setSelectedDocument(null)}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          {selectedDocument && (
            <>
              <DialogHeader>
                <div className="mb-3 flex items-start gap-2">
                  <Badge
                    variant={
                      selectedDocument.contentUrl ? "default" : "secondary"
                    }
                  >
                    {selectedDocument.contentUrl ? (
                      <>
                        <Link2 className="mr-1 h-3 w-3" />
                        Documento con URL
                      </>
                    ) : (
                      <>
                        <FileText className="mr-1 h-3 w-3" />
                        Documento con Contenido
                      </>
                    )}
                  </Badge>
                  {selectedDocument.contentType && (
                    <Badge variant="outline">
                      {selectedDocument.contentType}
                    </Badge>
                  )}
                </div>
                <DialogTitle className="text-2xl">
                  {selectedDocument.title ?? "Sin título"}
                </DialogTitle>
                {selectedDocument.description && (
                  <DialogDescription className="text-base">
                    {selectedDocument.description}
                  </DialogDescription>
                )}
              </DialogHeader>

              <div className="space-y-6">
                {/* Date */}
                {selectedDocument.createdAt && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <Calendar className="h-4 w-4" />
                      Fecha de Creación
                    </div>
                    <p className="text-muted-foreground pl-6 text-sm">
                      {format(
                        parseLocalDate(selectedDocument.createdAt),
                        "d 'de' MMMM 'de' yyyy 'a las' HH:mm",
                        { locale: es },
                      )}
                    </p>
                  </div>
                )}

                {/* Clinic */}
                {selectedDocument.clinic && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <Building2 className="h-4 w-4" />
                      Clínica
                    </div>
                    <div className="bg-muted/50 rounded-lg p-3">
                      {selectedDocument.clinic.name && (
                        <p className="font-medium">
                          {selectedDocument.clinic.name}
                        </p>
                      )}
                      {selectedDocument.clinic.address && (
                        <p className="text-muted-foreground text-sm">
                          {selectedDocument.clinic.address}
                        </p>
                      )}
                      {(selectedDocument.clinic.email ||
                        selectedDocument.clinic.phone) && (
                        <div className="text-muted-foreground mt-2 flex gap-4 text-xs">
                          {selectedDocument.clinic.email && (
                            <span>📧 {selectedDocument.clinic.email}</span>
                          )}
                          {selectedDocument.clinic.phone && (
                            <span>📞 {selectedDocument.clinic.phone}</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Health Worker */}
                {selectedDocument.healthWorker && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <User className="h-4 w-4" />
                      Profesional de Salud
                    </div>
                    <div className="bg-muted/50 rounded-lg p-3">
                      {(selectedDocument.healthWorker.firstName ||
                        selectedDocument.healthWorker.lastName) && (
                        <p className="font-medium">
                          {selectedDocument.healthWorker.firstName}{" "}
                          {selectedDocument.healthWorker.lastName}
                        </p>
                      )}
                      {selectedDocument.healthWorker.email && (
                        <p className="text-muted-foreground text-sm">
                          {selectedDocument.healthWorker.email}
                        </p>
                      )}
                      {(selectedDocument.healthWorker.documentType ||
                        selectedDocument.healthWorker.document) && (
                        <p className="text-muted-foreground mt-1 text-xs">
                          {selectedDocument.healthWorker.documentType}
                          {selectedDocument.healthWorker.documentType &&
                            selectedDocument.healthWorker.document &&
                            ": "}
                          {selectedDocument.healthWorker.document}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Content or URL */}
                {selectedDocument.contentUrl ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <Link2 className="h-4 w-4" />
                      Enlace al Documento
                    </div>
                    <div className="bg-muted/50 rounded-lg p-3">
                      <p className="text-muted-foreground mb-3 text-sm break-all">
                        {selectedDocument.contentUrl}
                      </p>
                      <div className="flex gap-2">
                        <Button
                          variant="default"
                          size="sm"
                          asChild
                          className="gap-2"
                        >
                          <Link
                            href={selectedDocument.contentUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Eye className="h-4 w-4" />
                            Ver Documento
                          </Link>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          asChild
                          className="gap-2"
                        >
                          <Link href={selectedDocument.contentUrl} download>
                            <Download className="h-4 w-4" />
                            Descargar
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : selectedDocument.content ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <FileText className="h-4 w-4" />
                      Contenido del Documento
                    </div>
                    <div className="bg-muted/50 max-h-96 overflow-y-auto rounded-lg p-4">
                      <pre className="text-sm whitespace-pre-wrap">
                        {selectedDocument.content}
                      </pre>
                    </div>
                  </div>
                ) : (
                  <div className="bg-muted/50 rounded-lg p-4 text-center">
                    <p className="text-muted-foreground text-sm">
                      No hay contenido disponible para este documento
                    </p>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
