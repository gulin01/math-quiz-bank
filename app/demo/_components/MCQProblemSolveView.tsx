// components/solve-views/MCQProblemSolveView.tsx
"use client";

import { useEffect, useRef } from "react";
import { InlineMath } from "react-katex";
import { parseMixedText } from "@/app/_utils/parseMixedText";

export function MCQProblemSolveView({
  problem,
  userAnswer,
  onAnswer,
}: {
  problem: any;
  userAnswer: number | null;
  onAnswer: (index: number) => void;
}) {
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

    console.log(problem);

    const initDesmos = () => {
      problem.options.forEach((opt: any, idx: number) => {
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
    <div className="bg-white border border-gray-300 rounded-2xl shadow-md p-6 font-pretendard">
      <h2 className="text-3xl font-bold text-indigo-700 mb-6">
        {parseMixedText(problem.question)}
      </h2>

      <ul className="space-y-4">
        {problem.options.map((opt: any, i: number) => {
          const raw = opt.text?.trim() || "";
          const isWrapped = raw.startsWith("$") && raw.endsWith("$");
          const displayText = isWrapped ? raw.slice(1, -1) : raw;

          return (
            <li
              key={i}
              className={`p-4 rounded-xl border flex items-center gap-3 transition cursor-pointer hover:shadow-md ${
                userAnswer === i
                  ? "bg-indigo-100 border-indigo-500"
                  : "bg-gray-50 border-gray-300"
              }`}
              onClick={() => onAnswer(i)}
            >
              <input
                type="radio"
                name={problem.id}
                value={i}
                checked={userAnswer === i}
                onChange={() => onAnswer(i)}
                className="accent-indigo-500"
              />
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
                <span className="text-gray-800 text-base">{raw}</span>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
