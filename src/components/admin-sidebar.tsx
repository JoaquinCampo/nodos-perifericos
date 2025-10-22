"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Users, Stethoscope, Shield, Settings, LogOut } from "lucide-react";
import { cn } from "~/lib/utils";
import { AdminPaths } from "~/lib/constants/paths";
import { Button } from "~/components/ui/button";
import { signOut } from "next-auth/react";

const menuItems = [
  {
    label: "Usuarios de Salud",
    path: AdminPaths.HealthUsers,
    icon: Users,
  },
  {
    label: "Profesionales de Salud",
    path: AdminPaths.HealthProfessionals,
    icon: Stethoscope,
  },
  {
    label: "Administradores",
    path: AdminPaths.Administrators,
    icon: Shield,
  },
];

export function AdminSidebar() {
  const pathname = usePathname();

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/sign-in" });
  };

  return (
    <aside className="flex h-screen w-72 flex-col border-r bg-gradient-to-b from-slate-50 to-slate-100/50 dark:from-slate-950 dark:to-slate-900/50">
      {/* Header */}
      <div className="flex h-20 items-center border-b bg-white/50 px-6 backdrop-blur-sm dark:bg-slate-950/50">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg shadow-blue-500/30">
            <Shield className="size-5 text-white" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Panel Admin
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Gestión de clínica
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4">
        <div className="mb-3">
          <p className="mb-2 px-3 text-xs font-semibold tracking-wider text-slate-500 uppercase dark:text-slate-400">
            Gestión
          </p>
          <div className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.path;

              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={cn(
                    "group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30"
                      : "text-slate-700 hover:bg-white hover:shadow-md dark:text-slate-300 dark:hover:bg-slate-800/50",
                  )}
                >
                  <Icon
                    className={cn(
                      "size-5 transition-transform duration-200 group-hover:scale-110",
                      isActive
                        ? "text-white"
                        : "text-slate-500 dark:text-slate-400",
                    )}
                  />
                  <span className="flex-1">{item.label}</span>
                  {isActive && (
                    <div className="size-2 rounded-full bg-white/80" />
                  )}
                </Link>
              );
            })}
          </div>
        </div>

        <div className="pt-4">
          <p className="mb-2 px-3 text-xs font-semibold tracking-wider text-slate-500 uppercase dark:text-slate-400">
            Sistema
          </p>
          <Link
            href={AdminPaths.Configuration}
            className={cn(
              "group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200",
              pathname === AdminPaths.Configuration
                ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30"
                : "text-slate-700 hover:bg-white hover:shadow-md dark:text-slate-300 dark:hover:bg-slate-800/50",
            )}
          >
            <Settings
              className={cn(
                "size-5 transition-transform duration-200 group-hover:scale-110",
                pathname === AdminPaths.Configuration
                  ? "text-white"
                  : "text-slate-500 dark:text-slate-400",
              )}
            />
            <span className="flex-1">Configuración</span>
            {pathname === AdminPaths.Configuration && (
              <div className="size-2 rounded-full bg-white/80" />
            )}
          </Link>
        </div>
      </nav>

      {/* Footer */}
      <div className="border-t bg-white/50 p-4 backdrop-blur-sm dark:bg-slate-950/50">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 rounded-xl px-4 py-3 text-slate-700 transition-all duration-200 hover:bg-red-50 hover:text-red-600 hover:shadow-md dark:text-slate-300 dark:hover:bg-red-950/30 dark:hover:text-red-400"
          onClick={handleSignOut}
        >
          <LogOut className="size-5" />
          <span className="font-medium">Cerrar Sesión</span>
        </Button>
      </div>
    </aside>
  );
}
