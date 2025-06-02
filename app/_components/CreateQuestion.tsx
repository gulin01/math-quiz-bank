// pages/create.tsx or app/create/page.tsx
"use client";
import "katex/dist/katex.min.css";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ColumnDefinition, TableEditor } from "./CreateTableProblem";
import { MCQEditor, MCQOption } from "./MQCEditor";
import { parseMixedText } from "../_utils/parseMixedText";

// ProblemType union
type ProblemType = "TABLE_FILL_CELLS" | "MCQ_SINGLE" | "FILL_IN_THE_BLANK";

export default function CreateQuestion() {
  const router = useRouter();

  // 1) Load MathLive & configure fontsDirectory
  useEffect(() => {
    import("mathlive").then((ml) => {
      (ml as any).default.configure({
        fontsDirectory: "/fonts/mathlive",
      });
    });
  }, []);

  // ─── Common State ─────────────────────────────────────────────────────────────
  // question can contain plain text plus $…$ sections
  const [question, setQuestion] = useState<string>(
    "Example: Solve for x: $x^2 + 3x + 2 = 0$"
  );
  const [type, setType] = useState<ProblemType>("TABLE_FILL_CELLS");

  // ─── TABLE_FILL_CELLS State ───────────────────────────────────────────────────
  const [columns, setColumns] = useState<ColumnDefinition[]>([
    { name: "Column 1", type: "text" },
    { name: "Column 2", type: "text" },
  ]);
  const [rows, setRows] = useState<string[]>(["Row 1", "Row 2"]);
  const [cells, setCells] = useState<string[][]>(
    rows.map(() => columns.map(() => ""))
  );
  const [rowHeaderLabel, setRowHeaderLabel] = useState<string>("Row");

  // ─── MCQ State ───────────────────────────────────────────────────────────────
  const [mcqOptions, setMcqOptions] = useState<MCQOption[]>([
    { text: "", type: "text" },
  ]);
  const [correctOptionIndex, setCorrectOptionIndex] = useState<number>(0);

  // ─── Fill-in-the-Blank State ─────────────────────────────────────────────────
  const [blankAnswer, setBlankAnswer] = useState<string>("");

  // ─── Synchronize cells when columns/rows change ─────────────────────────────
  useEffect(() => {
    const newCells = rows.map((_, rIdx) =>
      columns.map((_, cIdx) => cells[rIdx]?.[cIdx] ?? "")
    );
    setCells(newCells);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [columns, rows]);

  // ─── MathLive Inline Editor State ────────────────────────────────────────────
  const [showMathEditor, setShowMathEditor] = useState<boolean>(false);
  const [mathInput, setMathInput] = useState<string>(""); // the raw LaTeX inside math-field
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Helper: Insert `$mathInput$` into the textarea at cursor position
  const insertMathAtCursor = () => {
    const ta = textareaRef.current;
    if (!ta) return;

    const start = ta.selectionStart;
    const end = ta.selectionEnd;

    const before = question.slice(0, start);
    const after = question.slice(end);
    const combined = `${before}$${mathInput}$${after}`;

    setQuestion(combined);
    setMathInput("");
    setShowMathEditor(false);

    // After updating state, restore focus & move cursor to right after the inserted math
    setTimeout(() => {
      if (!ta) return;
      ta.focus();
      const newPos = before.length + mathInput.length + 2; // +2 for the two '$'
      ta.setSelectionRange(newPos, newPos);
    }, 0);
  };

  // ─── Handle Submit: Build payload & save to sessionStorage ─────────────────
  const handleSubmit = () => {
    const id = Date.now().toString();
    const payload: any = { id, type, question };

    if (type === "TABLE_FILL_CELLS") {
      payload.columns = columns;
      payload.rows = rows;
      payload.cells = cells;
      payload.rowHeaderLabel = rowHeaderLabel;
    } else if (type === "MCQ_SINGLE") {
      payload.options = mcqOptions;
      payload.correctOptionIndex = correctOptionIndex;
    } else {
      payload.answer = blankAnswer;
    }

    const existing = sessionStorage.getItem("problems");
    const list = existing ? JSON.parse(existing) : [];
    list.push(payload);
    sessionStorage.setItem("problems", JSON.stringify(list));

    router.push("/");
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 p-10 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">📝 Create a New Question</h1>
      <Link href="/" className="text-blue-600 underline mb-6 block">
        ← Back to Question List
      </Link>

      {/* ─── Problem Type Selector ──────────────────────────────────────────────── */}
      <div className="mb-6">
        <label className="block font-semibold mb-2">Select Problem Type</label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value as ProblemType)}
          className="border border-gray-300 p-2 rounded w-full"
        >
          <option value="TABLE_FILL_CELLS">Table Fill Cells</option>
          <option value="MCQ_SINGLE">Multiple Choice</option>
          <option value="FILL_IN_THE_BLANK">Fill in the Blank</option>
        </select>
      </div>

      {/* ─── Question Prompt (Mixed Plain + LaTeX) ─────────────────────────────── */}
      <div className="mb-6">
        <label className="block font-semibold mb-2">Question Prompt</label>

        {/* 1) Button to show the MathLive editor */}
        <button
          onClick={() => setShowMathEditor(true)}
          className="mb-2 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
        >
          + Insert Math
        </button>

        {/* 2) Textarea for plain text + $…$ (LaTeX) */}
        <textarea
          ref={textareaRef}
          rows={4}
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="w-full border p-2 rounded font-mono"
          placeholder="e.g. Solve for x: $x^2 + 3x + 2 = 0$ and then find $x+1$."
        />

        <p className="mt-1 text-sm text-gray-500">
          You can mix plain text with LaTeX by inserting math via the “+ Insert
          Math” button. Final result will be wrapped in `$…$`.
        </p>
      </div>

      {/* ─── MathLive Editor Panel ─────────────────────────────────────────────── */}
      {showMathEditor && (
        <div className="mb-6 border border-gray-300 p-4 rounded bg-gray-50">
          <label className="block font-semibold mb-2">Enter LaTeX</label>
          {/* @ts-ignore: MathLive custom element */}
          <math-field
            className="w-full h-12 border rounded p-1 mb-2"
            value={mathInput}
            virtual-keyboard-mode="onfocus"
            smart-mode
            onInput={(e: any) => setMathInput(e.target.getValue())}
          ></math-field>

          <div className="flex gap-2">
            <button
              onClick={insertMathAtCursor}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded"
            >
              Insert Math
            </button>
            <button
              onClick={() => {
                setShowMathEditor(false);
                setMathInput("");
              }}
              className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-1 rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* ─── Live Preview of Mixed Prompt ──────────────────────────────────────── */}
      <div className="mb-6">
        <label className="block font-semibold mb-2">Preview</label>
        <div className="min-h-[3rem] border border-gray-300 p-3 rounded bg-gray-50">
          {parseMixedText(question)}
        </div>
      </div>

      {/* ─── Table Editor (if selected) ────────────────────────────────────────── */}
      {type === "TABLE_FILL_CELLS" && (
        <div className="mb-6">
          <TableEditor
            columns={columns}
            setColumns={setColumns}
            rows={rows}
            setRows={setRows}
            cells={cells}
            setCells={setCells}
            rowHeaderLabel={rowHeaderLabel}
            setRowHeaderLabel={setRowHeaderLabel}
          />
        </div>
      )}

      {/* ─── MCQ Editor (if selected) ─────────────────────────────────────────── */}
      {type === "MCQ_SINGLE" && (
        <div className="mb-6">
          <MCQEditor
            options={mcqOptions}
            setOptions={setMcqOptions}
            correctIndex={correctOptionIndex}
            setCorrectIndex={setCorrectOptionIndex}
          />
        </div>
      )}

      {/* ─── Fill-in-the-Blank Editor (if selected) ───────────────────────────── */}
      {type === "FILL_IN_THE_BLANK" && (
        <div className="mb-6">
          <label className="block font-semibold mb-2">Blank Answer</label>
          <input
            type="text"
            value={blankAnswer}
            onChange={(e) => setBlankAnswer(e.target.value)}
            className="w-full border p-2 rounded"
            placeholder="Enter the correct answer"
          />
        </div>
      )}

      {/* ─── Submit Button ───────────────────────────────────────────────────── */}
      <button
        onClick={handleSubmit}
        className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded"
      >
        Save and Go to List
      </button>
    </div>
  );
}
