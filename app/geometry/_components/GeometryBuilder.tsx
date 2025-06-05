"use client";

import { useState } from "react";
import UniversalGeometryCanvas, { Tool, Mode } from "./UniversalGeometryCanvas";
import GeometryToolbar from "./GeometryToolbar";
interface Shape {
  id: string;
  type: Tool;
  x?: number;
  y?: number;
  points?: { x: number; y: number }[];
  radius?: number;
  text?: string;
}
export default function GeometryBuilder({
  setPreview,
}: {
  setPreview: (v: string) => void;
}) {
  const [tool, setTool] = useState<Tool>("point");
  const [shapes, setShapes] = useState<any>([]);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">📐 Geometry Builder</h2>
      <p className="text-sm text-gray-500 mb-4">
        Select a tool below and click on the canvas to draw.
      </p>

      <GeometryToolbar tool={tool} setTool={setTool} />

      <UniversalGeometryCanvas
        mode="edit"
        tool={tool}
        shapes={shapes}
        setShapes={setShapes}
      />
    </div>
  );
}
