"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, ShieldCheck } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";

import { Button } from "~/components/ui/button";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { signUpAction } from "~/server/actions/auth";
import { otpSchema, type OTPValues, type SignUpFormValues } from "./schemas";

interface VerificationDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  email: string;
  formData: SignUpFormValues | null;
  verificationToken: string;
}

export function VerificationDialog({
  isOpen,
  onOpenChange,
  email,
  formData,
  verificationToken,
}: VerificationDialogProps) {
  const otpForm = useForm<OTPValues>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      verificationCode: "",
    },
  });

  const { execute: completeSignUp, isExecuting: isCompletingSignUp } =
    useAction(signUpAction, {
      onSuccess: () => {
        toast.success("¡Registro completado! Iniciando sesión...");
        onOpenChange(false);
      },
      onError: ({ error }: { error: { serverError?: string } }) => {
        toast.error(error.serverError ?? "Error al completar el registro");
      },
    });

  const onOTPSubmit = (data: OTPValues) => {
    if (!formData) return;

    completeSignUp({
      email: formData.email,
      password: formData.password,
      verificationCode: data.verificationCode,
      token: verificationToken,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <div className="mb-4 flex items-center justify-center">
            <div className="rounded-full bg-blue-100 p-3 dark:bg-blue-900">
              <ShieldCheck className="size-8 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <DialogTitle className="text-center text-2xl">
            Verificación de Email
          </DialogTitle>
          <DialogDescription className="text-center">
            Ingresa el código de 6 dígitos enviado a{" "}
            <span className="font-semibold">{email}</span>
          </DialogDescription>
        </DialogHeader>
        <Form {...otpForm}>
          <form
            onSubmit={otpForm.handleSubmit(onOTPSubmit)}
            className="space-y-6"
          >
            <FormField
              control={otpForm.control}
              name="verificationCode"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="flex items-center justify-center gap-2">
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
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
