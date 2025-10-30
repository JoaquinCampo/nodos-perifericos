import { env } from "~/env";

export const fetchApi = async <T>(options: {
  path: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  body?: Record<string, unknown>;
  searchParams?: Record<string, string>;
}): Promise<T> => {
  const { path, method, body, searchParams } = options;

  const fetchUrl = `${env.HCEN_BASE_URL}/api/${path}?${new URLSearchParams(searchParams).toString()}`;

  const response = await fetch(fetchUrl, {
    method,
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${btoa(`${env.HCEN_APP_USERNAME}:${env.HCEN_APP_PASSWORD}`)}`,
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json() as Promise<T>;
};
