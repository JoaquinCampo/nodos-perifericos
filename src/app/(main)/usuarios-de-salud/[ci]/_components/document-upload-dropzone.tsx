"use client";

import { useCallback, useState } from "react";
import { Upload, X, FileText, Loader2 } from "lucide-react";
import { cn } from "~/lib/utils";

interface DocumentUploadDropzoneProps {
  onFileSelect: (file: File) => void;
  onFileRemove: () => void;
  selectedFile: File | null;
  isUploading: boolean;
  accept?: string;
  maxSize?: number; // in MB
}

export function DocumentUploadDropzone({
  onFileSelect,
  onFileRemove,
  selectedFile,
  isUploading,
  accept = ".pdf,.doc,.docx,.jpg,.jpeg,.png",
  maxSize = 10,
}: DocumentUploadDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateFile = useCallback(
    (file: File): string | null => {
      // Check file size
      const maxSizeBytes = maxSize * 1024 * 1024;
      if (file.size > maxSizeBytes) {
        return `El archivo es demasiado grande. Tamaño máximo: ${maxSize}MB`;
      }

      // Check file type
      const acceptedTypes = accept.split(",").map((type) => type.trim());
      const fileExtension = `.${file.name.split(".").pop()?.toLowerCase()}`;
      const isValidType = acceptedTypes.some(
        (type) =>
          type === fileExtension ||
          (type.includes("*") &&
            file.type?.startsWith(type.split("/")[0] ?? "")),
      );

      if (!isValidType) {
        return `Tipo de archivo no permitido. Tipos aceptados: ${accept}`;
      }

      return null;
    },
    [accept, maxSize],
  );

  const handleFile = useCallback(
    (file: File) => {
      setError(null);
      const validationError = validateFile(file);
      if (validationError) {
        setError(validationError);
        return;
      }
      onFileSelect(file);
    },
    [validateFile, onFileSelect],
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const files = Array.from(e.dataTransfer.files);
      if (files.length > 0 && files[0]) {
        handleFile(files[0]);
      }
    },
    [handleFile],
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0 && files[0]) {
        handleFile(files[0]);
      }
    },
    [handleFile],
  );

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  return (
    <div className="space-y-4">
      {!selectedFile ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            "cursor-pointer rounded-lg border-2 border-dashed p-8 text-center transition-colors",
            isDragging
              ? "border-primary bg-primary/5"
              : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50",
            isUploading && "cursor-not-allowed opacity-50",
          )}
        >
          <input
            type="file"
            id="file-upload"
            className="hidden"
            accept={accept}
            onChange={handleFileInput}
            disabled={isUploading}
          />
          <label
            htmlFor="file-upload"
            className="flex cursor-pointer flex-col items-center"
          >
            <div className="bg-primary/10 mb-4 rounded-full p-4">
              <Upload className="text-primary size-8" />
            </div>
            <p className="mb-2 text-lg font-semibold">
              Arrastra un archivo aquí o haz clic para seleccionar
            </p>
            <p className="text-muted-foreground mb-2 text-sm">
              Tipos de archivo aceptados: {accept}
            </p>
            <p className="text-muted-foreground text-xs">
              Tamaño máximo: {maxSize}MB
            </p>
          </label>
        </div>
      ) : (
        <div className="bg-muted/30 rounded-lg border p-4">
          <div className="flex items-start justify-between">
            <div className="flex flex-1 items-start gap-3">
              <div className="bg-primary/10 rounded-lg p-2">
                <FileText className="text-primary size-6" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">{selectedFile.name}</p>
                <p className="text-muted-foreground text-sm">
                  {formatFileSize(selectedFile.size)}
                </p>
              </div>
            </div>
            {!isUploading && (
              <button
                onClick={onFileRemove}
                className="text-muted-foreground hover:text-destructive p-1 transition-colors"
                type="button"
              >
                <X className="size-5" />
              </button>
            )}
          </div>
          {isUploading && (
            <div className="text-muted-foreground mt-4 flex items-center gap-2 text-sm">
              <Loader2 className="size-4 animate-spin" />
              <span>Subiendo documento...</span>
            </div>
          )}
        </div>
      )}

      {error && (
        <div className="bg-destructive/10 text-destructive rounded-lg p-3 text-sm">
          {error}
        </div>
      )}
    </div>
  );
}
