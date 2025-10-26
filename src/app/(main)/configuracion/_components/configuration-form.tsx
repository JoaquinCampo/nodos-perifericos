"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";
import { RotateCcw } from "lucide-react";
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
import type { Configuration } from "@prisma/client";

interface ConfigurationFormProps {
  configuration: Configuration;
}

export function ConfigurationForm({ configuration }: ConfigurationFormProps) {
  const form = useForm<UpdateConfigurationSchema>({
    resolver: zodResolver(updateConfigurationSchema),
    defaultValues: {
      configurationId: configuration.id,
      portalTitle: configuration.portalTitle,
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
