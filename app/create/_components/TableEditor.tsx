"use client";

import { useEffect, useState } from "react";

// Re-export this type so Dashboard and other consumers can import it.
export type ColumnDefinition = {
  name: string;
  type: "text" | "number" | "latex";
};

export type TableData = {
  columns: ColumnDefinition[];
  rows: string[];
  cells: string[][];
  rowHeaderLabel: string;
};

interface TableEditorProps {
  initialColumns: ColumnDefinition[];
  initialRows: string[];
  initialCells: string[][];
  initialRowHeaderLabel: string;
  onChange: (data: TableData) => void;
}

export function TableEditor({
  initialColumns,
  initialRows,
  initialCells,
  initialRowHeaderLabel,
  onChange,
}: TableEditorProps) {
  const [columns, setColumns] = useState<ColumnDefinition[]>(initialColumns);
  const [rows, setRows] = useState<string[]>(initialRows);
  const [cells, setCells] = useState<string[][]>(initialCells);
  const [rowHeaderLabel, setRowHeaderLabel] = useState<string>(
    initialRowHeaderLabel
  );

  useEffect(() => {
    import("mathlive");
  }, []);

  useEffect(() => {
    const newCells = rows.map((_, rIdx) =>
      columns.map((_, cIdx) => cells[rIdx]?.[cIdx] ?? "")
    );
    setCells(newCells);
  }, [columns, rows]);

  useEffect(() => {
    onChange({ columns, rows, cells, rowHeaderLabel });
  }, [columns, rows, cells, rowHeaderLabel]);

  const addColumn = () => {
    setColumns([
      ...columns,
      { name: `열 ${columns.length + 1}`, type: "number" },
    ]);
    setCells((prev) => prev.map((r) => [...r, ""]));
  };

  const deleteColumn = (cIdx: number) => {
    setColumns((prev) => prev.filter((_, i) => i !== cIdx));
    setCells((prev) => prev.map((r) => r.filter((_, i) => i !== cIdx)));
  };

  const addRow = () => {
    setRows((prev) => [...prev, `행 ${prev.length + 1}`]);
    setCells((prev) => [...prev, Array(columns.length).fill("")]);
  };

  const deleteRow = (rIdx: number) => {
    setRows((prev) => prev.filter((_, i) => i !== rIdx));
    setCells((prev) => prev.filter((_, i) => i !== rIdx));
  };

  const updateColName = (idx: number, val: string) => {
    setColumns((prev) =>
      prev.map((c, i) => (i === idx ? { ...c, name: val } : c))
    );
  };

  const updateColType = (idx: number, val: ColumnDefinition["type"]) => {
    setColumns((prev) =>
      prev.map((c, i) => (i === idx ? { ...c, type: val } : c))
    );
  };

  const updateRowName = (idx: number, val: string) => {
    setRows((prev) => prev.map((r, i) => (i === idx ? val : r)));
  };

  const updateCell = (rIdx: number, cIdx: number, val: string) => {
    setCells((prev) =>
      prev.map((r, i) =>
        i === rIdx ? r.map((cell, j) => (j === cIdx ? val : cell)) : [...r]
      )
    );
  };

  return (
    <div className="mb-8 p-6 bg-gradient-to-br from-[#fdfbfb] to-[#ebedee] rounded-2xl shadow-xl font-pretendard">
      <div className="flex gap-4 mb-6">
        <button
          onClick={addColumn}
          className="px-4 py-2 bg-pink-500 hover:bg-pink-400 transition text-white font-bold rounded-xl shadow-md"
        >
          ➕ 열 추가
        </button>
        <button
          onClick={addRow}
          className="px-4 py-2 bg-green-500 hover:bg-green-400 transition text-white font-bold rounded-xl shadow-md"
        >
          ➕ 행 추가
        </button>
      </div>

      <div className="overflow-auto">
        <table className="min-w-full border border-gray-300 text-center shadow-md rounded-xl overflow-hidden bg-white">
          <thead className="bg-gradient-to-r from-[#fbc2eb] to-[#a6c1ee] text-white font-semibold">
            <tr>
              <th className="border p-3">
                <input
                  type="text"
                  placeholder="행 이름"
                  value={rowHeaderLabel}
                  onChange={(e) => setRowHeaderLabel(e.target.value)}
                  className="w-full p-2 border rounded-md text-center font-medium bg-white text-gray-800"
                />
              </th>
              {columns.map((col, ci) => (
                <th key={ci} className="border p-3 relative">
                  <input
                    type="text"
                    placeholder="열 이름"
                    value={col.name}
                    onChange={(e) => updateColName(ci, e.target.value)}
                    className="w-full p-2 mb-1 border rounded-md text-center bg-white font-medium text-gray-800"
                  />
                  <select
                    value={col.type}
                    onChange={(e) =>
                      updateColType(
                        ci,
                        e.target.value as ColumnDefinition["type"]
                      )
                    }
                    className="w-full p-2 border rounded-md text-center text-sm bg-white"
                  >
                    <option value="number">숫자</option>
                    <option value="text">텍스트</option>
                    <option value="latex">수식</option>
                  </select>
                  <button
                    onClick={() => deleteColumn(ci)}
                    className="absolute top-[-5px] right-2 text-red-600 text-xl"
                    title="열 삭제"
                  >
                    ×
                  </button>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {rows.map((row, ri) => (
              <tr key={ri} className="group hover:bg-yellow-50 transition">
                <td className="border p-2 bg-yellow-100 relative">
                  {/* @ts-ignore */}
                  <math-field
                    class="w-full h-12 bg-white p-1 rounded-md"
                    value={row}
                    virtual-keyboard-mode="onfocus"
                    smart-mode
                    onInput={(e: any) => updateRowName(ri, e.target.getValue())}
                  />
                  <button
                    onClick={() => deleteRow(ri)}
                    className="absolute top-1 right-2 text-red-500 opacity-0 group-hover:opacity-100"
                    title="행 삭제"
                  >
                    🗑️
                  </button>
                </td>

                {columns.map((col, ci) => (
                  <td key={ci} className="border p-2">
                    {col.type === "latex" ? (
                      // @ts-ignore
                      <math-field
                        className="w-full h-12 border rounded-md p-1 bg-white"
                        value={cells[ri]?.[ci] || ""}
                        virtual-keyboard-mode="onfocus"
                        smart-mode
                        onInput={(e: any) =>
                          updateCell(ri, ci, e.target.getValue())
                        }
                      />
                    ) : (
                      <input
                        type={col.type}
                        value={cells[ri]?.[ci] || ""}
                        onChange={(e) => updateCell(ri, ci, e.target.value)}
                        className="w-full p-2 border rounded-md text-center bg-white"
                      />
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
