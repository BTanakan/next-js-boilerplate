import { BACKEND_PROXY } from "@/lib/constants";

type Props = {
  pathname: string;
  searchParams?: URLSearchParams | Record<string, string>;
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: unknown;
};

export async function callBackendProxy<T = any>({
  pathname,
  searchParams,
  method = "GET",
  body,
}: Props): Promise<T> {
  const baseUrl =
    typeof window !== "undefined"
      ? window.location.origin
      : process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const url = new URL(BACKEND_PROXY, baseUrl);

  url.searchParams.append("pathname", pathname);

  if (searchParams) {
    const params = new URLSearchParams(searchParams as any);
    params.forEach((value, key) => {
      url.searchParams.append(key, value);
    });
  }

  const headers: HeadersInit = {
    ...(body ? { "Content-Type": "application/json" } : {}),
  };

  const init: RequestInit = {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  };

  const response = await fetch(url.toString(), init);

  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}`);
  }

  const json = await response.json();

  if (json?.status === false && typeof json?.message === "string") {
    throw new Error(`${response.status} ${json.message}`);
  }

  if (
    typeof json?.error === "string" &&
    typeof json?.description === "string"
  ) {
    throw new Error(`${json.error}: ${json.description}`);
  }

  return json as T;
}
