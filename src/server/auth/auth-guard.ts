import { redirect } from "next/navigation";
import type {
  Path,
  PublicPath,
  AdminPath,
  UserPath,
} from "~/lib/constants/paths";
import { AdminPaths, PublicPaths, UserPaths } from "~/lib/constants/paths";
import { auth } from "~/server/auth";
import { type Session } from "next-auth";

export function isPublicPath(path: Path): path is PublicPath {
  return path in PublicPaths;
}

export function isAdminPath(path: Path): path is AdminPath {
  return path in AdminPaths;
}

export function isUserPath(path: Path): path is UserPath {
  return path in UserPaths;
}

type AuthGuardResult<T extends Path> = T extends PublicPath ? null : Session;

export async function authGuard<T extends Path>(
  path: T,
): Promise<AuthGuardResult<T>> {
  const session = await auth();

  const isUnauthenticated = !session;
  const isAdmin = session?.user?.clinicAdmin;
  const isUser = session?.user?.healthWorker;

  if (isUnauthenticated) {
    if (isPublicPath(path)) {
      return null as AuthGuardResult<T>;
    }

    redirect(PublicPaths.SignIn);
  }

  if (isAdmin) {
    if (isAdminPath(path)) {
      return session as AuthGuardResult<T>;
    }

    redirect(AdminPaths.AdminDashboard);
  }

  if (isUser) {
    if (isUserPath(path)) {
      return session as AuthGuardResult<T>;
    }

    redirect(UserPaths.Dashboard);
  }

  redirect(UserPaths.Dashboard);
}
