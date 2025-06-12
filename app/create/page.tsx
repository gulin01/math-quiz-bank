"use client";

import "katex/dist/katex.min.css";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { parseMixedText } from "@/app/_utils/parseMixedText";
import {
  ColumnDefinition,
  TableData,
  TableEditor,
} from "./_components/TableEditor";
import { MCQEditor, MCQOption } from "./_components/MQCEditor";
import { FillBlankEditor } from "./_components/BlankEditor";

type ProblemType = "TABLE_FILL_CELLS" | "MCQ_SINGLE" | "FILL_IN_THE_BLANK";
type DesmosGraphType = "graphing" | "geometry" | "scientific" | "fourfunction";

export default function Dashboard({
  setView,
}: {
  setView: (view: string) => void;
}) {
  const router = useRouter();
  const [showGraph, setShowGraph] = useState<boolean>(false);

  const [question, setQuestion] = useState<string>(
    "예시: 다음 방정식을 풀어보세요: $x^2 + 3x + 2 = 0$"
  );
  const [type, setType] = useState<ProblemType>("TABLE_FILL_CELLS");

  const initialColumns: ColumnDefinition[] = [
    { name: "열 제목 입력 1", type: "text" },
    { name: "열 제목 입력 2", type: "text" },
  ];
  const initialRows: string[] = ["행 제목 입력 1", "행 제목 입력 2"];
  const initialCells: string[][] = initialRows.map(() =>
    initialColumns.map(() => "")
  );
  const initialRowHeaderLabel = "행 헤더 제목 입력";

  const [tableData, setTableData] = useState<TableData>({
    columns: initialColumns,
    rows: initialRows,
    cells: initialCells,
    rowHeaderLabel: initialRowHeaderLabel,
  });

  const [mcqOptions, setMcqOptions] = useState<MCQOption[]>([
    { text: "", type: "text" },
  ]);
  const [correctOptionIndex, setCorrectOptionIndex] = useState<number>(0);
  const [blankAnswer, setBlankAnswer] = useState<{
    answer: string;
    answerType: string;
  }>({
    answer: "",
    answerType: "text",
  });

  const [showMathEditor, setShowMathEditor] = useState<boolean>(false);
  const [mathInput, setMathInput] = useState<string>("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [graphType, setGraphType] = useState<DesmosGraphType>("graphing");
  const graphRef = useRef<HTMLDivElement | null>(null);
  const graphCalc = useRef<any>(null);

  const insertMathAtCursor = () => {
    const ta = textareaRef.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const combined = `${question.slice(0, start)}$${mathInput}$${question.slice(
      end
    )}`;
    setQuestion(combined);
    setMathInput("");
    setShowMathEditor(false);

    setTimeout(() => {
      if (!ta) return;
      ta.focus();
      const newPos = start + mathInput.length + 2;
      ta.setSelectionRange(newPos, newPos);
    }, 0);
  };

  // ─── Load Desmos Calculator Based on Selected Type ─────
  useEffect(() => {
    const scriptId = `desmos-script-${graphType}`;
    const scriptUrls: Record<DesmosGraphType, string> = {
      graphing:
        "https://www.desmos.com/api/v1.11/calculator.js?apiKey=dcb31709b452b1cf9dc26972add0fda6",
      geometry:
        "https://www.desmos.com/api/v1.7/geometry.js?apiKey=dcb31709b452b1cf9dc26972add0fda6",
      scientific:
        "https://www.desmos.com/api/v1.0/scientific.js?apiKey=dcb31709b452b1cf9dc26972add0fda6",
      fourfunction:
        "https://www.desmos.com/api/v1.0/fourfunction.js?apiKey=dcb31709b452b1cf9dc26972add0fda6",
    };

    const loadScript = (src: string, id: string) => {
      return new Promise<void>((resolve) => {
        if (document.getElementById(id)) {
          resolve(); // already loaded
          return;
        }
        const script = document.createElement("script");
        script.src = src;
        script.id = id;
        script.async = true;
        script.onload = () => resolve();
        document.body.appendChild(script);
      });
    };

    const initDesmos = () => {
      if (!graphRef.current || !window.Desmos) return;

      if (graphCalc.current?.destroy) graphCalc.current.destroy();

      switch (graphType) {
        case "geometry":
          graphCalc.current = (window as any).Desmos.Geometry(
            graphRef.current,
            { keypad: true }
          );
          break;
        case "scientific":
          graphCalc.current = (window as any).Desmos.ScientificCalculator(
            graphRef.current
          );
          break;
        case "fourfunction":
          graphCalc.current = (window as any).Desmos.FourFunctionCalculator(
            graphRef.current
          );
          break;
        default:
          graphCalc.current = (window as any).Desmos.GraphingCalculator(
            graphRef.current,
            {
              keypad: true,
              expressions: true,
            }
          );
      }
    };

    loadScript(scriptUrls[graphType], scriptId).then(() => {
      requestAnimationFrame(initDesmos);
    });
  }, [graphType]);

  const handleSubmit = () => {
    const id = Date.now().toString();
    const payload: any = { id, type, question };

    if (type === "TABLE_FILL_CELLS") {
      Object.assign(payload, tableData);
    } else if (type === "MCQ_SINGLE") {
      payload.options = mcqOptions;
      payload.correctOptionIndex = correctOptionIndex;
    } else {
      payload.answer = blankAnswer.answer;
      payload.answerType = blankAnswer.answerType;
    }

    if (graphCalc.current?.getState) {
      payload.graphState = graphCalc.current.getState();
      payload.graphType = graphType;
    }

    const existing = sessionStorage.getItem("problems");
    const list = existing ? JSON.parse(existing) : [];
    list.push(payload);
    sessionStorage.setItem("problems", JSON.stringify(list));
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-blue-50 to-pink-100 text-gray-800 p-10 max-w-4xl mx-auto font-sans">
      <h1 className="text-4xl font-extrabold mb-6 text-center text-blue-800 drop-shadow-md">
        📝 문제 만들기 마법사
      </h1>

      <button
        onClick={() => router.push("/")}
        className="text-blue-600 underline mb-6 block text-sm hover:text-blue-800"
      >
        ← 문제 목록으로 돌아가기
      </button>

      <div className="mb-6">
        <label className="block font-bold text-lg text-blue-700 mb-2">
          문제 유형을 선택하세요
        </label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value as ProblemType)}
          className="border-2 border-blue-300 p-2 rounded w-full bg-white text-blue-900 shadow"
        >
          <option value="TABLE_FILL_CELLS">📊 표 채우기</option>
          <option value="MCQ_SINGLE">✅ 객관식 문제</option>
          <option value="FILL_IN_THE_BLANK">✏️ 빈칸 채우기</option>
        </select>
      </div>

      <div className="mb-8">
        <label className="block font-bold text-lg text-blue-700 mb-2">
          🧐 문제 지시문 미리보기
        </label>
        <div className="min-h-[3rem] border-2 border-gray-300 p-4 rounded bg-white shadow-sm">
          {parseMixedText(question)}
        </div>
      </div>

      <div className="mb-6">
        <label className="block font-bold text-lg text-blue-700 mb-2">
          문제 지시문 입력
        </label>
        <textarea
          ref={textareaRef}
          rows={4}
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="w-full border-2 border-blue-300 p-3 rounded-lg bg-white text-gray-800 shadow font-mono"
        />
        {showMathEditor && (
          <div className="mb-4 mt-3 bg-blue-50 border-2 border-blue-200 rounded p-3">
            {/* @ts-ignore */}
            <math-field
              className="w-full h-12 border rounded p-2 mb-2"
              value={mathInput}
              virtual-keyboard-mode="onfocus"
              smart-mode
              onInput={(e: any) => setMathInput(e.target.getValue())}
            ></math-field>
            <div className="flex gap-2">
              <button
                onClick={insertMathAtCursor}
                className="bg-green-600 text-white px-4 py-1 rounded shadow"
              >
                수식 삽입
              </button>
              <button
                onClick={() => {
                  setShowMathEditor(false);
                  setMathInput("");
                }}
                className="bg-gray-400 text-white px-4 py-1 rounded shadow"
              >
                취소
              </button>
            </div>
          </div>
        )}
        {!showMathEditor && (
          <button
            onClick={() => setShowMathEditor(true)}
            className="mt-2 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded shadow"
          >
            ➕ 수식 추가
          </button>
        )}
      </div>

      {/* 설명용 그래프 필드 */}
      {/* 설명용 그래프 toggle + field */}
      <div className="mb-10">
        <label className="block font-bold text-lg text-blue-700 mb-2">
          📉 설명용 그래프
        </label>

        {!showGraph ? (
          <button
            onClick={() => setShowGraph(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded shadow"
          >
            ➕ 설명용 그래프 추가하기
          </button>
        ) : (
          <>
            <button
              onClick={() => setShowGraph(false)}
              className="bg-red-400 hover:bg-red-500 text-white px-3 py-1 rounded shadow mb-4"
            >
              ➖ 설명용 그래프 숨기기
            </button>

            <select
              value={graphType}
              onChange={(e) => setGraphType(e.target.value as DesmosGraphType)}
              className="border border-gray-300 rounded p-2 mb-4 bg-white w-full"
            >
              <option value="graphing">📈 표준 그래프 계산기</option>
              <option value="geometry">📐 기하 도구</option>
              <option value="scientific">🧪 과학 계산기</option>
              <option value="fourfunction">➕ 사칙 계산기</option>
            </select>

            <div
              ref={graphRef}
              className="w-full h-[400px] border rounded shadow bg-white"
            />
          </>
        )}
      </div>

      {type === "TABLE_FILL_CELLS" && (
        <TableEditor
          initialColumns={tableData.columns}
          initialRows={tableData.rows}
          initialCells={tableData.cells}
          initialRowHeaderLabel={tableData.rowHeaderLabel}
          onChange={setTableData}
        />
      )}
      {type === "MCQ_SINGLE" && (
        <MCQEditor
          options={mcqOptions}
          setOptions={setMcqOptions}
          correctIndex={correctOptionIndex}
          setCorrectIndex={setCorrectOptionIndex}
        />
      )}
      {type === "FILL_IN_THE_BLANK" && (
        <FillBlankEditor
          initialAnswer={blankAnswer}
          onChange={setBlankAnswer}
        />
      )}

      <button
        onClick={handleSubmit}
        className="bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-3 rounded shadow-xl w-full mt-6 text-lg"
      >
        ✅ 문제 저장하고 홈으로 이동
      </button>
    </div>
  );
}
