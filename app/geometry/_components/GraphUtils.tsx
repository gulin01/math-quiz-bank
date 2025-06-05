import { Stage, Layer, Line, Circle, Text } from "react-konva";
import { useState } from "react";

interface Point {
  x: number;
  y: number;
  label: string;
}

export default function GeometryBuilder() {
  const [points, setPoints] = useState<Point[]>([]);
  const [lines, setLines] = useState<[number, number][]>([]);

  const handleClick = (e: any) => {
    const stage = e.target.getStage();
    const pointer = stage.getPointerPosition();
    if (!pointer) return;
    const label = String.fromCharCode(65 + points.length); // A, B, C, ...
    setPoints([...points, { x: pointer.x, y: pointer.y, label }]);
  };

  const handleConnect = (index: number) => {
    if (points.length < 2) return;
    if (index > 0) {
      setLines([...lines, [index - 1, index]]);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">📐 Geometry Builder</h2>
      <p className="mb-2 text-sm text-gray-600">
        Click anywhere on the canvas to add points. Points are labeled
        automatically.
      </p>
      <Stage
        width={600}
        height={400}
        onClick={handleClick}
        className="border rounded bg-white shadow"
      >
        <Layer>
          {/* Draw lines */}
          {lines.map(([start, end], i) => (
            <Line
              key={i}
              points={[
                points[start].x,
                points[start].y,
                points[end].x,
                points[end].y,
              ]}
              stroke="black"
              strokeWidth={2}
            />
          ))}

          {/* Draw points and labels */}
          {points.map((pt, idx) => (
            <>
              <Circle
                key={"pt" + idx}
                x={pt.x}
                y={pt.y}
                radius={6}
                fill="blue"
                onClick={() => handleConnect(idx)}
              />
              <Text
                key={"label" + idx}
                x={pt.x + 8}
                y={pt.y - 8}
                text={pt.label}
                fontSize={16}
                fill="black"
              />
            </>
          ))}
        </Layer>
      </Stage>
    </div>
  );
}
