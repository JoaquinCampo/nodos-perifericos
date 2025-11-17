import { env } from "~/env";

export const fetchApi = async <T>(options: {
  path: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  body?: Record<string, unknown>;
  searchParams?: Record<string, string | string[]>;
}): Promise<T> => {
  const { path, method, body, searchParams } = options;

  const queryString = searchParams
    ? `?${new URLSearchParams(Object.entries(searchParams).flatMap(([key, value]) => (Array.isArray(value) ? value.map((v) => [key, v]) : [[key, value]]))).toString()}`
    : "";

  const fetchUrl = `${env.HCEN_BASE_URL}/api/${path}${queryString}`;

  console.log("Fetching API", fetchUrl);

  const response = await fetch(fetchUrl, {
    method,
    body: body ? JSON.stringify(body) : undefined,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${btoa(`${env.HCEN_APP_USERNAME}:${env.HCEN_APP_PASSWORD}`)}`,
    },
  });

  if (!response.ok) {
    let errorMessage = `HTTP error! status: ${response.status}`;
    try {
      const errorData = (await response.json()) as {
        error?: string;
        message?: string;
      };
      errorMessage = errorData.error ?? errorData.message ?? errorMessage;
    } catch {
      // If response is not JSON, use the default error message
    }
    throw new Error(errorMessage);
  }

  return response.json() as Promise<T>;
};
