"use client";

export type Tool =
  | "select"
  | "point"
  | "line"
  | "triangle"
  | "circle"
  | "label";
export default function GeometryToolbar({
  tool,
  setTool,
}: {
  tool: Tool;
  setTool: (t: Tool) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2 mb-4 border border-[#3e3]">
      {[
        { value: "point", label: "📌 Point" },
        { value: "line", label: "📏 Line" },
        { value: "triangle", label: "🔺 Triangle" },
        { value: "circle", label: "🟠 Circle" },
        { value: "label", label: "🏷 Label" },
      ].map(({ value, label }) => (
        <button
          key={value}
          onClick={() => setTool(value as Tool)}
          className={`px-4 py-2 rounded text-sm font-medium transition border 
            ${
              tool === value
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
