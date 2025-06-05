// components/BlankProblemView.tsx
"use client";

import { parseMixedText } from "@/app/_utils/parseMixedText";
import { InlineMath } from "react-katex";

export type BlankProblem = {
  id: string;
  type: "FILL_IN_THE_BLANK";
  question: string;
  answer?: string;
};

interface BlankProblemViewProps {
  problem: BlankProblem;
  onDelete: (id: string) => void;
}

export function BlankProblemView({ problem, onDelete }: BlankProblemViewProps) {
  const ansRaw = problem.answer ?? "";

  // If answer is “$…$”, strip the dollar signs
  const isWrapped =
    ansRaw.trim().startsWith("$") && ansRaw.trim().endsWith("$");
  const inner = isWrapped ? ansRaw.trim().slice(1, -1) : ansRaw;

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

      <div className="mt-4 text-gray-700">
        <strong>Answer:</strong>{" "}
        {isWrapped ? (
          <InlineMath math={inner} />
        ) : inner.includes("^") ? (
          // If user typed LaTeX but forgot $…$, still try to render caret
          <InlineMath math={inner} />
        ) : (
          <span>
            {inner || <span className="text-gray-400">No answer</span>}
          </span>
        )}
      </div>
    </div>
  );
}
