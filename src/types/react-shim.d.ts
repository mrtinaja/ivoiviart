// src/types/react-shim.d.ts
import 'preact';

declare module 'react' {
  // Reexporta los tipos de preact/compat para que libs como react-router-dom
  // acepten VNode como si fuera ReactNode.
  export * from 'preact/compat';
  const React: typeof import('preact/compat');
  export default React;
}

declare module 'react-dom' {
  export * from 'preact/compat';
  const ReactDOM: typeof import('preact/compat');
  export default ReactDOM;
}

declare module 'react/jsx-runtime' {
  export * from 'preact/jsx-runtime';
}
