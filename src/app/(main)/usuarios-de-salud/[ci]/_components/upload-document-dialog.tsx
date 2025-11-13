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
import { DocumentUploadDropzone } from "./document-upload-dropzone";
import {
  getPresignedUrlAction,
  createClinicalDocumentAction,
} from "~/server/actions/clinical-document";
import { Upload } from "lucide-react";

interface UploadDocumentDialogProps {
  healthUserCi: string;
  healthWorkerCi: string;
  clinicName: string;
  providerName: string;
}

export function UploadDocumentDialog({
  healthUserCi,
  healthWorkerCi,
  clinicName,
  providerName,
}: UploadDocumentDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async () => {
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
        s3Url,
      });

      if (createResult?.serverError) {
        throw new Error(
          createResult.serverError ?? "Error al crear el documento",
        );
      }

      toast.success("Documento subido exitosamente");
      setOpen(false);
      setSelectedFile(null);
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Error al procesar el archivo",
      );
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
  };

  const handleFileRemove = () => {
    setSelectedFile(null);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Upload className="size-4" />
          Subir Documento
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Subir Documento Clínico</DialogTitle>
          <DialogDescription>
            Selecciona un archivo para subir al historial clínico del usuario
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <DocumentUploadDropzone
            onFileSelect={handleFileSelect}
            onFileRemove={handleFileRemove}
            selectedFile={selectedFile}
            isUploading={isUploading}
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.txt"
            maxSize={10}
          />
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
            onClick={handleUpload}
            disabled={!selectedFile || isUploading}
          >
            {isUploading ? "Subiendo..." : "Subir Documento"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
