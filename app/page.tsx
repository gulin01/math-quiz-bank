// pages/index.tsx  (or app/page.tsx)
"use client";
import "katex/dist/katex.min.css";

import { useState, useEffect } from "react";
import {
  TableProblem,
  TableProblemView,
} from "./components/problem-displays/TableProblemView";
import {
  MCQProblem,
  MCQProblemView,
} from "./components/problem-displays/MCQProblemView";
import {
  BlankProblem,
  BlankProblemView,
} from "./components/problem-displays/BlankProblemView";
import { useRouter } from "next/navigation";
import { ColumnDefinition } from "./create/_components/TableEditor";
import { MCQOption } from "./create/_components/MQCEditor";
export type AnyProblem = {
  id: string;
  type: "TABLE_FILL_CELLS" | "MCQ_SINGLE" | "FILL_IN_THE_BLANK";
  question: string;
  graphState?: any;
  graphType?: string;
} & (
  | {
      type: "TABLE_FILL_CELLS";
      columns: ColumnDefinition[];
      rows: string[];
      cells: string[][];
      rowHeaderLabel?: string;
    }
  | {
      type: "MCQ_SINGLE";
      options: MCQOption[];
      correctOptionIndex: number;
    }
  | {
      type: "FILL_IN_THE_BLANK";
      answer: string;
    }
);

export default function QuestionList({
  setView,
}: {
  setView: (view: string) => void;
}) {
  const [problems, setProblems] = useState<AnyProblem[]>([]);
  const router = useRouter();
  useEffect(() => {
    const stored = sessionStorage.getItem("problems");
    if (stored) {
      try {
        setProblems(JSON.parse(stored));
      } catch {
        setProblems([]);
      }
    }
  }, []);

  const handleDelete = (id: string) => {
    if (!confirm("Are you sure you want to delete this problem?")) return;
    const next = problems.filter((p) => p.id !== id);
    setProblems(next);
    sessionStorage.setItem("problems", JSON.stringify(next));
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <header className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-extrabold text-gray-800">
            📝 문제 목록
          </h1>
          <div
            onClick={() => router.push("/create")}
            className="text-blue-600 hover:underline cursor-pointer"
          >
            + 문제 생성하기
          </div>
        </header>

        {problems.length === 0 ? (
          <p className="text-center text-gray-500">No problems found.</p>
        ) : (
          <div className="space-y-10">
            {problems.map((p) => {
              switch (p.type) {
                case "TABLE_FILL_CELLS":
                  return (
                    <TableProblemView
                      key={p.id}
                      problem={p}
                      onDelete={handleDelete}
                    />
                  );
                case "MCQ_SINGLE":
                  return (
                    <MCQProblemView
                      key={p.id}
                      problem={p}
                      onDelete={handleDelete}
                    />
                  );
                case "FILL_IN_THE_BLANK":
                  return (
                    <BlankProblemView
                      key={p.id}
                      problem={p}
                      onDelete={handleDelete}
                    />
                  );
                default:
                  return null;
              }
            })}
          </div>
        )}
      </div>
    </div>
  );
}
