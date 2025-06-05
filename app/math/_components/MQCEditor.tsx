// components/MCQEditor.tsx
"use client";

import { useEffect } from "react";
import { MathfieldElement } from "mathlive";

export type MCQOption = {
  text: string;
  type: "text" | "number" | "latex";
};

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
  // MathLive custom element 로딩
  useEffect(() => {
    import("mathlive");
  }, []);

  const updateOptionText = (idx: number, newText: string) => {
    const arr = [...options];
    arr[idx] = { ...arr[idx], text: newText };
    setOptions(arr);
  };

  const updateOptionType = (idx: number, newType: MCQOption["type"]) => {
    const arr = [...options];
    arr[idx] = { ...arr[idx], type: newType, text: "" };
    setOptions(arr);
  };

  const addOption = () => {
    setOptions([...options, { text: "", type: "text" }]);
  };

  const removeOption = (idx: number) => {
    const arr = options.filter((_, i) => i !== idx);
    setOptions(arr);
    // 만약 삭제된 옵션이 정답인덱스라면 0으로 초기화
    if (correctIndex === idx) {
      setCorrectIndex(0);
    } else if (correctIndex > idx) {
      setCorrectIndex(correctIndex - 1);
    }
  };

  return (
    <div className="mb-10 ">
      <label className="block font-semibold mb-2 text-[#000]">
        MCQ Options
      </label>

      {options.map((opt, idx) => (
        <div key={idx} className="flex items-center mb-4 space-x-2">
          {/* 1) 라디오 버튼: 정답 선택 */}
          <input
            type="radio"
            name="mcq"
            checked={correctIndex === idx}
            onChange={() => setCorrectIndex(idx)}
            className="mr-2"
          />

          {/* 2) 옵션 타입 선택 드롭다운 */}
          <select
            value={opt.type}
            onChange={(e) =>
              updateOptionType(idx, e.target.value as MCQOption["type"])
            }
            className="border border-gray-300 rounded p-1"
          >
            <option value="string">Text</option>
            <option value="number">Number</option>
            <option value="latex">Math (LaTeX)</option>
          </select>

          {/* 3) 실제 옵션 입력 필드: type에 따라 다르게 렌더 */}
          {opt.type === "latex" ? (
            // @ts-ignore: MathLive custom element
            <math-field
              className="w-full h-12 border rounded p-1"
              value={opt.text}
              virtual-keyboard-mode="onfocus"
              smart-mode
              onInput={(e: any) => updateOptionText(idx, e.target.getValue())}
            ></math-field>
          ) : (
            <input
              type={opt.type} // 이제 opt.type이 "text" 또는 "number"로 지정되어야 합니다.
              value={opt.text}
              onChange={(e) => updateOptionText(idx, e.target.value)}
              placeholder={`Option ${idx + 1}`}
              className="border p-2 rounded flex-1"
            />
          )}

          {/* 4) 옵션 삭제 버튼 */}
          <button
            onClick={() => removeOption(idx)}
            className="text-red-600 hover:text-red-800"
            title="Delete this option"
          >
            ×
          </button>
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
