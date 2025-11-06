import { env } from "~/env";
import https from "https";

export const fetchApi = async <T>(options: {
  path: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  body?: Record<string, unknown>;
  searchParams?: Record<string, string>;
}): Promise<T> => {
  const { path, method, body, searchParams } = options;

  const fetchUrl = `${env.HCEN_BASE_URL}/api/${path}?${new URLSearchParams(searchParams).toString()}`;

  // Configure HTTPS agent to handle self-signed certificates
  const httpsAgent = new https.Agent({
    rejectUnauthorized: false, // Allow self-signed certificates
  });

  const response = await fetch(fetchUrl, {
    method,
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${btoa(`${env.HCEN_APP_USERNAME}:${env.HCEN_APP_PASSWORD}`)}`,
    },
    // @ts-expect-error - Node.js fetch types don't include agent yet
    agent: httpsAgent,
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json() as Promise<T>;
};
