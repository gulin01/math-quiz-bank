"use client";
import "katex/dist/katex.min.css";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { InlineMath } from "react-katex";
import { parseMixedText } from "../_utils/parseMixedText";
import { MathfieldElement } from "mathlive";

/**
 * Problem‐type definitions (must match exactly what you stored in sessionStorage)
 */
type ColumnDefinition = {
  name: string;
  type: "text" | "number" | "latex";
};

type TableProblem = {
  id: string;
  type: "TABLE_FILL_CELLS";
  question: string;
  columns: ColumnDefinition[];
  rows: string[];
  cells: string[][];
  rowHeaderLabel?: string;
};

type MCQOption = {
  text: string;
  type: "text" | "number" | "latex";
};

type MCQProblem = {
  id: string;
  type: "MCQ_SINGLE";
  question: string;
  options: MCQOption[];
  correctOptionIndex: number;
};

type BlankProblem = {
  id: string;
  type: "FILL_IN_THE_BLANK";
  question: string;
  answer?: string;
};

type AnyProblem = TableProblem | MCQProblem | BlankProblem;

/**
 * When testing, we need local “user answers” for each problem. We’ll keep
 * separate state for each type:
 *
 * - For TABLE_FILL_CELLS: a 2D array of strings, same dimensions as problem.cells.
 * - For MCQ_SINGLE: a single selected‐index (number) or null if none chosen yet.
 * - For FILL_IN_THE_BLANK: a single string answer.
 */
type TableUserAnswers = string[][];
type MCQUserAnswer = number | null;
type BlankUserAnswer = string;

/**
 * Main “TestQuestions” component
 */
export default function QuestionPreview({
  setView,
}: {
  setView: (view: string) => void;
}) {
  const [problems, setProblems] = useState<AnyProblem[]>([]);
  // For each problem ID, we store the user’s answer:
  // - If it’s a table, we store a 2D array of user inputs.
  // - If it’s MCQ, we store the chosen index or null.
  // - If it’s blank, we store a string.
  const [tableAnswers, setTableAnswers] = useState<
    Record<string, TableUserAnswers>
  >({});
  const [mcqAnswers, setMcqAnswers] = useState<Record<string, MCQUserAnswer>>(
    {}
  );
  const [blankAnswers, setBlankAnswers] = useState<
    Record<string, BlankUserAnswer>
  >({});

  // Once we’ve loaded “problems” from sessionStorage, we initialize our “user answer” states.
  useEffect(() => {
    const stored = sessionStorage.getItem("problems");
    if (stored) {
      let parsed: AnyProblem[] = [];
      try {
        parsed = JSON.parse(stored);
      } catch {
        parsed = [];
      }
      setProblems(parsed);

      // Initialize answer‐state for each problem
      const tAns: Record<string, TableUserAnswers> = {};
      const mAns: Record<string, MCQUserAnswer> = {};
      const bAns: Record<string, BlankUserAnswer> = {};

      parsed.forEach((p) => {
        if (p.type === "TABLE_FILL_CELLS") {
          const tbl = p as TableProblem;
          // Create an empty 2D array with same dimensions as tbl.cells
          const dims = tbl.cells.map((row) => row.map(() => ""));
          tAns[p.id] = dims;
        } else if (p.type === "MCQ_SINGLE") {
          mAns[p.id] = null; // not selected yet
        } else {
          bAns[p.id] = ""; // empty string initial
        }
      });

      setTableAnswers(tAns);
      setMcqAnswers(mAns);
      setBlankAnswers(bAns);
    }
  }, []);

  // If you want MathLive for FILL_IN_THE_BLANK answers, load it once:
  useEffect(() => {
    import("mathlive");
  }, []);

  /**
   * When “Check Answers” is clicked, iterate each problem, compare user input vs stored “correct”,
   * and tally how many correct out of total.
   */
  const [scoreMessage, setScoreMessage] = useState<string | null>(null);

  const checkAllAnswers = () => {
    let total = problems.length;
    let correctCount = 0;

    problems.forEach((p) => {
      if (p.type === "TABLE_FILL_CELLS") {
        const tbl = p as TableProblem;
        const userGrid = tableAnswers[p.id];
        let allMatch = true;

        // Compare each cell: userGrid[ri][ci] === tbl.cells[ri][ci]
        for (let ri = 0; ri < tbl.rows.length; ri++) {
          for (let ci = 0; ci < tbl.columns.length; ci++) {
            const storedVal = (tbl.cells[ri]?.[ci] ?? "").trim();
            const userVal = (userGrid?.[ri]?.[ci] ?? "").trim();
            if (storedVal !== userVal) {
              allMatch = false;
              break;
            }
          }
          if (!allMatch) break;
        }
        if (allMatch) correctCount++;
      } else if (p.type === "MCQ_SINGLE") {
        const mcq = p as MCQProblem;
        const chosen = mcqAnswers[p.id];
        if (chosen === mcq.correctOptionIndex) correctCount++;
      } else {
        const blank = p as BlankProblem;
        const userVal = (blankAnswers[p.id] ?? "").trim();
        // If stored answer is wrapped in $…$, strip for comparison:
        const raw = blank.answer ?? "";
        const isWrapped =
          raw.trim().startsWith("$") && raw.trim().endsWith("$");
        const correctInner = isWrapped ? raw.trim().slice(1, -1) : raw;
        if (userVal === correctInner.trim()) correctCount++;
      }
    });

    setScoreMessage(`You got ${correctCount} out of ${total} correct.`);
  };

  if (problems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
        <p className="text-gray-500 text-lg">No problems to test.</p>
        <Link href="/" className="mt-4 text-blue-600 hover:underline">
          ← Go back
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <header className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-extrabold text-gray-800">
            📝 Test Your Questions
          </h1>
          <Link href="/" className="text-blue-600 hover:underline">
            ← Back to Question List
          </Link>
        </header>

        <div className="space-y-8">
          {problems.map((p) => {
            if (p.type === "TABLE_FILL_CELLS") {
              const tbl = p as TableProblem;
              const userGrid = tableAnswers[p.id] || []; // string[][]

              return (
                <div
                  key={tbl.id}
                  className="bg-white border border-gray-300 rounded-lg shadow-sm p-6"
                >
                  <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                    {parseMixedText(tbl.question)}
                  </h2>
                  <p className="text-sm text-gray-600 mb-4">
                    (Table Fill Cells)
                  </p>
                  <div className="overflow-x-auto">
                    <table className="w-full table-auto border-collapse">
                      <thead>
                        <tr className="bg-indigo-50">
                          <th className="border border-gray-300 px-4 py-2 text-gray-700 font-medium">
                            {tbl.rowHeaderLabel ?? ""}
                          </th>
                          {tbl.columns.map((colDef, ci) => (
                            <th
                              key={ci}
                              className="border border-gray-300 px-4 py-2 text-gray-700"
                            >
                              {colDef.name}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {tbl.rows.map((rowLabel, ri) => (
                          <tr
                            key={ri}
                            className={ri % 2 === 0 ? "bg-white" : "bg-gray-50"}
                          >
                            <th className="border px-4 py-2 text-gray-800 font-medium">
                              {rowLabel}
                            </th>
                            {tbl.columns.map((_, ci) => {
                              // Ensure userGrid has a row array:
                              const rowArr = Array.isArray(userGrid[ri])
                                ? userGrid[ri]
                                : [];
                              const userCellValue = rowArr[ci] ?? "";

                              return (
                                <td
                                  key={ci}
                                  className="border px-4 py-2 text-gray-700"
                                >
                                  <input
                                    type="text"
                                    value={userCellValue}
                                    onChange={(e) => {
                                      const newVal = e.target.value;
                                      setTableAnswers((prev) => {
                                        // clone
                                        const next = { ...prev };
                                        const gridCopy = (
                                          next[tbl.id] || []
                                        ).map((r) => [...r]);
                                        // if it wasn’t defined yet, initialize
                                        if (!Array.isArray(gridCopy[ri])) {
                                          gridCopy[ri] = Array(
                                            tbl.columns.length
                                          ).fill("");
                                        }
                                        gridCopy[ri][ci] = newVal;
                                        next[tbl.id] = gridCopy;
                                        return next;
                                      });
                                    }}
                                    className="w-full border p-1 rounded text-center"
                                    placeholder="…"
                                  />
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            } else if (p.type === "MCQ_SINGLE") {
              const mcq = p as MCQProblem;
              const chosen = mcqAnswers[p.id]; // number|null

              return (
                <div
                  key={mcq.id}
                  className="bg-white border border-gray-300 rounded-lg shadow-sm p-6"
                >
                  <h2 className="text-2xl font-semibold text-gray-800 mb-2 text-[#000]">
                    {parseMixedText(mcq.question)}
                  </h2>
                  <p className="text-sm text-gray-600 mb-4">
                    (Multiple Choice)
                  </p>
                  <div className="space-y-2">
                    {mcq.options.map((opt, i) => {
                      const raw = opt.text || "";
                      const isWrapped =
                        raw.trim().startsWith("$") && raw.trim().endsWith("$");
                      const displayMath = isWrapped
                        ? raw.trim().slice(1, -1)
                        : raw;

                      return (
                        <label key={i} className="flex items-center space-x-2">
                          <input
                            type="radio"
                            name={`mcq-${mcq.id}`}
                            checked={chosen === i}
                            onChange={() => {
                              setMcqAnswers((prev) => ({
                                ...prev,
                                [mcq.id]: i,
                              }));
                            }}
                          />
                          <span className="text-[#000]">
                            {isWrapped ? (
                              <InlineMath math={displayMath} />
                            ) : opt.type === "latex" ? (
                              <InlineMath math={raw} />
                            ) : (
                              raw
                            )}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              );
            } else {
              // FILL_IN_THE_BLANK
              const blank = p as BlankProblem;
              const userAns = blankAnswers[p.id] ?? "";

              // If stored answer is wrapped in $…$, strip it for comparison, but show an input for user.
              // We’ll let them type either plain text or LaTeX (no wrapper needed).
              return (
                <div
                  key={blank.id}
                  className="bg-white border border-gray-300 rounded-lg shadow-sm p-6"
                >
                  <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                    {parseMixedText(blank.question)}
                  </h2>
                  <p className="text-sm text-gray-600 mb-4">
                    (Fill in the Blank)
                  </p>

                  <div className="space-y-2">
                    <label className="block text-gray-700">Your Answer:</label>
                    {/* @ts-ignore */}
                    <math-field
                      className="w-full h-10 border p-2 rounded"
                      value={
                        userAns.startsWith("$") && userAns.endsWith("$")
                          ? userAns.slice(1, -1)
                          : userAns
                      }
                      virtual-keyboard-mode="onfocus"
                      smart-mode
                      onInput={(e: any) => {
                        const latexInside = e.target.getValue() as string;
                        // Wrap it in $…$ so we can compare later
                        setBlankAnswers((prev) => ({
                          ...prev,
                          [blank.id]: `$${latexInside}$`,
                        }));
                      }}
                    />
                    <p className="text-sm text-gray-500">
                      (Type plain text or LaTeX without dollar signs; it will be
                      wrapped automatically.)
                    </p>
                  </div>
                </div>
              );
            }
          })}
        </div>

        {/* ─── Check Answers Button & Score ─────────────────────────────────── */}
        <div className="mt-8 flex flex-col items-center">
          <button
            onClick={checkAllAnswers}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded"
          >
            Check Answers
          </button>
          {scoreMessage && (
            <p className="mt-4 text-xl font-semibold text-gray-800">
              {scoreMessage}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
