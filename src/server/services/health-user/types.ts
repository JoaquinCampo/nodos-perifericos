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
  pageIndex: number;
  pageSize: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};
