export const formulaLibrary = [
  {
    id: "linear_1",
    name: "Linear Equation",
    formula: "y = mx + b",
    variables: ["m", "b"],
    defaults: { m: 1, b: 0 },
  },
  {
    id: "quadratic_1",
    name: "Quadratic Equation",
    formula: "y = ax^2 + bx + c",
    variables: ["a", "b", "c"],
    defaults: { a: 1, b: 0, c: 0 },
  },
  {
    id: "circle_1",
    name: "Circle",
    formula: "(x - h)^2 + (y - k)^2 = r^2",
    variables: ["h", "k", "r"],
    defaults: { h: 0, k: 0, r: 5 },
  },
  {
    id: "sine_wave",
    name: "Sine Wave",
    formula: "y = A sin(Bx + C)",
    variables: ["A", "B", "C"],
    defaults: { A: 1, B: 1, C: 0 },
  },
];
