"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { BlockMath, InlineMath } from "react-katex";

type TableProblem = {
  id: string;
  type: "TABLE_FILL_CELLS";
  question: string;
  columns: string[]; // stored as LaTeX strings if needed, e.g. "x^2"
  rows: string[]; // same
  cells: string[][];
};
// … MCQProblem, BlankProblem, Problem unions …

export default function ProblemList() {
  const [problems, setProblems] = useState<any[]>([]);

  useEffect(() => {
    const stored = sessionStorage.getItem("problems");
    if (stored) setProblems(JSON.parse(stored));
  }, []);

  const handleDelete = (id: string) => {
    if (!confirm("정말 이 문제를 삭제하시겠습니까?")) return;
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
          <Link href="/create">새 문제 만들기</Link>
        </header>

        {problems.length === 0 ? (
          <p className="text-center text-gray-500">등록된 문제가 없습니다.</p>
        ) : (
          <div className="space-y-6">
            {problems.map((p) => (
              <div
                key={p.id}
                className="bg-white border border-gray-300 rounded-lg shadow-sm p-6"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-2xl font-semibold text-gray-800 mb-1">
                      {p.question}
                    </h2>
                    <p className="text-sm text-gray-600">Type: {p.type}</p>
                  </div>
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    삭제
                  </button>
                </div>

                {p.type === "TABLE_FILL_CELLS" ? (
                  <div className="overflow-x-auto">
                    <table className="w-full table-auto border-collapse">
                      <thead>
                        <tr className="bg-indigo-50">
                          <th className="border border-gray-300 px-4 py-2"></th>
                          {p.columns.map((col: any, ci: number) => (
                            <th
                              key={ci}
                              className="border border-gray-300 px-4 py-2 text-gray-700"
                            >
                              {/* render header as math if it contains LaTeX syntax */}
                              {col.includes("^") ? (
                                <InlineMath math={col} />
                              ) : (
                                col
                              )}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {p.rows.map((rowLabel, ri) => (
                          <tr
                            key={ri}
                            className={ri % 2 === 0 ? "bg-white" : "bg-gray-50"}
                          >
                            <th className="border px-4 py-2 text-gray-800 font-medium">
                              {rowLabel.includes("^") ? (
                                <InlineMath math={rowLabel} />
                              ) : (
                                rowLabel
                              )}
                            </th>
                            {p.cells[ri].map((cellValue, ci) => (
                              <td
                                key={ci}
                                className="border px-4 py-2 text-gray-700"
                              >
                                {cellValue === "" ? (
                                  <span className="text-gray-400">____</span>
                                ) : cellValue.includes("^") ? (
                                  <InlineMath math={cellValue} />
                                ) : (
                                  cellValue
                                )}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : p.type === "MCQ_SINGLE" ? (
                  <ul className="mt-4 list-disc list-inside text-gray-700">
                    {(p as any).options.map((opt, i) => (
                      <li
                        key={i}
                        className={
                          i === (p as any).correctOptionIndex
                            ? "text-green-600"
                            : ""
                        }
                      >
                        {opt}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="mt-4 text-gray-700">
                    <strong>Answer:</strong> {(p as any).answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
