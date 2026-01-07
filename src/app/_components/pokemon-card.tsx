"use client";

import { useQuery } from "@tanstack/react-query";

import { Pokemon } from "@/types/pokemon";
import Image from "next/image";
import { callBackendProxy } from "@/hook/fetch/call-backend-proxy";

export default function PokemonCard() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["pokemon", "ditto"],
    queryFn: () =>
      callBackendProxy<Pokemon>({
        pathname: "/pokemon/ditto",
        method: "GET",
        // ตัวอย่างการส่ง params เพิ่มเติม (ถ้ามี)
        // searchParams: { limit: "10" }
      }),
  });

  if (isLoading) return <div className="p-4">Loading Ditto...</div>;
  if (error)
    return <div className="p-4 text-red-500">Error: {error.message}</div>;

  return (
    <div className="border rounded-lg p-6 shadow-md max-w-sm mx-auto mt-10 bg-white text-center">
      <h2 className="text-2xl font-bold capitalize mb-4 text-gray-800">
        {data?.name}
      </h2>

      {/* แสดงรูปภาพ */}
      {data?.sprites.other["official-artwork"].front_default && (
        <div className="relative w-48 h-48 mx-auto">
          <Image
            src={data.sprites.other["official-artwork"].front_default}
            alt={data.name}
            fill
            className="object-contain"
            priority
          />
        </div>
      )}

      <div className="mt-4 flex gap-2 justify-center">
        {data?.types.map((t) => (
          <span
            key={t.type.name}
            className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold capitalize"
          >
            {t.type.name}
          </span>
        ))}
      </div>
    </div>
  );
}
