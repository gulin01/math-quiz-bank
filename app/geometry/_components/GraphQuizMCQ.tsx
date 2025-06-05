import { useState } from "react";
import Image from "next/image";

interface GraphOption {
  id: string;
  imageUrl: string;
  label: string;
}

export default function GraphMCQEditor({
  onSave,
}: {
  onSave: (data: {
    question: string;
    options: GraphOption[];
    correctIndex: number;
  }) => void;
}) {
  const [question, setQuestion] = useState(
    "Which graph best represents the situation?"
  );
  const [options, setOptions] = useState<GraphOption[]>([]);
  const [correctIndex, setCorrectIndex] = useState<number>(0);

  const handleAddOption = () => {
    const id = Date.now().toString();
    const label = `Option ${String.fromCharCode(65 + options.length)}`;
    const imageUrl = prompt("Enter image URL for the graph option:") || "";
    if (!imageUrl) return;
    setOptions([...options, { id, imageUrl, label }]);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">📊 Graph MCQ Creator</h2>

      <div>
        <label className="font-semibold">Question:</label>
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="w-full border p-2 rounded mt-1"
        />
      </div>

      <div className="space-y-2">
        <label className="font-semibold">Options:</label>
        {options.map((opt, idx) => (
          <div
            key={opt.id}
            className="flex items-center gap-4 border p-2 rounded"
          >
            <input
              type="radio"
              name="correctOption"
              checked={correctIndex === idx}
              onChange={() => setCorrectIndex(idx)}
            />
            <span>{opt.label}</span>
            <Image
              src={opt.imageUrl}
              alt={opt.label}
              width={120}
              height={80}
              className="rounded border"
            />
          </div>
        ))}

        <button
          onClick={handleAddOption}
          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          ➕ Add Graph Option
        </button>
      </div>

      <button
        onClick={() => onSave({ question, options, correctIndex })}
        className="mt-4 px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
      >
        ✅ Save Graph MCQ
      </button>
    </div>
  );
}
