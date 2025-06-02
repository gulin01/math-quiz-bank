import { useEffect } from "react";

export type ColumnDefinition = {
  name: string;
  type: "text" | "number" | "latex";
};

export type TableEditorProps = {
  columns: ColumnDefinition[];
  setColumns: (cols: ColumnDefinition[]) => void;
  rows: string[];
  setRows: (r: string[]) => void;
  cells: string[][];
  setCells: (c: string[][]) => void;
  rowHeaderLabel: string;
  setRowHeaderLabel: (label: string) => void;
};

export function TableEditor({
  columns,
  setColumns,
  rows,
  setRows,
  cells,
  setCells,
  rowHeaderLabel,
  setRowHeaderLabel,
}: TableEditorProps) {
  // Load MathLive custom element once
  useEffect(() => {
    import("mathlive");
  }, []);

  // Keep cells matrix in sync whenever columns or rows change
  useEffect(() => {
    const newCells = rows.map((_, rIdx) =>
      columns.map((_, cIdx) => cells[rIdx]?.[cIdx] ?? "")
    );
    setCells(newCells);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [columns, rows]);

  const addColumn = () => {
    setColumns([
      ...columns,
      { name: `Column ${columns.length + 1}`, type: "number" },
    ]);
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
    const newCols = columns.map((c, i) =>
      i === idx ? { ...c, name: val } : c
    );
    setColumns(newCols);
  };

  const updateColType = (idx: number, val: ColumnDefinition["type"]) => {
    const newCols = columns.map((c, i) =>
      i === idx ? { ...c, type: val } : c
    );
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
                    <option value="string">Text</option>
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
                        className="w-full h-12"
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
