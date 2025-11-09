import { redirect } from "next/navigation";
import type {
  Path,
  PublicPath,
  AdminPath,
  AuthenticatedPath,
  HealthWorkerPath,
} from "~/lib/constants/paths";
import {
  Paths,
  AdminPaths,
  AuthenticatedPaths,
  PublicPaths,
  HealthWorkerPaths,
} from "~/lib/constants/paths";
import { auth } from "~/server/auth";
import { type Session } from "next-auth";

export function isPublicPath(path: Path): path is PublicPath {
  return path in PublicPaths;
}

export function isAdminPath(path: Path): path is AdminPath {
  return path in AdminPaths;
}

export function isAuthenticatedPath(path: Path): path is AuthenticatedPath {
  return path in AuthenticatedPaths;
}

export function isHealthWorkerPath(path: Path): path is HealthWorkerPath {
  return path in HealthWorkerPaths;
}

type AuthGuardResult<T extends Path> = T extends PublicPath ? null : Session;

export async function authGuard<T extends Path>(
  path: T,
): Promise<AuthGuardResult<T>> {
  const session = await auth();

  const isUnauthenticated = !session;
  const isClinicAdmin = session?.user?.clinicAdmin;
  const isHealthWorker = session?.user?.healthWorker;

  if (isUnauthenticated) {
    if (isPublicPath(path)) {
      return null as AuthGuardResult<T>;
    }

    redirect(Paths.SignIn);
  }

  if (isHealthWorker) {
    if (isAuthenticatedPath(path) || isHealthWorkerPath(path)) {
      return session as AuthGuardResult<T>;
    }

    redirect(Paths.Dashboard);
  }

  if (isClinicAdmin) {
    if (isAdminPath(path) || isAuthenticatedPath(path)) {
      return session as AuthGuardResult<T>;
    }

    redirect(Paths.Dashboard);
  }

  return null as AuthGuardResult<T>;
}
