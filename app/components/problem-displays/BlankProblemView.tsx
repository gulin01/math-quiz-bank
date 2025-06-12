"use client";

import { parseMixedText } from "@/app/_utils/parseMixedText";
import { InlineMath } from "react-katex";
import { DesmosGraphView } from "../DesmosGraphView";

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
  const trimmed = ansRaw.trim();

  const isLatex = trimmed.startsWith("$") && trimmed.endsWith("$");
  const isCareted = !isLatex && trimmed.includes("^");

  const isGraph = trimmed.startsWith("graph:");

  const extractLatex = () =>
    isLatex ? trimmed.slice(1, -1) : isCareted ? trimmed : "";

  let graphState: any = null;

  if (isGraph) {
    try {
      const json = trimmed.slice(6); // after "graph:"
      const parsed = JSON.parse(json);
      graphState = parsed.graphState || parsed; // support both `{ graphState: {...} }` or `{...}`
    } catch (err) {
      console.warn("Invalid graph JSON", err);
    }
  }

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
        {isGraph && graphState ? (
          <div className="mt-4">
            <DesmosGraphView
              graphType="graphing"
              state={graphState}
              label="Graph Preview"
            />
          </div>
        ) : isLatex || isCareted ? (
          <>
            <InlineMath math={extractLatex()} />
            <div className="mt-2 text-xs text-gray-500">Parsed LaTeX</div>
          </>
        ) : trimmed ? (
          <span>{trimmed}</span>
        ) : (
          <span className="text-gray-400">No answer</span>
        )}
      </div>
    </div>
  );
}
