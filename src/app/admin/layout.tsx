import type { Metadata } from "next";
import { AdminSidebar } from "~/components/admin-sidebar";

export const metadata: Metadata = {
  title: "Administradores - Portal de clínica",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto p-8">{children}</div>
      </main>
    </div>
  );
}
