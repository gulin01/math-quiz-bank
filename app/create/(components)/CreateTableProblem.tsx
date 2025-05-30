import { useState, useEffect } from "react";

type TableEditorProps = {
  columns: string[];
  setColumns: (c: string[]) => void;
  rows: string[];
  setRows: (r: string[]) => void;
  cells: string[][];
  setCells: (c: string[][]) => void;
};

export function TableEditor({
  columns,
  setColumns,
  rows,
  setRows,
  cells,
  setCells,
}: TableEditorProps) {
  const [rowHeaderLabel, setRowHeaderLabel] = useState<string>("Row");

  // Load MathLive custom element
  useEffect(() => {
    import("mathlive");
  }, []);

  // Keep cells matrix in sync
  useEffect(() => {
    const newCells = rows.map((_, rIdx) =>
      columns.map((_, cIdx) => cells[rIdx]?.[cIdx] ?? "")
    );
    setCells(newCells);
  }, [columns, rows]);

  const addColumn = () => {
    setColumns([...columns, `Column ${columns.length + 1}`]);
    setCells(cells.map((r) => [...r, ""]));
  };
  const deleteColumn = (cIdx: number) => {
    setColumns(columns.filter((_, i) => i !== cIdx));
    setCells(cells.map((r) => r.filter((_, i) => i !== cIdx)));
  };

  const addRow = () => {
    setRows([...rows, `Row ${rows.length + 1}`]);
    setCells([...cells, Array(columns.length).fill("")]);
  };
  const deleteRow = (rIdx: number) => {
    setRows(rows.filter((_, i) => i !== rIdx));
    setCells(cells.filter((_, i) => i !== rIdx));
  };

  const updateColName = (idx: number, val: string) => {
    const newCols = columns.map((c, i) => (i === idx ? val : c));
    setColumns(newCols);
  };
  const updateRowName = (idx: number, val: string) => {
    const newRows = rows.map((r, i) => (i === idx ? val : r));
    setRows(newRows);
  };
  const updateCell = (rIdx: number, cIdx: number, val: string) => {
    const newCells = cells.map((r, i) =>
      i === rIdx ? r.map((cell, j) => (j === cIdx ? val : cell)) : r
    );
    setCells(newCells);
  };

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
              {/* First header cell (row-label) stays as is */}
              <th className="border p-2 bg-[#54e3e6]">
                <input
                  type="text"
                  value={rowHeaderLabel}
                  onChange={(e) => setRowHeaderLabel(e.target.value)}
                  className="w-full p-1 border rounded text-center"
                />
              </th>

              {columns.map((col, ci) => (
                <th key={ci} className="border p-2 relative bg-[#98278b]">
                  {/* Editable column name */}
                  <input
                    type="text"
                    value={col}
                    onChange={(e) => updateColName(ci, e.target.value)}
                    className="w-full p-1 border rounded text-center"
                  />
                  {/* Delete button */}
                  <button
                    onClick={() => deleteColumn(ci)}
                    className="absolute top-1 right-1 text-red-600"
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

                {columns.map((_, ci) => (
                  <td key={ci} className="border p-2">
                    {/* plain answer cell */}
                    <input
                      type="text"
                      value={cells[ri]?.[ci] || ""}
                      onChange={(e) => updateCell(ri, ci, e.target.value)}
                      className="w-full p-1 border rounded text-center h-12"
                    />
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
