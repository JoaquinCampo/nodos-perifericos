type Gender = "MALE" | "FEMALE" | "OTHER";

export type HealthUser = {
  id: string;
  ci: string;
  firstName: string;
  lastName: string;
  gender: Gender;
  email: string;
  phone: string | null;
  address: string | null;
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

type Clinic = {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  createdAt: string;
  updatedAt: string;
};

type HealthWorker = {
  id: string;
  document: string;
  documentType: string;
  firstName: string;
  lastName: string;
  gender: string;
  email: string;
  phone: string;
  dateOfBirth: string;
};

export type ClinicalDocument = {
  clinic: Clinic;
  healthWorker: HealthWorker;
  createdAt: string;
  s3Url: string;
};

export type FindHealthUserByCiResponse = {
  healthUser: HealthUser;
  documents: ClinicalDocument[];
};

export type AccessRequest = {
  id: string;
  healthUserCi: string;
  healthWorker: HealthWorker;
  clinic: Clinic;
  createdAt: string;
};

export type FindAllAccessRequestsResponse = AccessRequest[];
