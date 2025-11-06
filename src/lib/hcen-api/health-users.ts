import { fetchApi } from "~/lib/hcen-api";

type Gender = "MALE" | "FEMALE" | "OTHER";

export type HealthUser = {
  id: string;
  ci: string;
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
    ...(clinic?.trim() && { clinicName: clinic?.trim() }), // HCEN uses clinicName
  };

  // HCEN returns just the array of users, not paginated metadata
  const users = await fetchApi<HealthUser[]>({
    path: "health-users",
    method: "GET",
    searchParams: normalizedSearchParams,
  });

  // Transform to expected paginated format
  return {
    items: users,
    page: pageIndex,
    size: pageSize,
    totalItems: users.length, // HCEN doesn't provide total count
    totalPages: 1, // HCEN doesn't provide pagination info
    hasNext: false,
    hasPrevious: false,
  };
};

export type CreateHealthUserData = {
  ci: string;
  firstName: string;
  lastName: string;
  gender: "MALE" | "FEMALE" | "OTHER";
  email: string;
  phone?: string;
  address?: string;
  dateOfBirth: string; // YYYY-MM-DD format
  clinicNames: string[];
};

export const createHealthUser = async (data: CreateHealthUserData): Promise<HealthUser> => {
  return await fetchApi<HealthUser>({
    path: "health-users",
    method: "POST",
    body: data,
  });
};
