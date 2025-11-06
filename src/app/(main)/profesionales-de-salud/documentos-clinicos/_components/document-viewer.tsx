"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import { Dialog, DialogContent, DialogTrigger } from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { ScrollArea } from "~/components/ui/scroll-area";
import {
  FileText,
  Image,
  File,
  Download,
  ExternalLink,
  Loader2,
  CalendarClock,
  Building2,
  User,
  AlignLeft,
} from "lucide-react";
import type { ClinicalDocument } from "@prisma/client";

interface DocumentViewerProps {
  document: ClinicalDocument & {
    clinic: { name: string };
    healthWorker: { user: { firstName: string; lastName: string } };
  };
  trigger: ReactNode;
}

const formatFileSize = (bytes: number) => {
  if (bytes >= 1024 * 1024) {
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  }

  if (bytes >= 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${bytes} B`;
};

const formatDocumentType = (value?: string | null) => {
  if (!value) return "No especificado";

  return value
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

const formatContentType = (value?: string | null) => {
  if (!value) return "Sin tipo";

  if (value === "application/pdf") return "PDF";
  if (value.startsWith("image/")) {
    return value.replace("image/", "").toUpperCase();
  }

  return value;
};

export function DocumentViewer({ document, trigger }: DocumentViewerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [signedUrl, setSignedUrl] = useState<string | null>(null);
  const [isLoadingUrl, setIsLoadingUrl] = useState(false);

  const fetchSignedUrl = useCallback(async () => {
    if (!document.s3Key || signedUrl) return signedUrl;

    setIsLoadingUrl(true);
    try {
      const response = await fetch(`/api/clinical-documents/${document.id}/signed-url`);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({})) as { error?: string };
        throw new Error(errorData.error ?? "Failed to get secure file access");
      }
      const data = await response.json() as { signedUrl: string };
      setSignedUrl(data.signedUrl);
      return data.signedUrl;
    } catch (error) {
      console.error("Error fetching signed URL:", error);
      return null;
    } finally {
      setIsLoadingUrl(false);
    }
  }, [document.id, document.s3Key, signedUrl]);

  useEffect(() => {
    if (!isOpen || !document.s3Key || signedUrl || isLoadingUrl) return;

    const previewable =
      document.contentType === "application/pdf" ||
      Boolean(document.contentType?.startsWith("image/"));

    if (!previewable) return;

    void fetchSignedUrl();
  }, [document.contentType, document.s3Key, fetchSignedUrl, isLoadingUrl, isOpen, signedUrl]);

  const getFileIcon = (contentType?: string | null, className = "h-10 w-10") => {
    if (!contentType) return <File className={className} />;

    if (contentType.startsWith("image/")) return <Image className={className} />;
    if (contentType === "application/pdf") return <FileText className={className} />;
    return <File className={className} />;
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      draft: "secondary",
      final: "default",
      signed: "outline",
    };

    const labels: Record<string, string> = {
      draft: "Borrador",
      final: "Final",
      signed: "Firmado",
    };

    return (
      <Badge
        variant={variants[status] ?? "secondary"}
        className="rounded-full px-3 py-1 text-xs font-medium capitalize"
      >
        {labels[status] ?? status}
      </Badge>
    );
  };

  const renderDocumentContent = () => {
    if (!document.contentUrl) {
      return (
        <div className="flex h-full flex-col items-center justify-center gap-6 bg-muted/10 p-10 text-center">
          <div className="rounded-full bg-background p-5 shadow-sm">
            <File className="h-12 w-12 text-muted-foreground" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-semibold text-foreground">Documento sin archivo adjunto</h3>
            <p className="text-sm text-muted-foreground">
              Este documento solo contiene información textual.
            </p>
          </div>
          {document.content && (
            <ScrollArea className="max-h-64 w-full rounded-lg border bg-background p-4 text-left">
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
                {document.content}
              </p>
            </ScrollArea>
          )}
        </div>
      );
    }

    if (document.contentType?.startsWith("image/")) {
      return (
        <div className="flex h-full items-center justify-center bg-muted/20 p-6">
          {signedUrl ? (
            <img
              src={signedUrl}
              alt={document.title}
              className="max-h-full max-w-full rounded-lg border bg-background object-contain shadow-xl"
            />
          ) : (
            <div className="flex items-center gap-3 rounded-full border bg-background/90 px-4 py-2 text-sm text-muted-foreground shadow-sm">
              <Loader2 className="h-4 w-4 animate-spin" />
              Preparando vista previa…
            </div>
          )}
        </div>
      );
    }

    if (document.contentType === "application/pdf") {
      return (
        <div className="h-full overflow-hidden bg-muted/20">
          {signedUrl ? (
            <iframe
              src={`${signedUrl}#toolbar=0`}
              title={document.title}
              className="h-full w-full border-0"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full items-center justify-center gap-3 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Preparando vista previa…
            </div>
          )}
        </div>
      );
    }

    return (
      <div className="flex h-full flex-col items-center justify-center gap-6 bg-muted/10 p-12 text-center">
        <div className="rounded-full bg-background p-5 shadow-sm">
          {getFileIcon(document.contentType, "h-12 w-12")}
        </div>
        <div className="max-w-md space-y-2">
          <h3 className="text-lg font-semibold text-foreground">{document.title}</h3>
          <p className="text-sm text-muted-foreground">
            No hay vista previa disponible para este tipo de archivo. Usa las acciones de abajo para abrirlo o descargarlo.
          </p>
          <div className="flex flex-wrap justify-center gap-2 text-xs text-muted-foreground">
            {document.contentType && (
              <span className="inline-flex items-center gap-1 rounded-full border px-3 py-1">
                <FileText className="h-3 w-3" />
                {formatContentType(document.contentType)}
              </span>
            )}
            {document.fileSize && (
              <span className="inline-flex items-center gap-1 rounded-full border px-3 py-1">
                <Download className="h-3 w-3" />
                {formatFileSize(document.fileSize)}
              </span>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-h-[92vh] max-w-6xl overflow-hidden border-0 p-0 shadow-2xl sm:max-w-6xl">
        <div className="flex h-[75vh] flex-col lg:h-[80vh] lg:flex-row">
          <aside className="flex h-full flex-col border-r bg-muted/10 lg:w-[22rem]">
            <div className="flex items-start gap-4 border-b bg-gradient-to-br from-background via-muted/40 to-muted/10 px-6 py-6">
              <div className="rounded-lg border bg-background p-3 shadow-sm">
                {getFileIcon(document.contentType, "h-8 w-8")}
              </div>
              <div className="flex-1 space-y-3">
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                    Documento
                  </p>
                  <h2 className="line-clamp-2 text-lg font-semibold leading-tight text-foreground">
                    {document.title}
                  </h2>
                </div>
                <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                  {document.contentType && (
                    <span className="inline-flex items-center gap-1 rounded-full border bg-background/80 px-3 py-1">
                      <FileText className="h-3 w-3" />
                      {formatContentType(document.contentType)}
                    </span>
                  )}
                  {document.fileSize && (
                    <span className="inline-flex items-center gap-1 rounded-full border bg-background/80 px-3 py-1">
                      <Download className="h-3 w-3" />
                      {formatFileSize(document.fileSize)}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <ScrollArea className="h-full">
              <div className="space-y-6 px-6 py-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                      Estado
                    </span>
                    {getStatusBadge(document.status)}
                  </div>

                  <div className="space-y-3 text-sm">
                    <div className="flex items-start gap-3 rounded-lg border bg-background/70 px-3 py-3">
                      <AlignLeft className="mt-0.5 h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs uppercase tracking-wide text-muted-foreground">Tipo</p>
                        <p className="text-sm text-foreground">{formatDocumentType(document.documentType)}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 rounded-lg border bg-background/70 px-3 py-3">
                      <User className="mt-0.5 h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs uppercase tracking-wide text-muted-foreground">Profesional</p>
                        <p className="text-sm text-foreground">
                          {document.healthWorker.user.firstName} {document.healthWorker.user.lastName}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 rounded-lg border bg-background/70 px-3 py-3">
                      <Building2 className="mt-0.5 h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs uppercase tracking-wide text-muted-foreground">Clínica</p>
                        <p className="text-sm text-foreground">{document.clinic.name}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 rounded-lg border bg-background/70 px-3 py-3">
                      <CalendarClock className="mt-0.5 h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs uppercase tracking-wide text-muted-foreground">Creado</p>
                        <p className="text-sm text-foreground">
                          {new Date(document.createdAt).toLocaleDateString("es-ES", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>

                    {document.fileSize ? (
                      <div className="flex items-start gap-3 rounded-lg border bg-background/70 px-3 py-3">
                        <Download className="mt-0.5 h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-xs uppercase tracking-wide text-muted-foreground">Tamaño</p>
                          <p className="text-sm text-foreground">{formatFileSize(document.fileSize)}</p>
                        </div>
                      </div>
                    ) : null}
                  </div>
                </div>

                {document.description && (
                  <div className="space-y-2">
                    <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                      Descripción
                    </p>
                    <div className="rounded-lg border bg-background/70 p-4">
                      <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
                        {document.description}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          </aside>

          <section className="flex flex-1 flex-col">
            <div className="flex-1 overflow-hidden bg-background">{renderDocumentContent()}</div>
            <div className="border-t bg-background/95 px-6 py-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs text-muted-foreground">Acciones disponibles para este archivo.</p>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Button
                    type="button"
                    onClick={async () => {
                      try {
                        const url = await fetchSignedUrl();
                        if (url) window.open(url, "_blank");
                      } catch (error) {
                        console.error("Error opening file:", error);
                      }
                    }}
                    disabled={isLoadingUrl}
                    className="gap-2 sm:w-auto"
                    size="lg"
                  >
                    {isLoadingUrl ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <ExternalLink className="h-5 w-5" />
                    )}
                    Abrir en nueva pestaña
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={async () => {
                      try {
                        const url = await fetchSignedUrl();
                        if (url) {
                          const link = window.document.createElement("a");
                          link.href = url;
                          link.download = document.title;
                          link.click();
                        }
                      } catch (error) {
                        console.error("Error downloading file:", error);
                      }
                    }}
                    disabled={isLoadingUrl}
                    className="gap-2 sm:w-auto"
                    size="lg"
                  >
                    {isLoadingUrl ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <Download className="h-5 w-5" />
                    )}
                    Descargar
                  </Button>
                </div>
              </div>
            </div>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
}
