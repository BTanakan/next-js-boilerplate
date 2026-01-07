import { NextResponse, NextRequest } from "next/server";

const BASE_API_URL = "https://pokeapi.co/api/v2"; // ปลายทางจริง

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  // ดึง pathname ออกมา (เช่น /pokemon/ditto)
  const pathname = searchParams.get("pathname");

  if (!pathname) {
    return NextResponse.json(
      { error: "Pathname is required" },
      { status: 400 }
    );
  }

  // ✅ สร้าง URL ปลายทาง พร้อมส่งต่อ Query Params อื่นๆ (ถ้ามี)
  // ลบ 'pathname' ออกจาก params ก่อนส่งต่อ เพราะปลายทางไม่รู้จัก parameter นี้
  searchParams.delete("pathname");
  const queryString = searchParams.toString();

  // ถ้ายิงมาแบบ ?pathname=/pokemon&limit=10 -> ปลายทางจะเป็น .../pokemon?limit=10
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
