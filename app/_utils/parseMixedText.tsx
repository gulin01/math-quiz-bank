// utils/parseMixedText.tsx
import { ReactNode } from "react";
import { InlineMath } from "react-katex";

export function parseMixedText(input: string): ReactNode[] {
  const parts = input.split(/(\$[^$]+\$)/g);
  return parts.map((part, idx) => {
    if (part.startsWith("$") && part.endsWith("$")) {
      // Strip leading/trailing $ and remove any newline
      const mathContent = part.slice(1, -1).replace(/\r?\n/g, "");
      return <InlineMath key={idx} math={mathContent} />;
    }
    return <span key={idx}>{part}</span>;
  });
}
