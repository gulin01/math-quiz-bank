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
  label?: string; // optional label like "Graph 1"
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

export function DesmosGraphView({
  state,
  graphType,
  label,
}: DesmosGraphViewProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const calculatorRef = useRef<any>(null);

  console.log(`🔄 Rendering DesmosGraphView: ${label || graphType}`);

  const initDesmos = () => {
    if (!ref.current || !(window as any).Desmos) {
      console.warn(`[init] Desmos or ref is missing for ${label || graphType}`);
      return;
    }

    // Prevent double init
    if ((ref.current as any).__desmosInitialized) {
      console.warn(`[skip] Already initialized: ${label || graphType}`);
      return;
    }

    const Desmos = (window as any).Desmos;

    console.log(
      `[init] Initializing Desmos ${graphType} calculator for ${
        label || "unnamed"
      }`
    );

    switch (graphType) {
      case "geometry":
        calculatorRef.current = Desmos.Geometry(ref.current, {
          keypad: true,
        });
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

    if (state && calculatorRef.current?.setState) {
      try {
        calculatorRef.current.setState(state);
        console.log(`[init] State set for ${label || graphType}`);
      } catch (error) {
        console.warn(
          `[init] Invalid Desmos state for ${label || graphType}:`,
          error
        );
      }
    }

    // Mark as initialized
    (ref.current as any).__desmosInitialized = true;
  };

  const ensureScript = (scriptId: string): Promise<void> => {
    console.log(
      `[script] Ensuring script for ${graphType} with id: ${scriptId}`
    );

    return new Promise((resolve) => {
      const existingScript = document.getElementById(scriptId);
      if (existingScript) {
        if ((window as any).Desmos) {
          console.log(`[script] Script already loaded for ${graphType}`);
          resolve();
        } else {
          console.log(
            `[script] Waiting for existing script to load: ${scriptId}`
          );
          existingScript.addEventListener("load", () => resolve());
        }
        return;
      }

      const script = document.createElement("script");
      script.id = scriptId;
      script.src = SCRIPT_MAP[graphType];
      script.async = true;
      script.onload = () => {
        console.log(`[script] Script loaded for ${graphType}`);
        resolve();
      };
      document.body.appendChild(script);
    });
  };

  useEffect(() => {
    console.log(`[useEffect] Triggered for ${label || graphType}`);

    const scriptId = `desmos-script-${graphType}`;

    const cleanup = () => {
      console.log(
        `[cleanup] Cleaning up Desmos calculator for ${label || graphType}`
      );
      if (calculatorRef.current?.destroy) {
        calculatorRef.current.destroy();
      }
      if (ref.current) {
        ref.current.innerHTML = "";
        (ref.current as any).__desmosInitialized = false;
      }
      calculatorRef.current = null;
    };

    cleanup(); // Clean before loading again
    ensureScript(scriptId).then(() => {
      requestAnimationFrame(initDesmos);
    });

    return cleanup;
  }, [graphType, state]);

  return (
    <div className="mb-4">
      {label && (
        <div className="text-sm font-semibold text-gray-600 mb-1">{label}</div>
      )}
      <div
        id={label?.replace(/\s+/g, "-").toLowerCase() || undefined}
        ref={ref}
        className="w-full h-[400px] border rounded bg-white shadow"
      />
    </div>
  );
}
