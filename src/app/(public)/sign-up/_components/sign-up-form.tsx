"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { type Clinic } from "@prisma/client";
import {
  Building2,
  Mail,
  KeyRound,
  Loader2,
  ShieldCheck,
  ArrowLeft,
} from "lucide-react";
import { z } from "zod";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter } from "next/navigation";

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
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "~/components/ui/input-otp";
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
import {
  sendVerificationEmailAction,
  signUpAction,
} from "~/server/actions/auth";

const emailStepSchema = z.object({
  clinicId: z.string().min(1, "Debes seleccionar una clínica"),
  email: z.string().email("El email no es válido"),
});

const verificationStepSchema = z
  .object({
    verificationCode: z
      .string()
      .length(6, "El código debe tener 6 dígitos")
      .regex(/^\d+$/, "El código debe contener solo números"),
    password: z
      .string()
      .min(8, "La contraseña debe tener al menos 8 caracteres"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

type EmailStepValues = z.infer<typeof emailStepSchema>;
type VerificationStepValues = z.infer<typeof verificationStepSchema>;

interface SignUpFormProps {
  clinics: Clinic[];
}

export function SignUpForm({ clinics }: SignUpFormProps) {
  const router = useRouter();
  const [step, setStep] = useState<"email" | "verification">("email");
  const [emailData, setEmailData] = useState<EmailStepValues | null>(null);
  const [verificationToken, setVerificationToken] = useState<string>("");

  const emailForm = useForm<EmailStepValues>({
    resolver: zodResolver(emailStepSchema),
    defaultValues: {
      clinicId: "",
      email: "",
    },
  });

  const verificationForm = useForm<VerificationStepValues>({
    resolver: zodResolver(verificationStepSchema),
    defaultValues: {
      verificationCode: "",
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
          setStep("verification");
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

  const { execute: completeSignUp, isExecuting: isCompletingSignUp } =
    useAction(signUpAction, {
      onSuccess: () => {
        toast.success(
          "¡Registro completado! Redirigiendo al inicio de sesión...",
        );
        setTimeout(() => {
          router.push("/sign-in");
        }, 1500);
      },
      onError: ({ error }: { error: { serverError?: string } }) => {
        toast.error(error.serverError ?? "Error al completar el registro");
      },
    });

  const onEmailSubmit = (data: EmailStepValues) => {
    setEmailData(data);
    sendEmail(data);
  };

  const onVerificationSubmit = (data: VerificationStepValues) => {
    if (!emailData) return;

    completeSignUp({
      email: emailData.email,
      password: data.password,
      verificationCode: data.verificationCode,
      token: verificationToken,
    });
  };

  const handleBackToEmail = () => {
    setStep("email");
    verificationForm.reset();
  };

  if (step === "verification") {
    return (
      <Card className="border-slate-200 shadow-xl dark:border-slate-800">
        <Form {...verificationForm}>
          <form onSubmit={verificationForm.handleSubmit(onVerificationSubmit)}>
            <CardHeader className="mb-6">
              <div className="mb-4 flex items-center justify-center">
                <div className="rounded-full bg-blue-100 p-3 dark:bg-blue-900">
                  <ShieldCheck className="size-8 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <CardTitle className="text-center text-2xl">
                Verificación de Email
              </CardTitle>
              <CardDescription className="text-center">
                Ingresa el código de 6 dígitos enviado a{" "}
                <span className="font-semibold">{emailData?.email}</span>
              </CardDescription>
            </CardHeader>
            <CardContent className="mb-6 space-y-6">
              <FormField
                control={verificationForm.control}
                name="verificationCode"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="flex items-center gap-2">
                      <ShieldCheck className="size-4" />
                      Código de Verificación
                    </FormLabel>
                    <FormControl>
                      <div className="flex justify-center">
                        <InputOTP
                          maxLength={6}
                          disabled={isCompletingSignUp}
                          value={field.value}
                          onChange={field.onChange}
                        >
                          <InputOTPGroup>
                            <InputOTPSlot index={0} />
                            <InputOTPSlot index={1} />
                            <InputOTPSlot index={2} />
                            <InputOTPSlot index={3} />
                            <InputOTPSlot index={4} />
                            <InputOTPSlot index={5} />
                          </InputOTPGroup>
                        </InputOTP>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={verificationForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="flex items-center gap-2">
                      <KeyRound className="size-4" />
                      Nueva Contraseña
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        disabled={isCompletingSignUp}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={verificationForm.control}
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
                        disabled={isCompletingSignUp}
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
                disabled={isCompletingSignUp}
              >
                {isCompletingSignUp ? (
                  <>
                    <Loader2 className="animate-spin" />
                    Completando registro...
                  </>
                ) : (
                  "Completar Registro"
                )}
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="w-full"
                onClick={handleBackToEmail}
                disabled={isCompletingSignUp}
              >
                <ArrowLeft className="size-4" />
                Volver
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    );
  }

  return (
    <Card className="border-slate-200 shadow-xl dark:border-slate-800">
      <Form {...emailForm}>
        <form onSubmit={emailForm.handleSubmit(onEmailSubmit)}>
          <CardHeader className="mb-6">
            <CardTitle className="text-2xl">Crear Cuenta</CardTitle>
            <CardDescription>
              Ingresa tu email y selecciona tu clínica para comenzar
            </CardDescription>
          </CardHeader>
          <CardContent className="mb-6 space-y-6">
            <FormField
              control={emailForm.control}
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
              control={emailForm.control}
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
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full" disabled={isSendingEmail}>
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
  );
}
