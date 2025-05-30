export type PowerTableProblem = {
  id: string;
  question: string;
  expressions: { base: number; exponent: number }[];
  showFields: ("base" | "exponent" | "reading")[];
};
