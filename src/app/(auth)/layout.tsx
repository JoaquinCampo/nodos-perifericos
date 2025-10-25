import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Iniciar sesión - Portal de clínica",
  description: "Inicia sesión para acceder a tu cuenta",
};

export default function PublicLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}
