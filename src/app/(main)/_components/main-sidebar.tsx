"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Users,
  Stethoscope,
  Shield,
  Home,
  Settings,
  Hospital,
} from "lucide-react";
import { AuthenticatedPaths, AdminPaths } from "~/lib/constants/paths";
import { SignOutButton } from "./sign-out-button";

const menuItems = [
  {
    label: "Inicio",
    path: AuthenticatedPaths.Dashboard,
    icon: Home,
  },
  {
    label: "Usuarios de Salud",
    path: AuthenticatedPaths.HealthUsers,
    icon: Users,
  },
  {
    label: "Profesionales de Salud",
    path: AuthenticatedPaths.HealthWorkers,
    icon: Stethoscope,
  },
  {
    label: "Administradores",
    path: AuthenticatedPaths.ClinicAdmins,
    icon: Shield,
    clinicAdminOnly: true,
  },
];

interface MainSidebarProps {
  clinicName: string;
  isClinicAdmin: boolean;
  configuration: {
    sidebarTextColor: string;
    sidebarBackgroundColor: string;
    iconBackgroundColor: string;
    iconTextColor: string;
  };
}

export function MainSidebar({
  clinicName,
  isClinicAdmin,
  configuration,
}: MainSidebarProps) {
  const pathname = usePathname();

  const visibleMenuItems = menuItems.filter(
    (item) => !item.clinicAdminOnly || isClinicAdmin,
  );

  return (
    <aside
      className="flex h-screen w-72 flex-col border-r"
      style={{ backgroundColor: configuration.sidebarBackgroundColor }}
    >
      {/* Header */}
      <div
        className="flex h-20 items-center border-b px-6"
        style={{
          backgroundColor: `${configuration.sidebarBackgroundColor}dd`,
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="flex size-10 items-center justify-center rounded-lg shadow-lg"
            style={{
              backgroundColor: configuration.iconBackgroundColor,
              boxShadow: `0 10px 15px -3px ${configuration.iconBackgroundColor}30`,
            }}
          >
            <Hospital
              className="size-5"
              style={{ color: configuration.iconTextColor }}
            />
          </div>
          <div>
            <h2
              className="text-sm font-bold"
              style={{ color: configuration.sidebarTextColor }}
            >
              Portal de Clínica
            </h2>
            <p
              className="text-xs opacity-60"
              style={{ color: configuration.sidebarTextColor }}
            >
              {clinicName}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4">
        <div className="mb-3">
          <p
            className="mb-2 px-3 text-xs font-semibold tracking-wider uppercase opacity-60"
            style={{ color: configuration.sidebarTextColor }}
          >
            Gestión
          </p>
          <div className="space-y-1">
            {visibleMenuItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.path === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.path);

              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className="group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 hover:shadow-md"
                  style={
                    isActive
                      ? {
                          background: `linear-gradient(to right, ${configuration.iconBackgroundColor}, ${configuration.iconBackgroundColor}dd)`,
                          color: configuration.iconTextColor,
                          boxShadow: `0 10px 15px -3px ${configuration.iconBackgroundColor}30`,
                        }
                      : {
                          color: configuration.sidebarTextColor,
                        }
                  }
                >
                  <Icon
                    className="size-5 transition-transform duration-200 group-hover:scale-110"
                    style={{
                      color: isActive
                        ? configuration.iconTextColor
                        : `${configuration.sidebarTextColor}99`,
                    }}
                  />
                  <span className="flex-1">{item.label}</span>
                  {isActive && (
                    <div
                      className="size-2 rounded-full opacity-80"
                      style={{ backgroundColor: configuration.iconTextColor }}
                    />
                  )}
                </Link>
              );
            })}
          </div>
        </div>

        {isClinicAdmin && (
          <div className="pt-4">
            <p
              className="mb-2 px-3 text-xs font-semibold tracking-wider uppercase opacity-60"
              style={{ color: configuration.sidebarTextColor }}
            >
              Sistema
            </p>
            <Link
              href={AdminPaths.Configuration}
              className="group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 hover:shadow-md"
              style={
                pathname.startsWith(AdminPaths.Configuration)
                  ? {
                      background: `linear-gradient(to right, ${configuration.iconBackgroundColor}, ${configuration.iconBackgroundColor}dd)`,
                      color: configuration.iconTextColor,
                      boxShadow: `0 10px 15px -3px ${configuration.iconBackgroundColor}30`,
                    }
                  : {
                      color: configuration.sidebarTextColor,
                    }
              }
            >
              <Settings
                className="size-5 transition-transform duration-200 group-hover:scale-110"
                style={{
                  color: pathname.startsWith(AdminPaths.Configuration)
                    ? configuration.iconTextColor
                    : `${configuration.sidebarTextColor}99`,
                }}
              />
              <span className="flex-1">Configuración</span>
              {pathname.startsWith(AdminPaths.Configuration) && (
                <div
                  className="size-2 rounded-full opacity-80"
                  style={{ backgroundColor: configuration.iconTextColor }}
                />
              )}
            </Link>
          </div>
        )}
      </nav>

      {/* Footer */}
      <div
        className="border-t p-4"
        style={{
          backgroundColor: `${configuration.sidebarBackgroundColor}dd`,
        }}
      >
        <SignOutButton />
      </div>
    </aside>
  );
}
