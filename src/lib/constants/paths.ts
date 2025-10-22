export const PublicPaths = {
  SignIn: "/sign-in",
  SignUp: "/sign-up",
} as const;

export type PublicPath = keyof typeof PublicPaths;

export const AdminPaths = {
  Dashboard: "/admin",
  HealthUsers: "/admin/usuarios-de-salud",
  HealthProfessionals: "/admin/profesionales-de-salud",
  Administrators: "/admin/administradores",
  Configuration: "/admin/configuracion",
} as const;

export type AdminPath = keyof typeof AdminPaths;

export const UserPaths = {
  Dashboard: "/",
} as const;

export type UserPath = keyof typeof UserPaths;

export const Paths = {
  ...PublicPaths,
  ...AdminPaths,
  ...UserPaths,
} as const;

export type Path = keyof typeof Paths;
