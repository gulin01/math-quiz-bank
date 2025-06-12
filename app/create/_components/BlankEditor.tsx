"use client";

import { useEffect, useRef, useState } from "react";

type Mode = "text" | "latex" | "graph";

interface FillBlankEditorProps {
  initialAnswer: { answer: string; answerType: string };
  onChange: (answer: { answer: string; answerType: string }) => void;
}

export function FillBlankEditor({
  initialAnswer,
  onChange,
}: FillBlankEditorProps) {
  const [answer, setAnswer] = useState<{
    answer: string;
    answerType: string;
  }>(initialAnswer);

  const [mode, setMode] = useState<Mode>(
    (initialAnswer.answerType as Mode) || "text"
  );

  const desmosRef = useRef<HTMLDivElement | null>(null);
  const calculatorRef = useRef<any>(null);

  useEffect(() => {
    onChange(answer);
  }, [answer]);

  useEffect(() => {
    if (mode === "latex") {
      import("mathlive");
    }
  }, [mode]);

  useEffect(() => {
    if (mode !== "graph" || !desmosRef.current) return;

    const scriptId = "desmos-script-graph";
    if (document.getElementById(scriptId)) {
      initDesmos();
      return;
    }

    const script = document.createElement("script");
    script.id = scriptId;
    script.src =
      "https://www.desmos.com/api/v1.11/calculator.js?apiKey=dcb31709b452b1cf9dc26972add0fda6";
    script.async = true;
    script.onload = initDesmos;
    document.body.appendChild(script);
  }, [mode]);

  const initDesmos = () => {
    if (!desmosRef.current || calculatorRef.current) return;
    const Desmos = (window as any).Desmos;
    calculatorRef.current = Desmos.GraphingCalculator(desmosRef.current, {
      expressions: true,
      keypad: true,
    });
  };

  const handleInsertFromGraph = () => {
    if (
      calculatorRef.current?.getExpressions &&
      calculatorRef.current?.getState
    ) {
      const expressions = calculatorRef.current.getExpressions();
      const firstLatex = expressions.find((e: any) => e.latex)?.latex;
      const graphState = calculatorRef.current.getState();

      if (firstLatex && graphState) {
        setAnswer({
          answer: `graph:${JSON.stringify({
            graphState,
            graphType: "graphing",
          })}`,
          answerType: "graph",
        });
      }
    }
  };

  const handleModeChange = (newMode: Mode) => {
    setMode(newMode);
    setAnswer((prev) => ({
      ...prev,
      answerType: newMode,
    }));
  };

  return (
    <div className="mb-6 border border-gray-300 p-4 rounded bg-gray-50">
      <label className="block font-semibold mb-2">
        Fill‐in‐the‐Blank Answer
      </label>

      <div className="flex items-center mb-4">
        <span className="mr-2 font-medium">Mode:</span>
        <select
          value={mode}
          onChange={(e) => handleModeChange(e.target.value as Mode)}
          className="border border-gray-300 p-1 rounded"
        >
          <option value="text">Text</option>
          <option value="latex">Math (LaTeX)</option>
          <option value="graph">Desmos (Graph)</option>
        </select>
      </div>

      {mode === "latex" && (
        <>
          <p className="text-sm text-gray-600 mb-2">
            Enter LaTeX (wrapped in $...$).
          </p>
          {/* @ts-ignore */}
          <math-field
            className="w-full h-12 border rounded p-1 mb-2"
            value={
              answer.answer.startsWith("$")
                ? answer.answer.slice(1, -1)
                : answer.answer
            }
            virtual-keyboard-mode="onfocus"
            smart-mode
            onInput={(e: any) =>
              setAnswer({
                answer: `$${e.target.getValue()}$`,
                answerType: "latex",
              })
            }
          />
        </>
      )}

      {mode === "text" && (
        <>
          <p className="text-sm text-gray-600 mb-2">Plain text answer.</p>
          <input
            type="text"
            value={answer.answer}
            onChange={(e) =>
              setAnswer({ answer: e.target.value, answerType: "text" })
            }
            className="w-full border p-2 rounded text-center"
            placeholder="Type the correct answer here"
          />
        </>
      )}

      {mode === "graph" && (
        <>
          <p className="text-sm text-gray-600 mb-2">
            Graph your answer below. First expression will be used and saved.
          </p>
          <div
            ref={desmosRef}
            className="w-full h-[300px] border rounded bg-white shadow mb-3"
          />
          <button
            onClick={handleInsertFromGraph}
            className="bg-blue-600 text-white px-3 py-1 rounded shadow"
          >
            ➕ Insert Graph Expression
          </button>
        </>
      )}
    </div>
  );
}
