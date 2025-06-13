// utils/parseMixedText.tsx
import katex from "katex";
import "katex/dist/katex.min.css";
import React from "react";

export function parseMixedText(input: string): React.ReactNode[] {
  const parts = input.split(/(\$[^$]+\$)/g); // Split by $...$

  return parts.map((part, index) => {
    if (part.startsWith("$") && part.endsWith("$")) {
      const latex = part.slice(1, -1); // Remove surrounding $
      try {
        const html = katex.renderToString(latex, {
          throwOnError: false,
        });
        return (
          <span
            key={index}
            dangerouslySetInnerHTML={{ __html: html }}
            className="mx-1"
          />
        );
      } catch (err) {
        return (
          <span key={index} className="text-red-600">
            [Invalid LaTeX]
          </span>
        );
      }
    } else {
      return <span key={index}>{part}</span>;
    }
  });
}
