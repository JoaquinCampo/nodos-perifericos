"use client";

import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import { Button } from "~/components/ui/button";

export function SignOutButton() {
  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/sign-in" });
  };

  return (
    <Button
      variant="ghost"
      className="w-full justify-center gap-3"
      onClick={handleSignOut}
    >
      <LogOut className="size-5" />
      <span className="font-medium">Cerrar Sesión</span>
    </Button>
  );
}
