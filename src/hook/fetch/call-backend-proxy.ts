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
  // ✅ 1. แก้ปัญหา Invalid URL โดยการหา Base URL ของเว็บไซต์
  const baseUrl =
    typeof window !== "undefined"
      ? window.location.origin
      : process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  // สร้าง URL ไปที่ Proxy (เช่น http://localhost:3000/api/proxy)
  const url = new URL(BACKEND_PROXY, baseUrl);

  // ใส่ pathname ที่เราต้องการยิงจริง (เช่น /pokemon/ditto)
  url.searchParams.append("pathname", pathname);

  // ใส่ search params อื่นๆ (ถ้ามี)
  if (searchParams) {
    const params = new URLSearchParams(searchParams as any);
    params.forEach((value, key) => {
      url.searchParams.append(key, value);
    });
  }

  const headers: HeadersInit = {
    // ✅ 2. ใส่ Content-Type อัตโนมัติถ้ามี Body
    ...(body ? { "Content-Type": "application/json" } : {}),
  };

  const init: RequestInit = {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  };

  const response = await fetch(url.toString(), init);

  // ✅ 3. Handle HTTP Error (4xx, 5xx)
  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}`);
  }

  const json = await response.json();

  // ✅ 4. Handle Logical Error (Error ที่ Backend ส่งมาในรูป JSON)
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
