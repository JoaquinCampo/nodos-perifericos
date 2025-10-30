import { fetchApi } from "~/lib/hcen-api";

type Gender = "MALE" | "FEMALE" | "OTHER";
type DocumentType = "ID" | "PASSPORT";

export type HealthUser = {
  id: string;
  document: string;
  documentType: DocumentType;
  firstName: string;
  lastName: string;
  gender: Gender;
  email: string;
  phone: string;
  address: string;
  dateOfBirth: string;
  createdAt: string;
  updatedAt: string;
  clinicNames: string[];
};

export type FindAllHealthUsersResponse = {
  items: HealthUser[];
  page: number;
  size: number;
  totalItems: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
};

export const fetchHealthUsers = async (searchParams: {
  pageIndex: number;
  pageSize: number;
  name?: string;
  ci?: string;
  clinic?: string;
}): Promise<FindAllHealthUsersResponse> => {
  const { pageIndex, pageSize, name, ci, clinic } = searchParams;

  const normalizedSearchParams: Record<string, string> = {
    pageIndex: pageIndex.toString(),
    pageSize: pageSize.toString(),
    ...(name?.trim() && { name: name.trim() }),
    ...(ci?.trim() && { ci: ci.trim() }),
    ...(clinic?.trim() && { clinic: clinic.trim() }),
  };

  return await fetchApi<FindAllHealthUsersResponse>({
    path: "health-users",
    method: "GET",
    searchParams: normalizedSearchParams,
  });
};
