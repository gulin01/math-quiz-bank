import Link from "next/link";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <div className="flex flex-col gap-6">
        <h1 className="text-3xl font-bold text-center">
          🧠 Math Quiz Dashboard
        </h1>

        <Link href="/create">
          <button className="bg-blue-600 text-white px-6 py-3 rounded text-lg hover:bg-blue-700 transition">
            ➕ Create New Question
          </button>
        </Link>

        <Link href="/list">
          <button className="bg-gray-700 text-white px-6 py-3 rounded text-lg hover:bg-gray-800 transition">
            📄 View Question List
          </button>
        </Link>
      </div>
    </div>
  );
}
