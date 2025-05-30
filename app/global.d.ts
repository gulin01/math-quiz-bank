// global.d.ts
declare namespace JSX {
  interface IntrinsicElements {
    // a minimal declaration for <math-field>
    "math-field": {
      // common HTML attributes
      [key: string]: any;
      // the props you actually use:
      value?: string;
      virtualKeyboardMode?: string;
      smartMode?: boolean;
      onInput?: (event: Event) => void;
    };
  }
}
