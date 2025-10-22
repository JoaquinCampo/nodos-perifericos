import { findAllClinics } from "~/server/controllers/clinic";
import { SignUpForm } from "./_components/sign-up-form";
import { authGuard } from "~/server/auth/auth-guard";

export default async function SignUpPage() {
  await authGuard("SignUp");

  const clinics = await findAllClinics();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-4 py-12 dark:from-slate-950 dark:to-slate-900">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
            Crear Cuenta
          </h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Regístrate para acceder a la plataforma
          </p>
        </div>
        <SignUpForm clinics={clinics} />
      </div>
    </div>
  );
}
