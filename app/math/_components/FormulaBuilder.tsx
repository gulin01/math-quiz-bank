// components/FormulaBuilder.tsx
import { formulaLibrary } from "@/app/_utils/formulaLibrary";
import { useState } from "react";

export function FormulaBuilder({
  onSubmit,
}: {
  onSubmit: (latex: string) => void;
}) {
  const [selectedId, setSelectedId] = useState("linear_1");
  const selected = formulaLibrary.find((f) => f.id === selectedId)!;
  const [values, setValues] = useState(selected.defaults);

  const renderInput = (varName: string) => (
    <input
      key={varName}
      type="number"
      value={values[varName]}
      onChange={(e) =>
        setValues({ ...values, [varName]: parseFloat(e.target.value) })
      }
      className="border p-1 m-1 w-16"
    />
  );

  const generateLatex = () => {
    let latex = selected.formula;
    selected.variables.forEach((v) => {
      latex = latex.replaceAll(v, values[v]);
    });
    return latex;
  };

  return (
    <div className="border p-4 rounded">
      <label>Select a formula:</label>
      <select
        value={selectedId}
        onChange={(e) => {
          const id = e.target.value;
          setSelectedId(id);
          const defaults = formulaLibrary.find((f) => f.id === id)!.defaults;
          setValues(defaults);
        }}
        className="border p-1 m-2"
      >
        {formulaLibrary.map((f: any) => (
          <option key={f.id} value={f.id}>
            {f.name}
          </option>
        ))}
      </select>

      <div className="my-2">{selected.variables.map(renderInput)}</div>

      <button
        className="bg-blue-500 text-white px-4 py-1 rounded"
        onClick={() => onSubmit(generateLatex())}
      >
        Insert Formula
      </button>
    </div>
  );
}
