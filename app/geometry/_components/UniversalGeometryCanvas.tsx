"use client";

import { Stage, Layer, Circle, Line, Text, Group } from "react-konva";
import { useState, useRef } from "react";

export type Tool =
  | "select"
  | "point"
  | "line"
  | "triangle"
  | "circle"
  | "label"
  | "erase";
export type Mode = "edit" | "solve" | "review";

interface Shape {
  id: string;
  type: Tool;
  x?: number;
  y?: number;
  points?: { x: number; y: number }[];
  radius?: number;
  text?: string;
}

interface UGCProps {
  mode: Mode;
  tool: Tool;
  shapes: Shape[];
  setShapes: (shapes: Shape[]) => void;
}

export default function UniversalGeometryCanvas({
  mode,
  tool,
  shapes,
  setShapes,
}: UGCProps) {
  const [tempPoints, setTempPoints] = useState<{ x: number; y: number }[]>([]);
  const [scale, setScale] = useState(1);
  const stageRef = useRef<any>(null);

  const handleClick = (e: any) => {
    if (mode !== "edit") return;
    const stage = e.target.getStage();
    const pointer = stage.getPointerPosition();
    if (!pointer) return;

    if (tool === "erase") {
      const clickedX = pointer.x;
      const clickedY = pointer.y;
      const updatedShapes = shapes.filter((shape) => {
        if (
          shape.type === "point" ||
          shape.type === "label" ||
          shape.type === "circle"
        ) {
          const dx = (shape.x ?? 0) - clickedX;
          const dy = (shape.y ?? 0) - clickedY;
          return Math.sqrt(dx * dx + dy * dy) > 10;
        } else if (shape.points) {
          return !shape.points.some(
            (p) =>
              Math.abs(p.x - clickedX) < 10 && Math.abs(p.y - clickedY) < 10
          );
        }
        return true;
      });
      setShapes(updatedShapes);
      return;
    }

    if (tool === "point") {
      const label = String.fromCharCode(
        65 + shapes.filter((s) => s.type === "point").length
      );
      const newShape: Shape = {
        id: Date.now().toString(),
        type: "point",
        x: pointer.x,
        y: pointer.y,
        text: label,
      };
      setShapes([...shapes, newShape]);
    } else if (tool === "line" || tool === "triangle") {
      const newTemp = [...tempPoints, { x: pointer.x, y: pointer.y }];
      const required = tool === "line" ? 2 : 3;
      if (newTemp.length === required) {
        const newShape: Shape = {
          id: Date.now().toString(),
          type: tool,
          points: newTemp,
        };
        setShapes([...shapes, newShape]);
        setTempPoints([]);
      } else {
        setTempPoints(newTemp);
      }
    } else if (tool === "circle") {
      const newShape: Shape = {
        id: Date.now().toString(),
        type: "circle",
        x: pointer.x,
        y: pointer.y,
        radius: 40,
      };
      setShapes([...shapes, newShape]);
    } else if (tool === "label") {
      const text = prompt("Enter label text") || "";
      if (!text) return;
      const newShape: Shape = {
        id: Date.now().toString(),
        type: "label",
        x: pointer.x,
        y: pointer.y,
        text,
      };
      setShapes([...shapes, newShape]);
    }
  };

  const handleDragMove = (e: any, shapeId: string, updatePoints = false) => {
    const node = e.target;
    const { x, y } = node.position();
    const dx = x - (node._lastPos?.x ?? x);
    const dy = y - (node._lastPos?.y ?? y);
    node._lastPos = { x, y };

    const updatedShapes = shapes.map((shape) => {
      if (shape.id !== shapeId) return shape;
      if (updatePoints && shape.points) {
        const movedPoints = shape.points.map((p) => ({
          x: p.x + dx,
          y: p.y + dy,
        }));
        return { ...shape, points: movedPoints };
      } else {
        return { ...shape, x, y };
      }
    });
    setShapes(updatedShapes);
  };

  const handleWheel = (e: any) => {
    e.evt.preventDefault();
    const stage = stageRef.current;
    const oldScale = stage.scaleX();
    const pointer = stage.getPointerPosition();
    if (!pointer) return;

    const scaleBy = 1.05;
    const direction = e.evt.deltaY > 0 ? -1 : 1;
    const newScale = direction > 0 ? oldScale * scaleBy : oldScale / scaleBy;
    setScale(newScale);
  };

  return (
    <Stage
      ref={stageRef}
      width={600}
      height={400}
      scaleX={scale}
      scaleY={scale}
      onClick={handleClick}
      onWheel={handleWheel}
      className="border rounded bg-white"
    >
      <Layer>
        {shapes.map((shape) => {
          if (shape.type === "point") {
            return (
              <Group
                key={shape.id}
                draggable
                onDragMove={(e) => handleDragMove(e, shape.id)}
              >
                <Circle x={shape.x!} y={shape.y!} radius={5} fill="blue" />
                <Text
                  text={shape.text!}
                  x={shape.x! + 8}
                  y={shape.y! - 8}
                  fontSize={14}
                />
              </Group>
            );
          } else if (shape.type === "line" || shape.type === "triangle") {
            const pts = shape.points!.flatMap((p) => [p.x, p.y]);
            const closed = shape.type === "triangle";
            return (
              <Line
                key={shape.id}
                points={closed ? [...pts, pts[0], pts[1]] : pts}
                stroke="black"
                strokeWidth={2}
                closed={closed}
                draggable
                onDragStart={(e) => {
                  e.target._lastPos = e.target.position();
                }}
                onDragMove={(e) => handleDragMove(e, shape.id, true)}
              />
            );
          } else if (shape.type === "circle") {
            return (
              <Circle
                key={shape.id}
                x={shape.x!}
                y={shape.y!}
                radius={shape.radius!}
                stroke="black"
                draggable
                onDragMove={(e) => handleDragMove(e, shape.id)}
              />
            );
          } else if (shape.type === "label") {
            return (
              <Text
                key={shape.id}
                x={shape.x!}
                y={shape.y!}
                text={shape.text!}
                fontSize={16}
                fill="green"
                draggable
                onDragMove={(e) => handleDragMove(e, shape.id)}
              />
            );
          }
        })}
      </Layer>
    </Stage>
  );
}
