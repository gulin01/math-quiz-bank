"use client";
import { useState } from "react";
import QuestionPreview from "./_components/QuestionPreview";
import QuestionList from "./_components/QuestionList";
import Dashboard from "./_components/Dashboard";

export default function Home() {
  const [view, setView] = useState<string>("list");

  return (
    <div className="min-h-screen p-8 sm:p-20 font-[family-name:var(--font-geist-sans)] bg-gray-50">
      <div className="flex flex-col items-center gap-6 mt-20">
        <h1 className="text-3xl font-bold text-center text-[#000]">
          🧠 Math Quiz Dashboard
        </h1>

        <div className="flex gap-4">
          <button
            onClick={() => setView("create")}
            className="bg-blue-600 text-white px-6 py-3 rounded text-lg hover:bg-blue-700 transition"
          >
            ➕ Create New Question
          </button>

          <button
            onClick={() => setView("list")}
            className="bg-gray-700 text-white px-6 py-3 rounded text-lg hover:bg-gray-800 transition"
          >
            📄 View Question List
          </button>
          <button
            onClick={() => setView("preview")}
            className="bg-gray-700 text-white px-6 py-3 rounded text-lg hover:bg-gray-800 transition"
          >
            📄 Test Questions As a User
          </button>
        </div>

        <div className="w-full flex justify-center pt-10">
          {view === "create" && <Dashboard setView={setView} />}
          {view === "list" && <QuestionList setView={setView} />}
          {view === "preview" && <QuestionPreview setView={setView} />}
        </div>
      </div>
    </div>
  );
}
