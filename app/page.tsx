"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Page() {
  const router = useRouter();

  return (
    <div className="min-h-screen p-8 sm:p-20 font-[family-name:var(--font-geist-sans)] bg-gray-50 flex flex-col items-center justify-center space-y-6">
      <h1 className="text-2xl font-bold text-[#000]">Select Quiz Type</h1>
      <div className="flex flex-col sm:flex-row gap-6">
        <button
          onClick={() => router.push("/math")}
          className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
        >
          Math Quiz
        </button>
        <button
          onClick={() => router.push("/geometry")}
          className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition"
        >
          Geometry Quiz
        </button>
      </div>
    </div>
  );
}
