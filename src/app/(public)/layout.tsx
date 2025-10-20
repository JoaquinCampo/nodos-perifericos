import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In - Clinic Portal",
  description: "Sign in to your account to continue",
};

export default function PublicLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}
