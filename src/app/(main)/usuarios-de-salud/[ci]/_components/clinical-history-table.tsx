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
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {data.map((doc) => {
          const hasUrl = !!doc.contentUrl;

          return (
            <Card
              key={doc.id}
              className="group hover:border-primary/50 relative cursor-pointer overflow-hidden transition-all hover:shadow-lg"
              onClick={() => setSelectedDocument(doc)}
            >
              <div className="from-primary/5 absolute inset-0 bg-gradient-to-br via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

              <CardHeader className="relative pb-3">
                <div className="mb-3 flex items-start justify-between gap-2">
                  <Badge
                    variant={hasUrl ? "default" : "secondary"}
                    className="text-xs font-medium"
                  >
                    {hasUrl ? (
                      <>
                        <Link2 className="mr-1 h-3 w-3" />
                        Documento
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
                <CardTitle className="line-clamp-2 text-lg leading-tight font-bold">
                  {doc.title ?? "Sin título"}
                </CardTitle>
                {doc.description && (
                  <CardDescription className="mt-2 line-clamp-2 text-sm leading-relaxed">
                    {doc.description}
                  </CardDescription>
                )}
              </CardHeader>

              <CardContent className="relative space-y-3 pt-0">
                <div className="via-border h-px bg-gradient-to-r from-transparent to-transparent" />

                <div className="space-y-2">
                  <div className="text-muted-foreground flex items-center gap-2 text-xs">
                    <div className="bg-primary/10 flex h-6 w-6 items-center justify-center rounded-md">
                      <Calendar className="text-primary h-3.5 w-3.5" />
                    </div>
                    <span className="font-medium">
                      {format(
                        parseLocalDate(doc.createdAt),
                        "d 'de' MMMM 'de' yyyy",
                        {
                          locale: es,
                        },
                      )}
                    </span>
                  </div>

                  {doc.clinic?.name && (
                    <div className="text-muted-foreground flex items-center gap-2 text-xs">
                      <div className="bg-primary/10 flex h-6 w-6 items-center justify-center rounded-md">
                        <Building2 className="text-primary h-3.5 w-3.5" />
                      </div>
                      <span className="truncate font-medium">
                        {doc.clinic.name}
                      </span>
                    </div>
                  )}
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
              <DialogHeader className="space-y-4">
                <div className="flex flex-wrap items-start gap-2">
                  <Badge
                    variant={
                      selectedDocument.contentUrl ? "default" : "secondary"
                    }
                    className="text-xs font-medium"
                  >
                    {selectedDocument.contentUrl ? (
                      <>
                        <Link2 className="mr-1 h-3 w-3" />
                        Documento
                      </>
                    ) : (
                      <>
                        <FileText className="mr-1 h-3 w-3" />
                        Contenido
                      </>
                    )}
                  </Badge>
                  {selectedDocument.contentType && (
                    <Badge variant="outline" className="text-xs">
                      {selectedDocument.contentType}
                    </Badge>
                  )}
                </div>
                <div>
                  <DialogTitle className="text-2xl leading-tight font-bold">
                    {selectedDocument.title ?? "Sin título"}
                  </DialogTitle>
                  {selectedDocument.description && (
                    <DialogDescription className="mt-2 text-base leading-relaxed">
                      {selectedDocument.description}
                    </DialogDescription>
                  )}
                </div>
              </DialogHeader>

              <div className="space-y-5">
                {/* Date */}
                {selectedDocument.createdAt && (
                  <div className="bg-card rounded-lg border p-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-lg">
                        <Calendar className="text-primary h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs font-medium">
                          Fecha de Creación
                        </p>
                        <p className="text-sm font-semibold">
                          {format(
                            parseLocalDate(selectedDocument.createdAt),
                            "d 'de' MMMM 'de' yyyy 'a las' HH:mm",
                            { locale: es },
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Clinic */}
                {selectedDocument.clinic && (
                  <div className="bg-card rounded-lg border p-4">
                    <div className="flex items-start gap-3">
                      <div className="bg-primary/10 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg">
                        <Building2 className="text-primary h-5 w-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-muted-foreground mb-1 text-xs font-medium">
                          Clínica
                        </p>
                        {selectedDocument.clinic.name && (
                          <p className="mb-1 text-sm font-semibold">
                            {selectedDocument.clinic.name}
                          </p>
                        )}
                        {selectedDocument.clinic.address && (
                          <p className="text-muted-foreground mb-2 text-xs">
                            {selectedDocument.clinic.address}
                          </p>
                        )}
                        {(selectedDocument.clinic.email ||
                          selectedDocument.clinic.phone) && (
                          <div className="text-muted-foreground flex flex-wrap gap-3 text-xs">
                            {selectedDocument.clinic.email && (
                              <span className="flex items-center gap-1">
                                📧 {selectedDocument.clinic.email}
                              </span>
                            )}
                            {selectedDocument.clinic.phone && (
                              <span className="flex items-center gap-1">
                                📞 {selectedDocument.clinic.phone}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Health Worker */}
                {selectedDocument.healthWorker && (
                  <div className="bg-card rounded-lg border p-4">
                    <div className="flex items-start gap-3">
                      <div className="bg-primary/10 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg">
                        <User className="text-primary h-5 w-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-muted-foreground mb-1 text-xs font-medium">
                          Profesional de Salud
                        </p>
                        {(selectedDocument.healthWorker.firstName ||
                          selectedDocument.healthWorker.lastName) && (
                          <p className="mb-1 text-sm font-semibold">
                            {selectedDocument.healthWorker.firstName}{" "}
                            {selectedDocument.healthWorker.lastName}
                          </p>
                        )}
                        {selectedDocument.healthWorker.email && (
                          <p className="text-muted-foreground mb-1 text-xs">
                            {selectedDocument.healthWorker.email}
                          </p>
                        )}
                        {(selectedDocument.healthWorker.documentType ||
                          selectedDocument.healthWorker.document) && (
                          <p className="text-muted-foreground text-xs">
                            {selectedDocument.healthWorker.documentType}
                            {selectedDocument.healthWorker.documentType &&
                              selectedDocument.healthWorker.document &&
                              ": "}
                            {selectedDocument.healthWorker.document}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Content or URL */}
                {selectedDocument.contentUrl ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <Link2 className="h-4 w-4" />
                      Acciones del Documento
                    </div>
                    <div className="from-primary/5 to-primary/10 border-primary/20 rounded-lg border bg-gradient-to-br p-4">
                      <div className="flex flex-wrap gap-3">
                        <Button
                          variant="default"
                          size="default"
                          asChild
                          className="min-w-[140px] flex-1 gap-2"
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
                          size="default"
                          asChild
                          className="bg-background hover:bg-accent min-w-[140px] flex-1 gap-2"
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
                    <div className="bg-muted/50 max-h-96 overflow-y-auto rounded-lg border p-4">
                      <pre className="font-mono text-sm leading-relaxed whitespace-pre-wrap">
                        {selectedDocument.content}
                      </pre>
                    </div>
                  </div>
                ) : (
                  <div className="bg-muted/50 rounded-lg border border-dashed p-6 text-center">
                    <FileText className="text-muted-foreground/50 mx-auto mb-2 h-8 w-8" />
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
