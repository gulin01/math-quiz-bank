// components/FillBlankEditor.tsx
"use client";

import { useEffect, useState } from "react";

interface FillBlankEditorProps {
  /** The initial answer string (may include LaTeX) */
  initialAnswer: string;

  /**
   * Called whenever the user changes their answer text (raw string including any `$…$`).
   * Dashboard will keep a mirror copy in its own state.
   */
  onChange: (answer: string) => void;
}

export function FillBlankEditor({
  initialAnswer,
  onChange,
}: FillBlankEditorProps) {
  //
  // ─── 1) If you want to allow LaTeX for the “answer” field,
  //     we'll load MathLive (just like in TableEditor/MCQEditor).
  //
  useEffect(() => {
    import("mathlive");
  }, []);

  //
  // ─── 2) Local state for the answer string.
  //     Could be plain text like "42" or a LaTeX snippet wrapped in `$…$`.
  //
  const [answer, setAnswer] = useState<string>(initialAnswer);

  //
  // ─── 3) Whenever `answer` changes, notify parent:
  //
  useEffect(() => {
    onChange(answer);
  }, [answer]);

  //
  // ─── 4) We’ll let the user type either in a regular input
  //     or (optionally) in a MathLive `<math-field>` if you expect LaTeX.
  //     For a simple text‐only blank, you could omit `<math-field>` entirely.
  //
  //     Below: we give them a toggle between “Text” vs “Math (LaTeX)”.
  //
  const [mode, setMode] = useState<"text" | "latex">("text");

  return (
    <div className="mb-6 border border-gray-300 p-4 rounded bg-gray-50">
      <label className="block font-semibold mb-2">
        Fill‐in‐the‐Blank Answer
      </label>
      <div className="flex items-center mb-4">
        <span className="mr-2 font-medium">Mode:</span>
        <select
          value={mode}
          onChange={(e) => setMode(e.target.value as "text" | "latex")}
          className="border border-gray-300 p-1 rounded"
        >
          <option value="text">Text</option>
          <option value="latex">Math (LaTeX)</option>
        </select>
      </div>

      {mode === "latex" ? (
        <>
          {/* ─── MathLive Editor ───────────────────────────────────────────────── */}
          <p className="text-sm text-gray-600 mb-2">
            Enter your answer as raw LaTeX (it will be wrapped in `$…$` when
            saved).
          </p>
          {/* @ts-ignore: MathLive custom element */}
          <math-field
            className="w-full h-12 border rounded p-1 mb-2"
            value={
              // strip surrounding $ if the parent passed one
              answer.startsWith("$") && answer.endsWith("$")
                ? answer.slice(1, -1)
                : answer
            }
            virtual-keyboard-mode="onfocus"
            smart-mode
            onInput={(e: any) => {
              const latexInside = e.target.getValue() as string;
              // we’ll always store it as `$…$` so Dashboard receives a valid math snippet
              setAnswer(`$${latexInside}$`);
            }}
          />
        </>
      ) : (
        <>
          {/* ─── Plain Text Editor ─────────────────────────────────────────────── */}
          <p className="text-sm text-gray-600 mb-2">
            Enter your answer as plain text (no LaTeX).
          </p>
          <input
            type="text"
            value={
              // if the parent gave us a LaTeX‐wrapped string, strip the `$…$`
              answer.startsWith("$") && answer.endsWith("$")
                ? answer.slice(1, -1)
                : answer
            }
            onChange={(e) => setAnswer(e.target.value)}
            className="w-full border p-2 rounded text-center"
            placeholder="Type the correct answer here"
          />
        </>
      )}
    </div>
  );
}
