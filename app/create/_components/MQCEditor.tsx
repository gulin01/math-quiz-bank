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
    setOptions([...options, { text: "", type: "text" }]);
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

  console.log("MCQEditor options", options);

  return (
    <div className="mb-10 p-6 bg-gradient-to-br from-[#fdfbfb] to-[#ebedee] rounded-2xl shadow-xl font-pretendard">
      <label className="block font-bold text-lg mb-4 text-[#333]">
        객관식 보기 설정
      </label>

      {options.map((opt, idx) => (
        <div
          key={idx}
          className="flex flex-col gap-2 mb-6 border p-4 rounded-xl bg-white shadow-md"
        >
          <div className="flex items-center gap-3">
            <input
              type="radio"
              name="mcq"
              checked={correctIndex === idx}
              onChange={() => setCorrectIndex(idx)}
              className="accent-green-500"
            />

            <select
              value={opt.type}
              onChange={(e) =>
                updateOptionType(idx, e.target.value as MCQOption["type"])
              }
              className="border border-gray-300 rounded-md p-1 text-sm"
            >
              <option value="text">텍스트</option>
              <option value="number">숫자</option>
              <option value="latex">수식 (LaTeX)</option>
              <option value="desmos">그래프 (Desmos)</option>
            </select>

            <button
              onClick={() => removeOption(idx)}
              className="ml-auto text-red-500 hover:text-red-700 text-xl"
              title="이 보기 삭제"
            >
              ×
            </button>
          </div>

          <div className="w-full">
            {opt.type === "latex" ? (
              // @ts-ignore
              <math-field
                className="w-full h-12 border rounded-md p-2 bg-white"
                value={opt.text}
                virtual-keyboard-mode="onfocus"
                smart-mode
                onInput={(e: any) => updateOptionText(idx, e.target.getValue())}
              />
            ) : opt.type === "desmos" ? (
              <div
                ref={(el) => {
                  desmosRefs.current[idx] = el;
                }}
                className="w-full h-[300px] border rounded mt-2"
              ></div>
            ) : (
              <input
                type={opt.type}
                value={opt.text}
                onChange={(e) => updateOptionText(idx, e.target.value)}
                placeholder={`보기 ${idx + 1}`}
                className="w-full border p-2 rounded-md"
              />
            )}
          </div>
        </div>
      ))}

      <button
        onClick={addOption}
        className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl font-semibold shadow-md transition"
      >
        ➕ 보기 추가
      </button>
    </div>
  );
}
