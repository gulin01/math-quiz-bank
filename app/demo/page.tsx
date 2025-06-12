"use client";

import DemoRunner from "./_components/DemoRunner";

export default function DemoPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-blue-700 mb-4">
        🎮 문제 풀기 데모
      </h1>
      <DemoRunner />
    </div>
  );
}
