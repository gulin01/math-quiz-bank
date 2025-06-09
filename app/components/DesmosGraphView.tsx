"use client";

import { useEffect, useRef } from "react";

export type DesmosGraphType =
  | "graphing"
  | "geometry"
  | "scientific"
  | "fourfunction";

interface DesmosGraphViewProps {
  state: any;
  graphType: DesmosGraphType;
}

const SCRIPT_MAP: Record<DesmosGraphType, string> = {
  graphing:
    "https://www.desmos.com/api/v1.11/calculator.js?apiKey=dcb31709b452b1cf9dc26972add0fda6",
  geometry:
    "https://www.desmos.com/api/v1.7/geometry.js?apiKey=dcb31709b452b1cf9dc26972add0fda6",
  scientific:
    "https://www.desmos.com/api/v1.0/scientific.js?apiKey=dcb31709b452b1cf9dc26972add0fda6",
  fourfunction:
    "https://www.desmos.com/api/v1.0/fourfunction.js?apiKey=dcb31709b452b1cf9dc26972add0fda6",
};

export function DesmosGraphView({ state, graphType }: DesmosGraphViewProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const calculatorRef = useRef<any>(null);

  useEffect(() => {
    const scriptId = `desmos-viewer-${graphType}`;

    const cleanup = () => {
      const existingScript = document.getElementById(scriptId);
      if (existingScript) existingScript.remove();
      if (calculatorRef.current?.destroy) calculatorRef.current.destroy();
      calculatorRef.current = null;
    };

    const loadScript = () =>
      new Promise<void>((resolve) => {
        const script = document.createElement("script");
        script.id = scriptId;
        script.src = SCRIPT_MAP[graphType];
        script.async = true;
        script.onload = () => resolve();
        document.body.appendChild(script);
      });

    const init = () => {
      if (!ref.current || !(window as any).Desmos) return;

      const Desmos = (window as any).Desmos;

      switch (graphType) {
        case "geometry":
          calculatorRef.current = Desmos.GeometryCalculator(ref.current);
          break;
        case "scientific":
          calculatorRef.current = Desmos.ScientificCalculator(ref.current);
          break;
        case "fourfunction":
          calculatorRef.current = Desmos.FourFunctionCalculator(ref.current);
          break;
        default:
          calculatorRef.current = Desmos.GraphingCalculator(ref.current, {
            expressions: true,
            keypad: false,
          });
      }

      if (calculatorRef.current?.setState) {
        try {
          calculatorRef.current.setState(state);
        } catch (err) {
          console.warn("Desmos state error:", err);
        }
      }
    };

    cleanup();
    loadScript().then(() => {
      requestAnimationFrame(init);
    });

    return cleanup;
  }, [graphType, state]);

  return (
    <div
      ref={ref}
      className="w-full h-[400px] border rounded bg-white shadow mt-2"
    />
  );
}
