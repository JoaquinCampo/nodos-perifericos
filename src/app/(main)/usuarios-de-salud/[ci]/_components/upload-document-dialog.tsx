"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Label } from "~/components/ui/label";
import { DocumentUploadDropzone } from "./document-upload-dropzone";
import {
  getPresignedUrlAction,
  createClinicalDocumentAction,
} from "~/server/actions/clinical-document";
import { Upload, FileText } from "lucide-react";

interface UploadDocumentDialogProps {
  healthUserCi: string;
  healthWorkerCi: string;
  clinicName: string;
  providerName: string;
  specialtyNames: string[];
}

export function UploadDocumentDialog({
  healthUserCi,
  healthWorkerCi,
  clinicName,
  providerName,
  specialtyNames,
}: UploadDocumentDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [mode, setMode] = useState<"file" | "text">("file");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");

  const resetForm = () => {
    setSelectedFile(null);
    setTitle("");
    setDescription("");
    setContent("");
    setMode("file");
  };

  const handleFileUpload = async () => {
    if (!selectedFile) {
      toast.error("Por favor selecciona un archivo");
      return;
    }

    setIsUploading(true);

    try {
      const presignedResult = await getPresignedUrlAction({
        fileName: selectedFile.name,
        contentType: selectedFile.type,
        healthUserCi,
        healthWorkerCi,
        clinicName,
        providerName,
        specialtyNames,
      });

      if (presignedResult?.serverError) {
        throw new Error(
          presignedResult.serverError ?? "Error al obtener la URL de carga",
        );
      }

      if (!presignedResult?.data?.uploadUrl) {
        throw new Error("No se pudo obtener la URL de carga");
      }

      const uploadUrl = presignedResult.data.uploadUrl;
      const s3Url = presignedResult.data.s3Url;

      const uploadResponse = await fetch(uploadUrl, {
        method: "PUT",
        body: selectedFile,
        headers: {
          "Content-Type": selectedFile.type,
        },
      });

      if (!uploadResponse.ok) {
        throw new Error("Error al subir el archivo al almacenamiento");
      }

      const createResult = await createClinicalDocumentAction({
        healthUserCi,
        healthWorkerCi,
        clinicName,
        providerName,
        title: title || selectedFile.name,
        description: description || undefined,
        contentUrl: s3Url,
        contentType: selectedFile.type,
      });

      if (createResult?.serverError) {
        throw new Error(
          createResult.serverError ?? "Error al crear el documento",
        );
      }

      toast.success("Documento subido exitosamente");
      setOpen(false);
      resetForm();
      setTimeout(() => {
        router.refresh();
      }, 1500);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Error al procesar el archivo",
      );
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleTextDocumentCreate = async () => {
    if (!title.trim()) {
      toast.error("Por favor ingresa un título");
      return;
    }

    if (!content.trim()) {
      toast.error("Por favor ingresa el contenido del documento");
      return;
    }

    setIsUploading(true);

    try {
      const createResult = await createClinicalDocumentAction({
        healthUserCi,
        healthWorkerCi,
        clinicName,
        providerName,
        title,
        description: description || undefined,
        content: content || undefined,
      });

      if (createResult?.serverError) {
        throw new Error(
          createResult.serverError ?? "Error al crear el documento",
        );
      }

      toast.success("Documento creado exitosamente");
      setOpen(false);
      resetForm();
      // Wait for messaging queue processing before refreshing
      setTimeout(() => {
        router.refresh();
      }, 1500);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Error al crear el documento",
      );
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    if (!title) {
      setTitle(file.name.replace(/\.[^/.]+$/, ""));
    }
  };

  const handleFileRemove = () => {
    setSelectedFile(null);
  };

  const canSubmit =
    mode === "file"
      ? selectedFile !== null
      : title.trim() !== "" && content.trim() !== "";

  return (
    <Dialog
      open={open}
      onOpenChange={(newOpen) => {
        setOpen(newOpen);
        if (!newOpen) {
          resetForm();
        }
      }}
    >
      <DialogTrigger asChild>
        <Button>
          <Upload className="size-4" />
          Crear Documento
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Crear Documento Clínico</DialogTitle>
          <DialogDescription>
            Sube un archivo o crea un documento de texto para el historial
            clínico
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex gap-2 border-b">
            <Button
              type="button"
              variant={mode === "file" ? "default" : "ghost"}
              onClick={() => setMode("file")}
              disabled={isUploading}
              className="rounded-b-none"
            >
              <Upload className="mr-2 size-4" />
              Subir Archivo
            </Button>
            <Button
              type="button"
              variant={mode === "text" ? "default" : "ghost"}
              onClick={() => setMode("text")}
              disabled={isUploading}
              className="rounded-b-none"
            >
              <FileText className="mr-2 size-4" />
              Crear Texto
            </Button>
          </div>

          {mode === "file" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="file-title">Título (opcional)</Label>
                <Input
                  id="file-title"
                  placeholder="Título del documento"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  disabled={isUploading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="file-description">Descripción (opcional)</Label>
                <Textarea
                  id="file-description"
                  placeholder="Descripción del documento"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  disabled={isUploading}
                  rows={3}
                />
              </div>
              <DocumentUploadDropzone
                onFileSelect={handleFileSelect}
                onFileRemove={handleFileRemove}
                selectedFile={selectedFile}
                isUploading={isUploading}
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.txt"
                maxSize={10}
              />
            </div>
          )}

          {mode === "text" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="text-title">Título *</Label>
                <Input
                  id="text-title"
                  placeholder="Título del documento"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  disabled={isUploading}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="text-description">Descripción (opcional)</Label>
                <Textarea
                  id="text-description"
                  placeholder="Descripción del documento"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  disabled={isUploading}
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="text-content">Contenido *</Label>
                <Textarea
                  id="text-content"
                  placeholder="Contenido del documento"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  disabled={isUploading}
                  rows={8}
                  required
                />
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isUploading}
          >
            Cancelar
          </Button>
          <Button
            onClick={
              mode === "file" ? handleFileUpload : handleTextDocumentCreate
            }
            disabled={!canSubmit || isUploading}
          >
            {isUploading
              ? mode === "file"
                ? "Subiendo..."
                : "Creando..."
              : mode === "file"
                ? "Subir Documento"
                : "Crear Documento"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
