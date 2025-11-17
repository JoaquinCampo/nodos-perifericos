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
  clinics: Clinic[];
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

export type Clinic = {
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
  id: string;
  title: string | null;
  description: string | null;
  content: string | null;
  contentType: string | null;
  contentUrl: string | null;
  clinic: Clinic;
  healthWorker: HealthWorker;
  createdAt: string;
};

export type FindHealthUserByCiResponse = {
  healthUser: HealthUser;
  documents: ClinicalDocument[];
  hasAccess: boolean;
  accessMessage: string;
};

export type AccessRequest = {
  id: string;
  healthUserCi: string;
  healthWorker: HealthWorker;
  clinic: Clinic;
  createdAt: string;
};

export type FindAllAccessRequestsResponse = AccessRequest[];
