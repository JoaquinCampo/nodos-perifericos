"use client";

import { useEffect } from "react";
import { Button } from "~/components/ui/button";
import { AlertCircle } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Error loading health user page:", error);
  }, [error]);

  return (
    <div className="flex h-full min-h-[400px] items-center justify-center">
      <div className="mx-auto max-w-md text-center">
        <div className="bg-destructive/10 mx-auto mb-4 flex size-16 items-center justify-center rounded-full">
          <AlertCircle className="text-destructive size-8" />
        </div>
        <h2 className="mb-2 text-2xl font-bold">Error al cargar la historia clínica</h2>
        <p className="text-muted-foreground mb-6">
          {error.message || "No se pudo cargar la información. Por favor, intenta nuevamente."}
        </p>
        <div className="flex gap-2 justify-center">
          <Button onClick={reset} variant="default">
            Intentar nuevamente
          </Button>
        </div>
      </div>
    </div>
  );
}

