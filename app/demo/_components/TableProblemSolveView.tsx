// components/solve-views/TableProblemSolveView.tsx
"use client";

import { parseMixedText } from "@/app/_utils/parseMixedText";
import { DesmosGraphView } from "@/app/components/DesmosGraphView";
import { useEffect } from "react";

export function TableProblemSolveView({
  problem,
  userAnswer,
  onAnswer,
}: {
  problem: any;
  userAnswer: string[][];
  onAnswer: (value: string[][]) => void;
}) {
  const rows = problem.rows || [];
  const columns = problem.columns || [];

  useEffect(() => {
    import("mathlive");
  }, []);

  const updateCell = (r: number, c: number, val: string) => {
    const newGrid = Array.from({ length: rows.length }, (_, ri) =>
      Array.from({ length: columns.length }, (_, ci) =>
        ri === r && ci === c ? val : userAnswer?.[ri]?.[ci] || ""
      )
    );
    onAnswer(newGrid);
  };

  return (
    <div className="bg-white border border-gray-300 rounded-2xl shadow-md p-6">
      <h2 className="text-2xl font-bold text-indigo-700 mb-4">
        {parseMixedText(problem.question)}
      </h2>

      {problem.graphState && problem.graphType && (
        <div className="mt-6 min-h-[300px]">
          <h3 className="text-sm font-medium text-gray-700 mb-2">
            📉 설명용 그래프
          </h3>
          <DesmosGraphView
            state={problem.graphState}
            graphType={problem.graphType}
          />
        </div>
      )}

      <div className="overflow-x-auto mt-6">
        <table className="min-w-full border border-gray-300 rounded-xl overflow-hidden">
          <thead className="bg-indigo-50">
            <tr>
              <th className="border p-3 text-indigo-800 font-semibold text-center">
                {problem.rowHeaderLabel ?? ""}
              </th>
              {columns.map((col: any, ci: number) => (
                <th
                  key={ci}
                  className="border p-3 text-indigo-800 font-semibold text-center"
                >
                  {col.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((rowLabel: string, ri: number) => (
              <tr key={ri} className={ri % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <th className="border p-3 font-medium text-gray-700 text-center">
                  {rowLabel}
                </th>
                {columns.map((col: any, ci: number) => (
                  <td key={ci} className="border p-2">
                    {col.type === "latex" ? (
                      // @ts-ignore
                      <math-field
                        class="w-full h-12 border rounded-md p-1 bg-white"
                        value={userAnswer?.[ri]?.[ci] || ""}
                        virtual-keyboard-mode="onfocus"
                        smart-mode
                        onInput={(e: any) =>
                          updateCell(ri, ci, e.target.getValue())
                        }
                      />
                    ) : (
                      <input
                        type={col.type === "number" ? "number" : "text"}
                        value={userAnswer?.[ri]?.[ci] ?? ""}
                        onChange={(e) => updateCell(ri, ci, e.target.value)}
                        className="w-full p-2 border rounded-md text-center text-gray-800 focus:ring focus:ring-indigo-300"
                      />
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
