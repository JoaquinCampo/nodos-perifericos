import { SignInForm } from "./_components/sign-in-form";
import { authGuard } from "~/server/auth/auth-guard";
import { findAllClinics } from "~/server/controllers/clinic";

export default async function SignInPage() {
  await authGuard("SignIn");

  const clinics = await findAllClinics();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-4 py-12 dark:from-slate-950 dark:to-slate-900">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
            Bienvenido
          </h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Inicia sesión para acceder a tu cuenta
          </p>
        </div>
        <SignInForm clinics={clinics} />
      </div>
    </div>
  );
}
