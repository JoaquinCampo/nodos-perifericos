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
  clinicIds: string[];
  clinicalDocumentIds: string[];
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

export const fetchHealthUsers = async (
  page = 1,
  size = 20,
  username?: string,
  ci?: string,
): Promise<FindAllHealthUsersResponse> => {
  const searchParams: Record<string, string> = {
    page: page.toString(),
    size: size.toString(),
  };

  if (username?.trim()) {
    // For username search, we need to use the /search endpoint
    // This returns a List<HealthUserDTO>, so we need to wrap it in pagination format
    const searchResults = await fetchApi<HealthUser[]>({
      path: "health-users/search",
      method: "GET",
      searchParams: {
        name: username.trim(),
      },
    });

    // Calculate pagination for search results
    const totalItems = searchResults.length;
    const totalPages = Math.ceil(totalItems / size);
    const startIndex = (page - 1) * size;
    const endIndex = startIndex + size;
    const paginatedItems = searchResults.slice(startIndex, endIndex);

    return {
      items: paginatedItems,
      page,
      size,
      totalItems,
      totalPages,
      hasNext: page < totalPages,
      hasPrevious: page > 1,
    };
  }

  if (ci?.trim()) {
    searchParams.document = ci.trim();
  }

  return await fetchApi<FindAllHealthUsersResponse>({
    path: "health-users",
    method: "GET",
    searchParams,
  });
};
