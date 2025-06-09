"use client";

import { useEffect, useRef } from "react";
import { InlineMath } from "react-katex";
import { parseMixedText } from "@/app/_utils/parseMixedText";

export type MCQOption = {
  text: string;
  type: "text" | "number" | "latex" | "desmos";
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

declare global {
  interface Window {
    Desmos: any;
  }
}

export function MCQProblemView({ problem, onDelete }: MCQProblemViewProps) {
  const desmosRefs = useRef<(HTMLDivElement | null)[]>([]);
  const calculators = useRef<any[]>([]);

  useEffect(() => {
    const loadDesmos = () => {
      if (typeof window !== "undefined" && !window.Desmos) {
        const script = document.createElement("script");
        script.src =
          "https://www.desmos.com/api/v1.11/calculator.js?apiKey=dcb31709b452b1cf9dc26972add0fda6";
        script.async = true;
        script.onload = () => initDesmos();
        document.body.appendChild(script);
      } else {
        initDesmos();
      }
    };

    const initDesmos = () => {
      problem.options.forEach((opt, idx) => {
        if (opt.type === "desmos") {
          const el = desmosRefs.current[idx];
          if (el && !calculators.current[idx]) {
            calculators.current[idx] = window.Desmos.GraphingCalculator(el, {
              expressions: true,
              keypad: false,
              settingsMenu: false,
              expressionsTopbar: false,
            });

            try {
              calculators.current[idx].setExpressions([]);
              calculators.current[idx].setExpression({
                id: `view-${idx}`,
                latex: opt.text,
              });
            } catch (err) {
              console.warn("Invalid Desmos expression in view", err);
            }
          }
        }
      });
    };

    loadDesmos();
  }, [problem.options]);

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

      <ul className="mt-4 list-disc list-inside text-gray-700 space-y-4">
        {problem.options.map((opt, i) => {
          const raw = opt.text?.trim() || "";
          const isWrapped = raw.startsWith("$") && raw.endsWith("$");
          const displayText = isWrapped ? raw.slice(1, -1) : raw;

          return (
            <li
              key={i}
              className={`${
                i === problem.correctOptionIndex
                  ? "text-green-600 font-semibold"
                  : ""
              }`}
            >
              {opt.type === "latex" || isWrapped ? (
                <InlineMath math={displayText} />
              ) : opt.type === "desmos" ? (
                <div
                  ref={(el) => {
                    desmosRefs.current[i] = el;
                  }}
                  className="w-full h-[300px] border rounded"
                />
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
