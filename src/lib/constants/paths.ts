export const PublicPaths = {
  SignIn: "/sign-in",
  SignUp: "/sign-up",
} as const;

export type PublicPath = keyof typeof PublicPaths;

export const AuthenticatedPaths = {
  Dashboard: "/",
  ClinicAdmins: "/administradores",
  HealthWorkers: "/profesionales-de-salud",
  HealthUsers: "/usuarios-de-salud",
} as const;

export type AuthenticatedPath = keyof typeof AuthenticatedPaths;

export const HealthWorkerPaths = {
  ClinicalHistory: (healthUserCi: string) =>
    `/usuarios-de-salud/${healthUserCi}`,
} as const;

export type HealthWorkerPath = keyof typeof HealthWorkerPaths;

export const AdminPaths = {
  Configuration: "/configuracion",
} as const;

export type AdminPath = keyof typeof AdminPaths;

export const Paths = {
  ...PublicPaths,
  ...AuthenticatedPaths,
  ...AdminPaths,
  ...HealthWorkerPaths,
} as const;

export type Path = keyof typeof Paths;
