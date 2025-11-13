"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { ChevronsUpDown, Loader2, Search, Check } from "lucide-react";
import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { ScrollArea } from "~/components/ui/scroll-area";

interface HealthUser {
  ci: string;
  firstName: string;
  lastName: string;
  email: string;
}

interface HealthUserSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const getInitials = (firstName: string, lastName: string) => {
  const first = firstName?.charAt(0) ?? "";
  const last = lastName?.charAt(0) ?? "";
  return `${first}${last}`.toUpperCase() || "?";
};

const formatUserLabel = (user: HealthUser) =>
  `${user.firstName} ${user.lastName} · CI ${user.ci}`.trim();

export function HealthUserSelector({
  value,
  onChange,
}: HealthUserSelectorProps) {
  const [open, setOpen] = useState(false);
  const [users, setUsers] = useState<HealthUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/health-users");
      if (!response.ok) {
        throw new Error("Error al cargar usuarios");
      }
      const data = (await response.json()) as HealthUser[];
      setUsers(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching health users:", err);
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchUsers();
  }, [fetchUsers]);

  const selectedUser = useMemo(
    () => users.find((user) => user.ci === value) ?? null,
    [users, value],
  );

  useEffect(() => {
    if (open) {
      setSearchTerm("");
    } else if (!open && selectedUser) {
      setSearchTerm("");
    }
  }, [open, selectedUser]);

  const filteredUsers = useMemo(() => {
    if (!searchTerm.trim()) return users;

    const normalized = searchTerm.toLowerCase();
    return users.filter((user) =>
      [user.firstName, user.lastName, user.ci, user.email]
        .join(" ")
        .toLowerCase()
        .includes(normalized),
    );
  }, [searchTerm, users]);

  const handleSelect = (user: HealthUser) => {
    onChange(user.ci);
    setOpen(false);
    setSearchTerm("");
  };

  const activeValue = open
    ? searchTerm
    : selectedUser
      ? formatUserLabel(selectedUser)
      : value || "";

  const placeholder = open
    ? "Buscar por nombre, correo o CI"
    : "Seleccionar usuario de salud…";

  if (error) {
    return (
      <div className="space-y-2">
        <div className="border-destructive/40 bg-destructive/5 text-destructive rounded-lg border p-3 text-sm">
          Error al cargar usuarios: {error}
        </div>
        <input
          type="text"
          placeholder="Ingrese CI manualmente…"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-11 w-full rounded-md border px-3 py-2 font-mono text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => void fetchUsers()}
        >
          Reintentar
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div
            aria-expanded={open}
            className={cn(
              "border-muted/40 bg-background flex w-full items-center gap-2 rounded-xl border px-3 py-2 shadow-sm transition",
              "focus-within:border-primary focus-within:ring-primary/20 focus-within:ring-2",
              "hover:border-muted-foreground/40",
            )}
          >
            <Search
              className="text-muted-foreground h-4 w-4"
              aria-hidden="true"
            />
            <input
              value={activeValue}
              onChange={(event) => {
                const next = event.target.value;
                if (!open) setOpen(true);
                setSearchTerm(next);
              }}
              onFocus={() => setOpen(true)}
              placeholder={placeholder}
              className="text-foreground placeholder:text-muted-foreground flex-1 bg-transparent text-sm outline-none"
            />
            <ChevronsUpDown
              className="text-muted-foreground h-4 w-4 shrink-0"
              aria-hidden="true"
            />
          </div>
        </PopoverTrigger>
        <PopoverContent
          align="start"
          sideOffset={8}
          className="border-border/60 bg-popover z-[60] w-[var(--radix-popover-trigger-width)] max-w-lg min-w-[20rem] rounded-2xl border p-0 shadow-2xl"
        >
          {loading ? (
            <div className="text-muted-foreground flex items-center justify-center gap-2 py-10 text-sm">
              <Loader2 className="h-4 w-4 animate-spin" />
              Cargando usuarios…
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-muted-foreground py-10 text-center text-sm">
              No se encontraron usuarios
            </div>
          ) : (
            <ScrollArea className="max-h-72">
              <ul className="space-y-1 p-3">
                {filteredUsers.map((user) => {
                  const isSelected = value === user.ci;
                  return (
                    <li key={user.ci}>
                      <button
                        type="button"
                        onClick={() => handleSelect(user)}
                        className={cn(
                          "flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm transition",
                          isSelected
                            ? "bg-primary/10 text-foreground"
                            : "hover:bg-muted/60",
                        )}
                      >
                        <span className="bg-muted text-muted-foreground inline-flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold">
                          {getInitials(user.firstName, user.lastName)}
                        </span>
                        <div className="flex min-w-0 flex-1 flex-col">
                          <span className="text-foreground text-sm font-semibold">
                            {user.firstName} {user.lastName}
                          </span>
                          <span className="text-muted-foreground text-xs">
                            CI {user.ci}
                          </span>
                          <span className="text-muted-foreground/80 truncate text-xs">
                            {user.email}
                          </span>
                        </div>
                        {isSelected ? (
                          <Check
                            className="text-primary h-4 w-4"
                            aria-hidden="true"
                          />
                        ) : null}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </ScrollArea>
          )}
        </PopoverContent>
      </Popover>
      <p className="text-muted-foreground text-xs">
        Seleccione un usuario de salud de la lista o busque por nombre, correo o
        CI.
      </p>
    </div>
  );
}
