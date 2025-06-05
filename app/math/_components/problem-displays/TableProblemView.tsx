// components/TableProblemView.tsx
"use client";

import { parseMixedText } from "@/app/_utils/parseMixedText";
import { InlineMath } from "react-katex";

type ColumnDefinition = {
  name: string;
  type: "text" | "number" | "latex";
};

export type TableProblem = {
  id: string;
  type: "TABLE_FILL_CELLS";
  question: string;
  columns: ColumnDefinition[];
  rows: string[];
  cells: string[][];
  rowHeaderLabel?: string;
};

interface TableProblemViewProps {
  problem: TableProblem;
  onDelete: (id: string) => void;
}

export function TableProblemView({ problem, onDelete }: TableProblemViewProps) {
  // Safely coerce to arrays (they should already be arrays, but guard anyway)
  const cols = Array.isArray(problem.columns) ? problem.columns : [];
  const rws = Array.isArray(problem.rows) ? problem.rows : [];
  const cls = Array.isArray(problem.cells) ? problem.cells : [];

  return (
    <div className="bg-white border border-gray-300 rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-1">
            {parseMixedText(problem.question)}
          </h2>
          <p className="text-sm text-gray-600">Type: {problem.type}</p>
        </div>
        <button
          onClick={() => onDelete(problem.id)}
          className="text-red-500 hover:text-red-700 text-sm"
        >
          Delete
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="bg-indigo-50">
              <th className="border border-gray-300 px-4 py-2 text-gray-700 font-medium">
                {problem.rowHeaderLabel ?? ""}
              </th>
              {cols.map((colDef, ci) => {
                const headerText = colDef.name || "";
                // If the header contains any caret, treat it as LaTeX
                return (
                  <th
                    key={ci}
                    className="border border-gray-300 px-4 py-2 text-gray-700"
                  >
                    {headerText.trim().startsWith("$") &&
                    headerText.trim().endsWith("$") ? (
                      // Strip the surrounding $…$
                      <InlineMath math={headerText.trim().slice(1, -1)} />
                    ) : headerText.includes("^") ? (
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
                  className={ri % 2 === 0 ? "bg-white" : "bg-gray-50"}
                >
                  <th className="border px-4 py-2 text-gray-800 font-medium">
                    {label.trim().startsWith("$") &&
                    label.trim().endsWith("$") ? (
                      <InlineMath math={label.trim().slice(1, -1)} />
                    ) : label.includes("^") ? (
                      <InlineMath math={label} />
                    ) : (
                      label
                    )}
                  </th>

                  {cols.map((_, ci) => {
                    const rowCells = Array.isArray(cls[ri]) ? cls[ri] : [];
                    const cellValue = rowCells[ci] ?? "";

                    return (
                      <td key={ci} className="border px-4 py-2 text-gray-700">
                        {cellValue === "" ? (
                          <span className="text-gray-400">____</span>
                        ) : cellValue.trim().startsWith("$") &&
                          cellValue.trim().endsWith("$") ? (
                          <InlineMath math={cellValue.trim().slice(1, -1)} />
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
}
