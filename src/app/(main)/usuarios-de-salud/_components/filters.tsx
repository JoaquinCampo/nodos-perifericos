"use client";

import { useQueryStates } from "nuqs";
import { useSearchParams } from "next/navigation";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { filterParams } from "./search-params";
import { cleanCi } from "~/lib/validation/ci";
import type { Clinic } from "@prisma/client";

interface HealthUsersFiltersProps {
  clinics: Clinic[];
}

export function HealthUsersFilters({ clinics }: HealthUsersFiltersProps) {
  const [filterState, setFilterState] = useQueryStates(filterParams);
  const searchParams = useSearchParams();

  const handleNameChange = (value: string) => {
    void setFilterState({ name: value }, { shallow: false });
  };

  const handleCiChange = (value: string) => {
    const cleanedCi = cleanCi(value);
    void setFilterState({ ci: cleanedCi }, { shallow: false });
  };

  const handleClinicChange = (value: string) => {
    // Use "__all__" as sentinel value for "all clinics", set to null to remove from URL
    if (value === "__all__") {
      void setFilterState({ clinic: null }, { shallow: false });
    } else {
      void setFilterState({ clinic: value }, { shallow: false });
    }
  };

  const clinicFromUrl = searchParams.get("clinic");
  const clinicValue =
    clinicFromUrl && clinicFromUrl !== "" ? clinicFromUrl : null;
  const selectClinicValue = clinicValue ?? "__all__";

  return (
    <div className="flex w-full flex-wrap gap-4 sm:flex-row sm:items-end">
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
          value={filterState.name}
          onChange={(e) => handleNameChange(e.target.value)}
        />
      </div>

      <div className="flex w-fit flex-col gap-2">
        <Label htmlFor="clinic">Filtrar por clínica</Label>
        <Select value={selectClinicValue} onValueChange={handleClinicChange}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Todas las clínicas" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__all__">Todas las clínicas</SelectItem>
            {clinics.map((clinic) => (
              <SelectItem key={clinic.id} value={clinic.name}>
                {clinic.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
