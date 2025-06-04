// components/TableEditor.tsx
"use client";

import { useEffect, useState } from "react";

// Re-export this type so Dashboard and other consumers can import it.
export type ColumnDefinition = {
  name: string;
  type: "text" | "number" | "latex";
};

/**
 * A single object representing the entire “table” state.
 * Dashboard will store one of these in its own state whenever TableEditor changes.
 */
export type TableData = {
  columns: ColumnDefinition[];
  rows: string[];
  cells: string[][];
  rowHeaderLabel: string;
};

interface TableEditorProps {
  /**
   * The initial shape of the table (from Dashboard). Once mounted, TableEditor
   * will copy these into internal state and from then on manage them locally.
   */
  initialColumns: ColumnDefinition[];
  initialRows: string[];
  initialCells: string[][];
  initialRowHeaderLabel: string;

  /**
   * Called whenever any of [columns, rows, cells, rowHeaderLabel] changes.
   * Dashboard will use this to keep its own `tableData` up to date.
   */
  onChange: (data: TableData) => void;
}

export function TableEditor({
  initialColumns,
  initialRows,
  initialCells,
  initialRowHeaderLabel,
  onChange,
}: TableEditorProps) {
  //
  // ─── Local State (all four pieces) ─────────────────────────────────────────
  //
  const [columns, setColumns] = useState<ColumnDefinition[]>(initialColumns);
  const [rows, setRows] = useState<string[]>(initialRows);
  const [cells, setCells] = useState<string[][]>(initialCells);
  const [rowHeaderLabel, setRowHeaderLabel] = useState<string>(
    initialRowHeaderLabel
  );

  //
  // ─── 1) Load MathLive custom element once ─────────────────────────────────
  //
  useEffect(() => {
    import("mathlive");
  }, []);

  //
  // ─── 2) Whenever columns or rows change, re‐compute cells matrix size ────
  //
  // (We preserve any existing cell content if it already existed.)
  //
  useEffect(() => {
    const newCells = rows.map((_, rIdx) =>
      columns.map((_, cIdx) => {
        // If there was a previous value in cells[rIdx][cIdx], keep it. Otherwise use "".
        return cells[rIdx]?.[cIdx] ?? "";
      })
    );
    setCells(newCells);
  }, [columns, rows]);

  //
  // ─── 3) Whenever ANY of [columns, rows, cells, rowHeaderLabel] changes,
  //     tell the parent exactly what our current table “shape” is.
  //
  useEffect(() => {
    onChange({
      columns,
      rows,
      cells,
      rowHeaderLabel,
    });
  }, [columns, rows, cells, rowHeaderLabel]);

  //
  // ─── 4) Local helpers to mutate columns/rows/etc ──────────────────────────
  //
  const addColumn = () => {
    // Append a new “Number” column by default
    setColumns([
      ...columns,
      { name: `Column ${columns.length + 1}`, type: "number" },
    ]);
    // Also add an empty cell string to every row
    setCells((prev) => prev.map((r) => [...r, ""]));
  };

  const deleteColumn = (cIdx: number) => {
    setColumns((prev) => prev.filter((_, i) => i !== cIdx));
    setCells((prev) => prev.map((r) => r.filter((_, i) => i !== cIdx)));
  };

  const addRow = () => {
    setRows((prev) => [...prev, `Row ${prev.length + 1}`]);
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

  //
  // ─── 5) Render the table editor UI ────────────────────────────────────────
  //
  return (
    <div className="mb-8">
      <div className="flex gap-2 mb-4">
        <button
          onClick={addColumn}
          className="px-3 py-1 bg-blue-500 text-white rounded"
        >
          + Column
        </button>
        <button
          onClick={addRow}
          className="px-3 py-1 bg-blue-500 text-white rounded"
        >
          + Row
        </button>
      </div>

      <div className="overflow-auto">
        <table className="w-full border border-gray-300 text-center">
          <thead className="bg-gray-100">
            <tr>
              {/* First header cell: the row-header label */}
              <th className="border p-2 bg-[#54e3e6]">
                <input
                  type="text"
                  placeholder="Row Header"
                  value={rowHeaderLabel}
                  onChange={(e) => setRowHeaderLabel(e.target.value)}
                  className="w-full p-1 border rounded text-center"
                />
              </th>

              {columns.map((col, ci) => (
                <th key={ci} className="border p-3 relative bg-[#54e3e6]">
                  {/* Editable column name */}
                  <input
                    placeholder="열 이름"
                    type="text"
                    value={col.name}
                    onChange={(e) => updateColName(ci, e.target.value)}
                    className="w-full p-1 border rounded text-center mb-1"
                  />

                  {/* Select box for column type */}
                  <select
                    value={col.type}
                    onChange={(e) =>
                      updateColType(
                        ci,
                        e.target.value as ColumnDefinition["type"]
                      )
                    }
                    className="w-full p-1 border rounded text-center text-sm"
                  >
                    <option value="number">Number</option>
                    <option value="text">Text</option>
                    <option value="latex">Math (LaTeX)</option>
                  </select>

                  {/* Delete-column button */}
                  <button
                    onClick={() => deleteColumn(ci)}
                    className="absolute top-[-5px] right-1 text-red-600"
                    title="Delete column"
                  >
                    ×
                  </button>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {rows.map((row, ri) => (
              <tr key={ri} className="group">
                {/* Row-header cell (with MathLive) */}
                <td className="border p-2 bg-[#54e3e6] relative">
                  {/* @ts-ignore */}
                  <math-field
                    class="w-full h-12"
                    value={row}
                    virtual-keyboard-mode="onfocus"
                    smart-mode
                    onInput={(e: any) => updateRowName(ri, e.target.getValue())}
                  />
                  <button
                    onClick={() => deleteRow(ri)}
                    className="absolute top-1 right-1 text-red-600 opacity-0 group-hover:opacity-100"
                    title="Delete row"
                  >
                    ×
                  </button>
                </td>

                {columns.map((col, ci) => (
                  <td key={ci} className="border p-2">
                    {col.type === "latex" ? (
                      // @ts-ignore: MathLive custom element
                      <math-field
                        className="w-full h-12 border rounded p-1"
                        value={cells[ri]?.[ci] || ""}
                        virtual-keyboard-mode="onfocus"
                        smart-mode
                        onInput={(e: any) =>
                          updateCell(ri, ci, e.target.getValue())
                        }
                      ></math-field>
                    ) : (
                      <input
                        type={col.type}
                        value={cells[ri]?.[ci] || ""}
                        onChange={(e) => updateCell(ri, ci, e.target.value)}
                        className="w-full p-1 border rounded text-center"
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
