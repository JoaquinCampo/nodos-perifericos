"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { type Clinic } from "@prisma/client";
import { Building2, KeyRound, User, Loader2 } from "lucide-react";
import { z } from "zod";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";

import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { signInAction } from "~/server/actions/auth";

const signInSchema = z.object({
  clinicId: z.string().min(1, "Debes seleccionar una clínica"),
  ci: z.string().min(1, "La cédula es requerida"),
  password: z.string().min(1, "La contraseña es requerida"),
});

type SignInFormValues = z.infer<typeof signInSchema>;

interface SignInFormProps {
  clinics: Clinic[];
}

export function SignInForm({ clinics }: SignInFormProps) {
  const form = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      clinicId: "",
      ci: "",
      password: "",
    },
  });

  const { execute, isExecuting } = useAction(signInAction, {
    onError: ({ error }) => {
      toast.error(error.serverError ?? "Ocurrió un error al iniciar sesión");
    },
  });

  const onSubmit = (data: SignInFormValues) => {
    execute(data);
  };

  return (
    <Card className="border-slate-200 shadow-xl dark:border-slate-800">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardHeader className="mb-6">
            <CardTitle className="text-2xl">Iniciar Sesión</CardTitle>
            <CardDescription>
              Selecciona tu clínica e ingresa tus credenciales
            </CardDescription>
          </CardHeader>
          <CardContent className="mb-6 space-y-6">
            <FormField
              control={form.control}
              name="clinicId"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="flex items-center gap-2">
                    <Building2 className="size-4" />
                    Clínica
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={isExecuting}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecciona una clínica" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {clinics.length === 0 ? (
                        <div className="text-muted-foreground p-2 text-center text-sm">
                          No hay clínicas disponibles
                        </div>
                      ) : (
                        clinics.map((clinic) => (
                          <SelectItem key={clinic.id} value={clinic.id}>
                            {clinic.name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="ci"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="flex items-center gap-2">
                    <User className="size-4" />
                    Cédula de Identidad
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="12345678"
                      autoComplete="username"
                      disabled={isExecuting}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="flex items-center gap-2">
                    <KeyRound className="size-4" />
                    Contraseña
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      autoComplete="current-password"
                      disabled={isExecuting}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full" disabled={isExecuting}>
              {isExecuting ? (
                <>
                  <Loader2 className="animate-spin" />
                  Iniciando sesión...
                </>
              ) : (
                "Iniciar Sesión"
              )}
            </Button>
            <p className="text-center text-xs text-slate-500 dark:text-slate-400">
              ¿Olvidaste tu contraseña?{" "}
              <a
                href="#"
                className="font-medium text-slate-900 hover:underline dark:text-slate-50"
              >
                Contacta al administrador
              </a>
            </p>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
