"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";
import { RotateCcw, X } from "lucide-react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { ColorInput } from "~/components/ui/color-input";
import {
  updateConfigurationAction,
  resetConfigurationAction,
} from "~/server/actions/configuration";
import {
  type UpdateConfigurationSchema,
  updateConfigurationSchema,
} from "~/server/schemas/configuration";
import {
  getLogoPresignedUrlAction,
  deleteLogoAction,
} from "~/server/actions/logo-upload";
import type { Configuration } from "@prisma/client";
import Image from "next/image";

interface ConfigurationFormProps {
  configuration: Configuration;
}

export function ConfigurationForm({ configuration }: ConfigurationFormProps) {
  const router = useRouter();
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [isDeletingLogo, setIsDeletingLogo] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(
    configuration.logoUrl,
  );

  const form = useForm<UpdateConfigurationSchema>({
    resolver: zodResolver(updateConfigurationSchema),
    defaultValues: {
      configurationId: configuration.id,
      portalTitle: configuration.portalTitle,
      logoUrl: configuration.logoUrl ?? undefined,
      sidebarTextColor: configuration.sidebarTextColor,
      sidebarBackgroundColor: configuration.sidebarBackgroundColor,
      backgroundColor: configuration.backgroundColor,
      iconTextColor: configuration.iconTextColor,
      iconBackgroundColor: configuration.iconBackgroundColor,
      cardBackgroundColor: configuration.cardBackgroundColor,
      cardTextColor: configuration.cardTextColor,
    },
  });

  const { execute, isExecuting } = useAction(updateConfigurationAction, {
    onSuccess: () => {
      toast.success("Configuración actualizada exitosamente");
      router.refresh();
    },
    onError: ({ error }) => {
      toast.error(error.serverError ?? "Error al actualizar la configuración");
    },
  });

  const { execute: executeReset, isExecuting: isResetting } = useAction(
    resetConfigurationAction,
    {
      onSuccess: () => {
        toast.success("Configuración restablecida a valores predeterminados");
        form.reset();
        router.refresh();
      },
      onError: ({ error }) => {
        toast.error(
          error.serverError ?? "Error al restablecer la configuración",
        );
      },
    },
  );

  const onSubmit = (data: UpdateConfigurationSchema) => {
    execute(data);
  };

  const resetToDefaults = () => {
    executeReset({ configurationId: configuration.id });
    setLogoPreview(null);
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = [
      "image/png",
      "image/jpeg",
      "image/jpg",
      "image/svg+xml",
      "image/webp",
    ];
    if (!validTypes.includes(file.type)) {
      toast.error("Tipo de archivo no válido. Use PNG, JPG, SVG o WEBP");
      e.target.value = "";
      return;
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast.error("El archivo es demasiado grande. Tamaño máximo: 5MB");
      e.target.value = "";
      return;
    }

    setIsUploadingLogo(true);

    try {
      const presignedResult = await getLogoPresignedUrlAction({
        fileName: file.name,
        contentType: file.type,
      });

      if (presignedResult?.serverError || !presignedResult?.data?.uploadUrl) {
        throw new Error(
          presignedResult?.serverError ?? "Error al obtener la URL de carga",
        );
      }

      const uploadResponse = await fetch(presignedResult.data.uploadUrl, {
        method: "PUT",
        body: file,
        headers: { "Content-Type": file.type },
      });

      if (!uploadResponse.ok) {
        throw new Error("Error al subir el logo");
      }

      form.setValue("logoUrl", presignedResult.data.s3Url);
      setLogoPreview(presignedResult.data.s3Url);
      toast.success("Logo subido exitosamente");
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Error al subir el logo",
      );
      setLogoPreview(configuration.logoUrl);
    } finally {
      setIsUploadingLogo(false);
      e.target.value = "";
    }
  };

  const handleRemoveLogo = async () => {
    const currentLogoUrl = form.getValues("logoUrl") ?? configuration.logoUrl;

    if (!currentLogoUrl) {
      // No logo to delete, just clear the form
      setLogoPreview(null);
      form.setValue("logoUrl", undefined);
      return;
    }

    setIsDeletingLogo(true);

    try {
      const deleteResult = await deleteLogoAction({
        logoUrl: currentLogoUrl,
      });

      if (deleteResult?.serverError) {
        throw new Error(
          deleteResult.serverError ?? "Error al eliminar el logo",
        );
      }

      setLogoPreview(null);
      form.setValue("logoUrl", undefined);
      toast.success("Logo eliminado exitosamente");
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Error al eliminar el logo",
      );
      console.error(error);
    } finally {
      setIsDeletingLogo(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Branding Section */}
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold">Marca</h2>
            <p className="text-muted-foreground text-sm">
              Personaliza la identidad de tu clínica
            </p>
          </div>

          <FormField
            control={form.control}
            name="portalTitle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Título del Portal</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Portal de Clínica"
                    {...field}
                    value={field.value ?? ""}
                  />
                </FormControl>
                <FormDescription>
                  Este título aparecerá en la pestaña del navegador
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="logoUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Logo de la Clínica</FormLabel>
                <FormControl>
                  <div className="space-y-4">
                    {(logoPreview ?? field.value) && (
                      <div className="relative inline-block">
                        <div className="bg-muted relative size-32 overflow-hidden rounded-lg border-2 border-dashed">
                          {isUploadingLogo ? (
                            <div className="flex size-full items-center justify-center">
                              <div className="text-muted-foreground text-sm">
                                Subiendo...
                              </div>
                            </div>
                          ) : (
                            <Image
                              src={logoPreview ?? field.value ?? ""}
                              alt="Logo preview"
                              fill
                              className="object-contain"
                            />
                          )}
                        </div>
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute -top-2 -right-2 size-6 rounded-full"
                          onClick={handleRemoveLogo}
                          disabled={isDeletingLogo || isUploadingLogo}
                        >
                          {isDeletingLogo ? (
                            <div className="size-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
                          ) : (
                            <X className="size-3" />
                          )}
                        </Button>
                      </div>
                    )}
                    <Input
                      type="file"
                      accept="image/png,image/jpeg,image/jpg,image/svg+xml,image/webp"
                      onChange={handleFileSelect}
                      disabled={isUploadingLogo || isDeletingLogo}
                      className="cursor-pointer"
                    />
                  </div>
                </FormControl>
                <FormDescription>
                  Sube un logo para mostrar en la barra lateral. Formatos
                  aceptados: PNG, JPG, SVG, WEBP (máx. 5MB)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Sidebar Colors Section */}
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold">Barra Lateral</h2>
            <p className="text-muted-foreground text-sm">
              Colores de la barra de navegación lateral
            </p>
          </div>

          <FormField
            control={form.control}
            name="sidebarBackgroundColor"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Color de Fondo</FormLabel>
                <FormControl>
                  <ColorInput
                    value={field.value ?? ""}
                    onValueChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="sidebarTextColor"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Color de Texto</FormLabel>
                <FormControl>
                  <ColorInput
                    value={field.value ?? ""}
                    onValueChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Page Background Section */}
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold">Fondo de Página</h2>
            <p className="text-muted-foreground text-sm">
              Color de fondo principal de las páginas
            </p>
          </div>

          <FormField
            control={form.control}
            name="backgroundColor"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Color de Fondo</FormLabel>
                <FormControl>
                  <ColorInput
                    value={field.value ?? ""}
                    onValueChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Card Colors Section */}
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold">Tarjetas</h2>
            <p className="text-muted-foreground text-sm">
              Colores de las tarjetas de contenido
            </p>
          </div>

          <FormField
            control={form.control}
            name="cardBackgroundColor"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Color de Fondo</FormLabel>
                <FormControl>
                  <ColorInput
                    value={field.value ?? ""}
                    onValueChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="cardTextColor"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Color de Texto</FormLabel>
                <FormControl>
                  <ColorInput
                    value={field.value ?? ""}
                    onValueChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Icon Colors Section */}
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold">Iconos</h2>
            <p className="text-muted-foreground text-sm">
              Colores de los iconos y elementos destacados
            </p>
          </div>

          <FormField
            control={form.control}
            name="iconBackgroundColor"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Color de Fondo</FormLabel>
                <FormControl>
                  <ColorInput
                    value={field.value ?? ""}
                    onValueChange={field.onChange}
                  />
                </FormControl>
                <FormDescription>
                  También se usa para la ruta seleccionada en la barra lateral
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="iconTextColor"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Color de Texto</FormLabel>
                <FormControl>
                  <ColorInput
                    value={field.value ?? ""}
                    onValueChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button type="submit" disabled={isExecuting || isResetting}>
            {isExecuting ? "Guardando..." : "Guardar Cambios"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={resetToDefaults}
            disabled={isExecuting || isResetting}
          >
            <RotateCcw className="mr-2 size-4" />
            {isResetting ? "Restableciendo..." : "Restaurar Predeterminados"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
