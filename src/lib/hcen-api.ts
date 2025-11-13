import { env } from "~/env";

export const fetchApi = async <T>(options: {
  path: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  body?: Record<string, unknown>;
  searchParams?: Record<string, string>;
}): Promise<T> => {
  const { path, method, body, searchParams } = options;

  const queryString = searchParams
    ? `?${new URLSearchParams(searchParams).toString()}`
    : "";
  const fetchUrl = `${env.HCEN_BASE_URL}/api/${path}${queryString}`;

  console.log("Fetching API", fetchUrl);

  console.log("Body", JSON.stringify(body));

  const response = await fetch(fetchUrl, {
    method,
    body: body ? JSON.stringify(body) : undefined,
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
