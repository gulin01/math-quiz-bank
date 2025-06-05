"use client";

export default function GeometryQuestionList({
  setView,
}: {
  setView: (view: string) => void;
}) {
  return (
    <div className="text-center">
      <h2 className="text-xl font-bold mb-4">📄 Geometry Question List</h2>
      <p className="text-sm text-gray-600 mb-6">
        Feature coming soon: View, edit, and delete saved geometry problems.
      </p>
      <button
        onClick={() => setView("builder")}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        ➕ Create New Drawing
      </button>
    </div>
  );
}
