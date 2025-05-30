"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MathfieldElement } from "mathlive";
import { TableEditor } from "./(components)/CreateTableProblem";

type ProblemType = "TABLE_FILL_CELLS" | "MCQ_SINGLE" | "FILL_IN_THE_BLANK";

export default function CreateProblem() {
  const router = useRouter();
  const [question, setQuestion] = useState("Please answer the question below:");
  const [type, setType] = useState<ProblemType>("TABLE_FILL_CELLS");

  // TABLE_FILL_CELLS state
  const [columns, setColumns] = useState<string[]>(["Column 1", "Column 2"]);
  const [rows, setRows] = useState<string[]>(["Row 1", "Row 2"]);
  const [cells, setCells] = useState<string[][]>(
    rows.map(() => columns.map(() => ""))
  );

  // MCQ state
  const [mcqOptions, setMcqOptions] = useState<string[]>([""]);
  const [correctOptionIndex, setCorrectOptionIndex] = useState<number>(0);

  // Blank state
  const [blankAnswer, setBlankAnswer] = useState<string>("");

  const handleSubmit = () => {
    // build payload
    const id = Date.now().toString();
    const payload: any = { id, type, question };

    if (type === "TABLE_FILL_CELLS") {
      payload.columns = columns;
      payload.rows = rows;
      payload.cells = cells;
    } else if (type === "MCQ_SINGLE") {
      payload.options = mcqOptions;
      payload.correctOptionIndex = correctOptionIndex;
    } else {
      payload.answer = blankAnswer;
    }

    // get existing list from sessionStorage
    const existing = sessionStorage.getItem("problems");
    const list = existing ? JSON.parse(existing) : [];
    list.push(payload);
    sessionStorage.setItem("problems", JSON.stringify(list));

    // redirect back to list
    router.push("/");
  };

  // ensure cells stays in sync when rows/columns change
  useEffect(() => {
    const newCells = rows.map((_, r) =>
      columns.map((_, c) => cells[r]?.[c] ?? "")
    );
    setCells(newCells);
  }, [columns, rows]);

  return (
    <div className="min-h-screen bg-white text-gray-900 p-10 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">📝 새 문제 만들기</h1>
      <Link href="/" className="text-blue-600 underline mb-6 block">
        ← 문제 목록으로 돌아가기
      </Link>

      {/* Type selector */}
      <div className="mb-6">
        <label className="block font-semibold mb-2">문제 유형 선택</label>
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

      {/* Question text */}
      <div className="mb-6">
        <label className="block font-semibold mb-2">문제 설명</label>
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="w-full border p-2 rounded"
        />
      </div>

      {/* Editors */}
      {type === "TABLE_FILL_CELLS" && (
        <TableEditor
          columns={columns}
          setColumns={setColumns}
          rows={rows}
          setRows={setRows}
          cells={cells}
          setCells={setCells}
        />
      )}
      {type === "MCQ_SINGLE" && (
        <div className="mb-6">{/* your MCQEditor… */}</div>
      )}
      {type === "FILL_IN_THE_BLANK" && (
        <div className="mb-6">{/* your BlankEditor… */}</div>
      )}

      {/* Submit */}
      <button
        onClick={handleSubmit}
        className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded"
      >
        저장하고 목록으로 이동
      </button>
    </div>
  );
}
