import type { Metadata } from "next";
import { MainSidebar } from "./_components/main-sidebar";
import { auth } from "~/server/auth";
import { redirect } from "next/navigation";
import { PublicPaths } from "~/lib/constants/paths";
import { DEFAULT_CONFIGURATION } from "~/lib/constants/configuration";

export async function generateMetadata(): Promise<Metadata> {
  const session = await auth();

  if (!session) {
    return {
      title: DEFAULT_CONFIGURATION.portalTitle,
      icons: [{ rel: "icon", url: "/favicon.ico" }],
    };
  }

  const config = session.user.clinic.configuration;

  return {
    title: config?.portalTitle ?? DEFAULT_CONFIGURATION.portalTitle,
    icons: [{ rel: "icon", url: "/favicon.ico" }],
  };
}

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect(PublicPaths.SignIn);
  }

  const config = session.user.clinic.configuration;

  const sidebarData = {
    clinicName: session.user.clinic.name,
    isClinicAdmin: !!session.user.clinicAdmin,
    configuration: {
      sidebarTextColor:
        config?.sidebarTextColor ?? DEFAULT_CONFIGURATION.sidebarTextColor,
      sidebarBackgroundColor:
        config?.sidebarBackgroundColor ??
        DEFAULT_CONFIGURATION.sidebarBackgroundColor,
      iconBackgroundColor:
        config?.iconBackgroundColor ??
        DEFAULT_CONFIGURATION.iconBackgroundColor,
      iconTextColor:
        config?.iconTextColor ?? DEFAULT_CONFIGURATION.iconTextColor,
    },
  };

  return (
    <div
      className="flex h-screen"
      style={{
        backgroundColor:
          config?.backgroundColor ?? DEFAULT_CONFIGURATION.backgroundColor,
      }}
    >
      <MainSidebar {...sidebarData} />
      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto p-8">{children}</div>
      </main>
    </div>
  );
}
