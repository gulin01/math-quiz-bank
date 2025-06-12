"use client";

import { parseMixedText } from "@/app/_utils/parseMixedText";
import { useEffect, useRef } from "react";

type Problem = {
  id: string;
  type: string;
  question: string;
  answer?: string;
  answerType?: "text" | "latex" | "graph";
};

export function BlankProblemSolveView({
  problem,
  userAnswer,
  onAnswer,
}: {
  problem: Problem;
  userAnswer: string;
  onAnswer: (value: string) => void;
}) {
  const desmosRef = useRef<HTMLDivElement | null>(null);
  const calculatorRef = useRef<any>(null);

  const isGraphAnswer =
    problem.answerType === "graph" ||
    (typeof problem.answer === "string" && problem.answer.startsWith("graph:"));

  // --- Load Desmos and initialize when problem changes ---
  useEffect(() => {
    if (!isGraphAnswer || !desmosRef.current) return;

    const scriptId = "desmos-lib";
    const existingScript = document.getElementById(scriptId);

    if (existingScript && (window as any).Desmos) {
      initDesmos();
    } else if (!existingScript) {
      const script = document.createElement("script");
      script.id = scriptId;
      script.src =
        "https://www.desmos.com/api/v1.11/calculator.js?apiKey=dcb31709b452b1cf9dc26972add0fda6";
      script.async = true;
      script.onload = initDesmos;
      document.body.appendChild(script);
    }
  }, [problem.id]);

  // --- Reset user answer safely on new problem ---
  useEffect(() => {
    if (userAnswer !== "") {
      // Delay ensures safe reset, avoids loops
      setTimeout(() => {
        onAnswer("");
      }, 0);
    }
    // ONLY depend on problem.id to avoid unstable deps
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [problem.id]);

  // --- Initialize Desmos calculator ---
  const initDesmos = () => {
    if (!desmosRef.current) return;

    const Desmos = (window as any).Desmos;

    // Destroy previous calculator if it exists
    if (calculatorRef.current?.destroy) {
      calculatorRef.current.destroy();
    }

    calculatorRef.current = Desmos.GraphingCalculator(desmosRef.current, {
      expressions: true,
      keypad: true,
      settingsMenu: false,
    });

    // Start fresh
    calculatorRef.current.setExpressions([]);

    // Capture first input
    calculatorRef.current.observeEvent("change", () => {
      const expressions = calculatorRef.current.getExpressions();
      const firstLatex = expressions.find((e: any) => e.latex)?.latex;
      if (firstLatex) {
        onAnswer(`$${firstLatex}$`);
      }
    });
  };

  return (
    <div className="bg-white border border-gray-300 rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        {parseMixedText(problem.question)}
      </h2>

      {isGraphAnswer ? (
        <>
          <p className="text-sm text-gray-600 mb-2">
            Enter your answer directly in the graph below. The first expression
            you input will be recorded.
          </p>
          <div
            ref={desmosRef}
            className="w-full h-[300px] border rounded mb-4 bg-white"
          />
          <p className="text-xs text-gray-500 mt-2">
            Your current answer:{" "}
            <code className="bg-gray-100 px-2 py-1 rounded">
              {userAnswer || "—"}
            </code>
          </p>
        </>
      ) : (
        <>
          <p className="text-sm text-gray-600 mb-2">Type your answer below.</p>
          <input
            type="text"
            value={userAnswer ?? ""}
            onChange={(e) => onAnswer(e.target.value)}
            className="w-full border p-2 rounded text-gray-800"
            placeholder="정답을 입력하세요"
          />
        </>
      )}
    </div>
  );
}
