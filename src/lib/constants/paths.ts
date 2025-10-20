export const PublicPaths = {
  SignIn: "/sign-in",
} as const;

export const AdminPaths = {
  Dashboard: "/admin",
} as const;

export const UserPaths = {
  Dashboard: "/professional",
} as const;

export const Paths = {
  ...PublicPaths,
  ...AdminPaths,
  ...UserPaths,
} as const;

export type PublicPath = (typeof PublicPaths)[keyof typeof PublicPaths];
export type AdminPath = (typeof AdminPaths)[keyof typeof AdminPaths];
export type UserPath = (typeof UserPaths)[keyof typeof UserPaths];
