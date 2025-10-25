"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";
import { Plus, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import {
  createHealthWorkerSchema,
  type CreateHealthWorkerSchema,
} from "~/server/schemas/health-worker";
import { createHealthWorkerAction } from "~/server/actions/health-worker";
import { DateTimePicker } from "~/components/ui/date";

interface CreateHealthWorkerButtonProps {
  clinicId: string;
}

export function CreateHealthWorkerButton({
  clinicId,
}: CreateHealthWorkerButtonProps) {
  const [open, setOpen] = useState(false);
  const [specialityInput, setSpecialityInput] = useState("");

  const form = useForm({
    resolver: zodResolver(createHealthWorkerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      ci: "",
      email: "",
      phone: "",
      address: "",
      dateOfBirth: undefined,
      clinicId,
      specialities: [] as string[],
    },
  });

  const { execute, isExecuting } = useAction(createHealthWorkerAction, {
    onSuccess: () => {
      toast.success("Profesional de salud creado exitosamente");
      form.reset();
      setSpecialityInput("");
      setOpen(false);
    },
    onError: ({ error }) => {
      toast.error(
        error.serverError ?? "Error al crear el profesional de salud",
      );
    },
  });

  const onSubmit = (data: CreateHealthWorkerSchema) => {
    execute(data);
  };

  const addSpeciality = () => {
    if (specialityInput.trim()) {
      const currentSpecialities = form.getValues("specialities") ?? [];
      if (!currentSpecialities.includes(specialityInput.trim())) {
        form.setValue("specialities", [
          ...currentSpecialities,
          specialityInput.trim(),
        ]);
      }
      setSpecialityInput("");
    }
  };

  const removeSpeciality = (speciality: string) => {
    const currentSpecialities = form.getValues("specialities") ?? [];
    form.setValue(
      "specialities",
      currentSpecialities.filter((s) => s !== speciality),
    );
  };

  const specialities = form.watch("specialities") ?? [];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 size-4" />
          Crear Profesional de Salud
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Crear Profesional de Salud</DialogTitle>
          <DialogDescription>
            Completa los datos para crear un nuevo profesional de salud.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input placeholder="Juan" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Apellido</FormLabel>
                  <FormControl>
                    <Input placeholder="Pérez" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="ci"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CI</FormLabel>
                  <FormControl>
                    <Input placeholder="12345678" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="juan@ejemplo.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Teléfono (opcional)</FormLabel>
                  <FormControl>
                    <Input placeholder="+59899123456" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dirección (opcional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Av. 18 de Julio 1234" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dateOfBirth"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fecha de Nacimiento (opcional)</FormLabel>
                  <FormControl>
                    <DateTimePicker
                      value={field.value}
                      onChange={field.onChange}
                      granularity="day"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="space-y-2">
              <FormLabel>Especialidades (opcional)</FormLabel>
              <div className="flex gap-2">
                <Input
                  placeholder="Ej: Cardiología"
                  value={specialityInput}
                  onChange={(e) => setSpecialityInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addSpeciality();
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={addSpeciality}
                  disabled={!specialityInput.trim()}
                >
                  Agregar
                </Button>
              </div>
              {specialities.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {specialities.map((spec, idx) => (
                    <span
                      key={idx}
                      className="bg-primary/10 text-primary flex items-center gap-1 rounded-md px-2 py-1 text-sm capitalize"
                    >
                      {spec}
                      <button
                        type="button"
                        onClick={() => removeSpeciality(spec)}
                        className="hover:bg-primary/20 rounded-full p-0.5"
                      >
                        <X className="size-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isExecuting}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isExecuting}>
                {isExecuting ? "Creando..." : "Crear"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
