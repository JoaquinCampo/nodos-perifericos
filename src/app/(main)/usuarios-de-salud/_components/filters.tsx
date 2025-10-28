"use client";

import { useQueryStates } from "nuqs";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { filterParams } from "./search-params";
import { cleanCi } from "~/lib/validation/ci";

export function HealthUsersFilters() {
  const [filterState, setFilterState] = useQueryStates(filterParams);

  const handleUsernameChange = (value: string) => {
    void setFilterState({ username: value }, { shallow: false });
  };

  const handleCiChange = (value: string) => {
    const cleanedCi = cleanCi(value);
    void setFilterState({ ci: cleanedCi }, { shallow: false });
  };

  return (
    <div className="flex w-full gap-4 sm:flex-row sm:items-end">
      <div className="flex w-fit flex-col gap-2">
        <Label htmlFor="ci">Buscar por CI</Label>
        <Input
          id="ci"
          placeholder="Ingrese CI..."
          value={filterState.ci}
          onChange={(e) => handleCiChange(e.target.value)}
          className="w-full sm:w-[200px]"
        />
      </div>

      <div className="flex flex-1 flex-col gap-2">
        <Label htmlFor="username">Buscar por nombre</Label>
        <Input
          id="username"
          placeholder="Ingrese nombre del usuario..."
          value={filterState.username}
          onChange={(e) => handleUsernameChange(e.target.value)}
        />
      </div>
    </div>
  );
}
