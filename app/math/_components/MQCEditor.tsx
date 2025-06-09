"use client";

import { useEffect, useRef } from "react";
import { MathfieldElement } from "mathlive";
import { extractDesmosID } from "@/app/_utils/extractDesmosID";

export type MCQOption = {
  text: string;
  type: "text" | "number" | "latex" | "desmos";
};

declare global {
  interface Window {
    Desmos: any;
  }
}

interface MCQEditorProps {
  options: MCQOption[];
  setOptions: (opts: MCQOption[]) => void;
  correctIndex: number;
  setCorrectIndex: (i: number) => void;
}

export function MCQEditor({
  options,
  setOptions,
  correctIndex,
  setCorrectIndex,
}: MCQEditorProps) {
  const desmosRefs = useRef<(HTMLDivElement | null)[]>([]);
  const calculators = useRef<any[]>([]);

  useEffect(() => {
    import("mathlive");

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
      options.forEach((opt, idx) => {
        const el = desmosRefs.current[idx];
        if (opt.type === "desmos" && el) {
          if (!calculators.current[idx]) {
            calculators.current[idx] = window.Desmos.GraphingCalculator(el, {
              expressions: true,
              keypad: true,
              settingsMenu: false,
            });
            calculators.current[idx].observeEvent("change", () => {
              const latex =
                calculators.current[idx].getExpressions()?.[0]?.latex || "";
              updateOptionText(idx, latex);
            });
          }

          try {
            calculators.current[idx].setExpressions([]);
            calculators.current[idx].setExpression({
              id: `expr-${idx}`,
              latex: opt.text,
            });
          } catch (err) {
            console.warn("Invalid Desmos expression", err);
          }
        }
      });
    };

    loadDesmos();
  }, [options.map((o) => `${o.type}-${o.text}`).join("|")]);

  const updateOptionText = (idx: number, newText: string) => {
    const updated = [...options];
    updated[idx] = { ...updated[idx], text: newText };
    setOptions(updated);

    if (updated[idx].type === "desmos" && calculators.current[idx]) {
      try {
        calculators.current[idx].setExpressions([]);
        calculators.current[idx].setExpression({
          id: `expr-${idx}`,
          latex: newText,
        });
      } catch (err) {
        console.warn("Failed to update Desmos expression", err);
      }
    }
  };

  const updateOptionType = (idx: number, newType: MCQOption["type"]) => {
    const updated = [...options];
    updated[idx] = { type: newType, text: "" };
    setOptions(updated);
  };

  const addOption = () => {
    const updatedOptions: MCQOption[] = [
      ...options,
      { text: "", type: "text" },
    ];
    setOptions(updatedOptions);
  };

  const removeOption = (idx: number) => {
    const arr = options.filter((_, i) => i !== idx);
    setOptions(arr);
    if (correctIndex === idx) {
      setCorrectIndex(0);
    } else if (correctIndex > idx) {
      setCorrectIndex(correctIndex - 1);
    }
  };

  console.log("MCQ Options", options);
  return (
    <div className="mb-10">
      <label className="block font-semibold mb-2 text-[#000]">
        MCQ Options
      </label>

      {options.map((opt, idx) => (
        <div key={idx} className="flex flex-col gap-2 mb-4">
          <div className="flex items-center space-x-2">
            <input
              type="radio"
              name="mcq"
              checked={correctIndex === idx}
              onChange={() => setCorrectIndex(idx)}
              className="mr-2"
            />

            <select
              value={opt.type}
              onChange={(e) =>
                updateOptionType(idx, e.target.value as MCQOption["type"])
              }
              className="border border-gray-300 rounded p-1"
            >
              <option value="text">Text</option>
              <option value="number">Number</option>
              <option value="latex">Math (LaTeX)</option>
              <option value="desmos">Desmos Graph</option>
            </select>

            <button
              onClick={() => removeOption(idx)}
              className="text-red-600 hover:text-red-800 ml-auto"
              title="Delete this option"
            >
              ×
            </button>
          </div>

          {opt.type === "latex" ? (
            // @ts-ignore: MathLive custom element
            <math-field
              className="w-full h-12 border rounded p-1"
              value={opt.text}
              virtual-keyboard-mode="onfocus"
              smart-mode
              onInput={(e: any) => {
                const newText = e.target.getValue();
                updateOptionText(idx, newText);
              }}
            ></math-field>
          ) : opt.type === "desmos" ? (
            <div className="flex flex-col">
              <div
                ref={(el) => {
                  desmosRefs.current[idx] = el;
                }}
                className="w-full h-[300px] border rounded mt-2"
              ></div>
            </div>
          ) : (
            <input
              type={opt.type}
              value={opt.text}
              onChange={(e) => updateOptionText(idx, e.target.value)}
              placeholder={`Option ${idx + 1}`}
              className="border p-2 rounded"
            />
          )}
        </div>
      ))}

      <button
        onClick={addOption}
        className="mt-2 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
      >
        + Add Option
      </button>
    </div>
  );
}
