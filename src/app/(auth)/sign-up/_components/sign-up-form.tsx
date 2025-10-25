"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { type Clinic } from "@prisma/client";
import { Building2, Mail, KeyRound, Loader2 } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";
import Link from "next/link";

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
import { sendVerificationEmailAction } from "~/server/actions/auth";
import { signUpFormSchema, type SignUpFormValues } from "./schemas";
import { VerificationDialog } from "./verification-dialog";

interface SignUpFormProps {
  clinics: Clinic[];
}

export function SignUpForm({ clinics }: SignUpFormProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState<SignUpFormValues | null>(null);
  const [verificationToken, setVerificationToken] = useState<string>("");

  const signUpForm = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: {
      clinicId: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const { execute: sendEmail, isExecuting: isSendingEmail } = useAction(
    sendVerificationEmailAction,
    {
      onSuccess: ({
        data,
      }: {
        data?: { token?: string; message?: string };
      }) => {
        if (data && "token" in data && typeof data.token === "string") {
          setVerificationToken(data.token);
          setIsDialogOpen(true);
          toast.success("Código de verificación enviado a tu email");
        }
      },
      onError: ({ error }: { error: { serverError?: string } }) => {
        toast.error(
          error.serverError ?? "Error al enviar el código de verificación",
        );
      },
    },
  );

  const onFormSubmit = (data: SignUpFormValues) => {
    setFormData(data);
    sendEmail({
      clinicId: data.clinicId,
      email: data.email,
    });
  };

  return (
    <>
      <Card className="border-slate-200 shadow-xl dark:border-slate-800">
        <Form {...signUpForm}>
          <form onSubmit={signUpForm.handleSubmit(onFormSubmit)}>
            <CardHeader className="mb-6">
              <CardTitle className="text-2xl">Crear Cuenta</CardTitle>
              <CardDescription>
                Completa los datos para crear tu cuenta
              </CardDescription>
            </CardHeader>
            <CardContent className="mb-6 space-y-6">
              <FormField
                control={signUpForm.control}
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
                      disabled={isSendingEmail}
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
                control={signUpForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="flex items-center gap-2">
                      <Mail className="size-4" />
                      Email
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="tu@email.com"
                        autoComplete="email"
                        disabled={isSendingEmail}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={signUpForm.control}
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
                        autoComplete="new-password"
                        disabled={isSendingEmail}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={signUpForm.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="flex items-center gap-2">
                      <KeyRound className="size-4" />
                      Confirmar Contraseña
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        autoComplete="new-password"
                        disabled={isSendingEmail}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button
                type="submit"
                className="w-full"
                disabled={isSendingEmail}
              >
                {isSendingEmail ? (
                  <>
                    <Loader2 className="animate-spin" />
                    Enviando código...
                  </>
                ) : (
                  "Enviar Código de Verificación"
                )}
              </Button>
              <p className="text-center text-xs text-slate-500 dark:text-slate-400">
                ¿Ya tienes una cuenta?{" "}
                <Link
                  href="/sign-in"
                  className="font-medium text-slate-900 hover:underline dark:text-slate-50"
                >
                  Inicia sesión
                </Link>
              </p>
            </CardFooter>
          </form>
        </Form>
      </Card>

      <VerificationDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        email={formData?.email ?? ""}
        formData={formData}
        verificationToken={verificationToken}
      />
    </>
  );
}
