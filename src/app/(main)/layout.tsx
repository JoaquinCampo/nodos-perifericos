import type { Metadata } from "next";
import { MainSidebar } from "./_components/main-sidebar";
import { auth } from "~/server/auth";
import { redirect } from "next/navigation";
import { PublicPaths } from "~/lib/constants/paths";

export const metadata: Metadata = {
  title: "Portal de clínica",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect(PublicPaths.SignIn);
  }

  // Extract only serializable data from session
  const sidebarData = {
    clinicName: session.user.clinic.name,
    isClinicAdmin: !!session.user.clinicAdmin,
  };

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950">
      <MainSidebar {...sidebarData} />
      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto p-8">{children}</div>
      </main>
    </div>
  );
}
