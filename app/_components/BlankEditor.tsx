function BlankEditor({
  answer,
  setAnswer,
}: {
  answer: string;
  setAnswer: (ans: string) => void;
}) {
  return (
    <div className="mb-10">
      <label className="block font-semibold mb-2">Blank Answer</label>
      <input
        type="text"
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        placeholder="Enter correct answer"
        className="w-full border p-2 rounded"
      />
    </div>
  );
}
