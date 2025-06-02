// pages/index.tsx (or app/page.tsx if you’re on the App Router)
"use client";
import "katex/dist/katex.min.css";

import { useState, useEffect } from "react";
import Link from "next/link";
import { InlineMath } from "react-katex";
import { parseMixedText } from "../_utils/parseMixedText";

type ColumnDefinition = {
  name: string;
  type: "text" | "number" | "latex";
};
type TableProblem = {
  id: string;
  type: "TABLE_FILL_CELLS";
  question: string;
  columns: ColumnDefinition[];
  rows: string[];
  cells: string[][];
  rowHeaderLabel?: string;
};

type MCQOption = {
  text: string;
  type: "text" | "number" | "latex";
};
type MCQProblem = {
  id: string;
  type: "MCQ_SINGLE";
  question: string;
  options: MCQOption[];
  correctOptionIndex: number;
};

type BlankProblem = {
  id: string;
  type: "FILL_IN_THE_BLANK";
  question: string;
  answer?: string;
};

type AnyProblem = TableProblem | MCQProblem | BlankProblem;

export default function QuestionList() {
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
          <Link href="/create" className="text-blue-600 hover:underline">
            + Create New Question
          </Link>
        </header>

        {problems.length === 0 ? (
          <p className="text-center text-gray-500">No problems found.</p>
        ) : (
          <div className="space-y-6">
            {problems.map((p) => {
              if (p.type === "TABLE_FILL_CELLS") {
                const table = p as TableProblem;

                // Safely get arrays
                const cols = Array.isArray(table.columns) ? table.columns : [];
                const rws = Array.isArray(table.rows) ? table.rows : [];
                const cls = Array.isArray(table.cells) ? table.cells : [];

                return (
                  <div
                    key={table.id}
                    className="bg-white border border-gray-300 rounded-lg shadow-sm p-6"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        {/* parseMixedText for the question, in case it has $…$ */}
                        <h2 className="text-2xl font-semibold text-gray-800 mb-1">
                          {parseMixedText(table.question)}
                        </h2>
                        <p className="text-sm text-gray-600">
                          Type: {table.type}
                        </p>
                      </div>
                      <button
                        onClick={() => handleDelete(table.id)}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        Delete
                      </button>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full table-auto border-collapse">
                        <thead>
                          <tr className="bg-indigo-50">
                            {/* Show rowHeaderLabel (if any) */}
                            <th className="border border-gray-300 px-4 py-2 text-gray-700 font-medium">
                              {table.rowHeaderLabel ?? ""}
                            </th>
                            {/* Render each column header by name */}
                            {cols.map((colDef, ci) => {
                              const headerText = colDef.name || "";
                              return (
                                <th
                                  key={ci}
                                  className="border border-gray-300 px-4 py-2 text-gray-700"
                                >
                                  {headerText.includes("^") ? (
                                    <InlineMath math={headerText} />
                                  ) : (
                                    headerText
                                  )}
                                </th>
                              );
                            })}
                          </tr>
                        </thead>

                        <tbody>
                          {rws.map((rowLabel, ri) => {
                            const label = rowLabel ?? "";
                            return (
                              <tr
                                key={ri}
                                className={
                                  ri % 2 === 0 ? "bg-white" : "bg-gray-50"
                                }
                              >
                                <th className="border px-4 py-2 text-gray-800 font-medium">
                                  {label.includes("^") ? (
                                    <InlineMath math={label} />
                                  ) : (
                                    label
                                  )}
                                </th>

                                {cols.map((_, ci) => {
                                  const rowCells = Array.isArray(cls[ri])
                                    ? cls[ri]
                                    : [];
                                  const cellValue = rowCells[ci] ?? "";
                                  return (
                                    <td
                                      key={ci}
                                      className="border px-4 py-2 text-gray-700"
                                    >
                                      {cellValue === "" ? (
                                        <span className="text-gray-400">
                                          ----
                                        </span>
                                      ) : cellValue.includes("^") ? (
                                        <InlineMath math={cellValue} />
                                      ) : (
                                        cellValue
                                      )}
                                    </td>
                                  );
                                })}
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                );
              } else if (p.type === "MCQ_SINGLE") {
                const mcq = p as MCQProblem;
                const opts = Array.isArray(mcq.options) ? mcq.options : [];

                return (
                  <div
                    key={mcq.id}
                    className="bg-white border border-gray-300 rounded-lg shadow-sm p-6"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h2 className="text-2xl font-semibold text-gray-800 mb-1">
                          {parseMixedText(mcq.question)}
                        </h2>
                        <p className="text-sm text-gray-600">
                          Type: {mcq.type}
                        </p>
                      </div>
                      <button
                        onClick={() => handleDelete(mcq.id)}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        Delete
                      </button>
                    </div>

                    <ul className="mt-4 list-disc list-inside text-gray-700">
                      {opts.map((opt, i) => {
                        const raw = opt.text || "";
                        // Replace \imaginaryI → \mathrm{i}
                        const cleaned = raw.replace(
                          /\\imaginaryI/g,
                          "\\mathrm{i}"
                        );
                        return (
                          <li
                            key={i}
                            className={
                              i === mcq.correctOptionIndex
                                ? "text-green-600"
                                : ""
                            }
                          >
                            {opt.type === "latex" ? (
                              <InlineMath math={cleaned} />
                            ) : (
                              opt.text
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                );
              } else {
                // FILL_IN_THE_BLANK
                const blank = p as BlankProblem;
                const ans = blank.answer ?? "";

                return (
                  <div
                    key={blank.id}
                    className="bg-white border border-gray-300 rounded-lg shadow-sm p-6"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h2 className="text-2xl font-semibold text-gray-800 mb-1">
                          {parseMixedText(blank.question)}
                        </h2>
                        <p className="text-sm text-gray-600">
                          Type: {blank.type}
                        </p>
                      </div>
                      <button
                        onClick={() => handleDelete(blank.id)}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        Delete
                      </button>
                    </div>

                    <div className="mt-4 text-gray-700">
                      <strong>Answer:</strong>{" "}
                      {ans.includes("^") ? <InlineMath math={ans} /> : ans}
                    </div>
                  </div>
                );
              }
            })}
          </div>
        )}
      </div>
    </div>
  );
}
