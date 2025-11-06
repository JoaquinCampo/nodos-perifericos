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
  ClinicalDocuments: "/profesionales-de-salud/documentos-clinicos",
} as const;

export type AuthenticatedPath = keyof typeof AuthenticatedPaths;

export const AdminPaths = {
  Configuration: "/configuracion",
} as const;

export type AdminPath = keyof typeof AdminPaths;

export const Paths = {
  ...PublicPaths,
  ...AuthenticatedPaths,
  ...AdminPaths,
} as const;

export type Path = keyof typeof Paths;
