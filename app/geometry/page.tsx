"use client";

import { useState } from "react";
import GeometryBuilder from "./_components/GeometryBuilder";
import GeometryQuestionList from "./_components/GeometryQuestionList";
import GeometryPreview from "./_components/GeometryPreview";

export default function GeometryHome() {
  const [view, setView] = useState<string>("create");

  return (
    <div className="min-h-screen p-8 sm:p-20 font-sans bg-gray-50">
      <div className="flex flex-col items-center gap-6 mt-20">
        <h1 className="text-3xl font-bold text-center text-[#000]">
          📐 Geometry Quiz Dashboard
        </h1>

        <div className="flex gap-4">
          <button
            onClick={() => setView("create")}
            className="bg-green-600 text-white px-6 py-3 rounded text-lg hover:bg-green-700 transition"
          >
            ➕ Create New Geometry Problem
          </button>

          <button
            onClick={() => setView("list")}
            className="bg-gray-700 text-white px-6 py-3 rounded text-lg hover:bg-gray-800 transition"
          >
            📄 View Problem List
          </button>

          <button
            onClick={() => setView("preview")}
            className="bg-gray-700 text-white px-6 py-3 rounded text-lg hover:bg-gray-800 transition"
          >
            👁 Preview Problems as Student
          </button>
        </div>

        <div className="w-full flex justify-center pt-10">
          {view === "create" && <GeometryBuilder setView={setView} />}
          {view === "list" && <GeometryQuestionList setView={setView} />}
          {view === "preview" && <GeometryPreview setView={setView} />}
        </div>
      </div>
    </div>
  );
}
