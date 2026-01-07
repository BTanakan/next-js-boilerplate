import { NextResponse, NextRequest } from "next/server";

// เปลี่ยน url ให้สอดคล้องกับ API ที่ต้องการ
const BASE_API_URL = "https://pokeapi.co/api/v2";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const pathname = searchParams.get("pathname");

  if (!pathname) {
    return NextResponse.json(
      { error: "Pathname is required" },
      { status: 400 }
    );
  }

  searchParams.delete("pathname");
  const queryString = searchParams.toString();

  const targetUrl = `${BASE_API_URL}${pathname}${
    queryString ? `?${queryString}` : ""
  }`;

  try {
    const response = await fetch(targetUrl);

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch from external API" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
