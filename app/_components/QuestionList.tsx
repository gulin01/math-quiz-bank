// pages/index.tsx  (or app/page.tsx)
"use client";
import "katex/dist/katex.min.css";

import { useState, useEffect } from "react";
import {
  TableProblem,
  TableProblemView,
} from "./problem-displays/TableProblemView";
import { MCQProblem, MCQProblemView } from "./problem-displays/MCQProblemView";
import {
  BlankProblem,
  BlankProblemView,
} from "./problem-displays/BlankProblemView";

export type AnyProblem = TableProblem | MCQProblem | BlankProblem;

export default function QuestionList({
  setView,
}: {
  setView: (view: string) => void;
}) {
  const [problems, setProblems] = useState<AnyProblem[]>([]);

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
    <div className="w-full min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <header className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-extrabold text-gray-800">
            📝 Question List
          </h1>
          <div
            onClick={() => setView("create")}
            className="text-blue-600 hover:underline cursor-pointer"
          >
            + Create New Question
          </div>
        </header>

        {problems.length === 0 ? (
          <p className="text-center text-gray-500">No problems found.</p>
        ) : (
          <div className="space-y-6">
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
