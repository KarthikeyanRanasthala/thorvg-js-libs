import { useEffect, useRef, useState } from "react";
import "./App.css";
import { gsap } from "gsap";

import { Canvas, Rect } from "react-thorvg-fiber";
import wasmUrl from "react-thorvg-fiber/thorvg.wasm?url";

// Helper function to convert HSL to RGB
function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  let r, g, b;

  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

// Pre-calculate all static shape data outside component
const HTML_CANVAS_SIZE = 500;
const CANVAS_SIZE = HTML_CANVAS_SIZE * window.devicePixelRatio;
const NUMBER_OF_RECTANGLES = 1000;

// Calculate how many shapes fit per row/col based on desired count
const SHAPES_PER_SIDE = Math.ceil(Math.sqrt(NUMBER_OF_RECTANGLES));
const SHAPE_SIZE = CANVAS_SIZE / SHAPES_PER_SIDE;

type ShapeData = {
  key: string;
  x: number;
  y: number;
  cx: number;
  cy: number;
  color: [number, number, number, number];
};

const shapeData: ShapeData[] = [];
let shapeCount = 0;
for (
  let row = 0;
  row < SHAPES_PER_SIDE && shapeCount < NUMBER_OF_RECTANGLES;
  row++
) {
  for (
    let col = 0;
    col < SHAPES_PER_SIDE && shapeCount < NUMBER_OF_RECTANGLES;
    col++
  ) {
    const hue = (shapeCount * 360) / NUMBER_OF_RECTANGLES;
    const rgb = hslToRgb(hue / 360, 0.7, 0.6);
    const x = col * SHAPE_SIZE;
    const y = row * SHAPE_SIZE;

    shapeData.push({
      key: `${row}-${col}`,
      x,
      y,
      cx: x + SHAPE_SIZE / 2,
      cy: y + SHAPE_SIZE / 2,
      color: [...rgb, 255] as [number, number, number, number],
    });
    shapeCount++;
  }
}

function App() {
  const [count, setCount] = useState(0);
  const [rotation, setRotation] = useState(0);
  const rotationRef = useRef({ value: 0 });

  useEffect(() => {
    // Use GSAP to continuously rotate shapes with a 10s loop
    gsap.to(rotationRef.current, {
      value: 360,
      duration: 10,
      repeat: -1,
      ease: "none",
      onUpdate: () => {
        setRotation(rotationRef.current.value);
      },
    });
  }, []);

  return (
    <>
      <div>
        <Canvas
          width={HTML_CANVAS_SIZE}
          height={HTML_CANVAS_SIZE}
          wasmPath={wasmUrl}
        >
          {shapeData.map((shape) => (
            <Rect
              key={shape.key}
              x={shape.cx}
              y={shape.cy}
              width={SHAPE_SIZE}
              height={SHAPE_SIZE}
              rotation={rotation}
              fill={shape.color}
            />
          ))}
        </Canvas>
      </div>
      <h1>React + ThorVG</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
      </div>
      <p>
        Edit <code>src/App.tsx</code> and save to test HMR
      </p>
    </>
  );
}

export default App;
