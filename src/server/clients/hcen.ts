import { env } from "~/env";

export interface HcenHealthWorkerResponse {
  ci: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  address?: string;
  dateOfBirth?: string;
}

export class HcenClientError extends Error {
  readonly status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = "HcenClientError";
    this.status = status;
  }
}

export const hcenFetch = async <TResponse>(
  path: string,
  init?: RequestInit,
): Promise<TResponse> => {
  const response = await fetch(new URL(path, env.HCEN_BASE_URL), {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });

  if (!response.ok) {
    let errorMessage = "Error al comunicarse con HCEN";

    try {
      const body = await response.json();
      if (body && typeof body === "object" && "message" in body) {
        errorMessage = String(body.message);
      }
    } catch {
      // Ignore JSON parsing errors and fallback to default message.
    }

    throw new HcenClientError(errorMessage, response.status);
  }

  try {
    return (await response.json()) as TResponse;
  } catch (error) {
    throw new HcenClientError("Respuesta inválida desde HCEN");
  }
};

export const fetchHealthWorkerByCi = async (ci: string) => {
  const trimmedCi = ci.trim();

  if (!trimmedCi) {
    throw new HcenClientError("La cédula no puede estar vacía");
  }

  return await hcenFetch<HcenHealthWorkerResponse>(`/health-users/${trimmedCi}`);
};
