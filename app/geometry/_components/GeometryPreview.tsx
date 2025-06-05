"use client";

export default function GeometryPreview({
  setView,
}: {
  setView: (view: string) => void;
}) {
  return (
    <div className="text-center">
      <h2 className="text-xl font-bold mb-4">👁 Student Preview</h2>
      <p className="text-sm text-gray-600 mb-6">
        Feature coming soon: Try out geometry questions as a student.
      </p>
      <button
        onClick={() => setView("list")}
        className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
      >
        ← Back to List
      </button>
    </div>
  );
}
