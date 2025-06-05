import katex from "katex";

export function LatexPreview({ expression }: { expression: string }) {
  const html = katex.renderToString(expression, {
    throwOnError: false,
  });

  return (
    <div
      className="p-4 border bg-white"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
