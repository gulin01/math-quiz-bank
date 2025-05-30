function MCQEditor({
  options,
  setOptions,
  correctIndex,
  setCorrectIndex,
}: {
  options: string[];
  setOptions: (opts: string[]) => void;
  correctIndex: number;
  setCorrectIndex: (i: number) => void;
}) {
  const updateOption = (idx: number, text: string) => {
    const arr = [...options];
    arr[idx] = text;
    setOptions(arr);
  };

  return (
    <div className="mb-10">
      <label className="block font-semibold mb-2">MCQ Options</label>
      {options.map((opt, idx) => (
        <div key={idx} className="flex items-center mb-2 space-x-2">
          <input
            type="radio"
            name="mcq"
            checked={correctIndex === idx}
            onChange={() => setCorrectIndex(idx)}
            className="mr-2"
          />
          <input
            type="text"
            value={opt}
            onChange={(e) => updateOption(idx, e.target.value)}
            placeholder={`Option ${idx + 1}`}
            className="border p-2 rounded flex-1"
          />
        </div>
      ))}
      <button
        onClick={() => setOptions([...options, ""])}
        className="mt-2 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
      >
        + Add Option
      </button>
    </div>
  );
}
