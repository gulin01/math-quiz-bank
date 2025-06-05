// components/MCQProblemView.tsx
"use client";

import { parseMixedText } from "@/app/_utils/parseMixedText";
import { InlineMath } from "react-katex";

export type MCQOption = {
  text: string;
  type: "text" | "number" | "latex";
};

export type MCQProblem = {
  id: string;
  type: "MCQ_SINGLE";
  question: string;
  options: MCQOption[];
  correctOptionIndex: number;
};

interface MCQProblemViewProps {
  problem: MCQProblem;
  onDelete: (id: string) => void;
}

export function MCQProblemView({ problem, onDelete }: MCQProblemViewProps) {
  const opts = Array.isArray(problem.options) ? problem.options : [];

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

      <ul className="mt-4 list-disc list-inside text-gray-700">
        {opts.map((opt, i) => {
          const raw = opt.text || "";
          // If user wrapped with $…$, strip and show as math
          const isWrapped =
            raw.trim().startsWith("$") && raw.trim().endsWith("$");
          const displayText = isWrapped ? raw.trim().slice(1, -1) : raw;

          return (
            <li
              key={i}
              className={
                i === problem.correctOptionIndex
                  ? "text-green-600 font-semibold"
                  : ""
              }
            >
              {isWrapped ? (
                <InlineMath math={displayText} />
              ) : opt.type === "latex" ? (
                // If user’s opt.type is "latex" but forgot the $, still feed entire to InlineMath
                <InlineMath math={raw} />
              ) : (
                raw
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
