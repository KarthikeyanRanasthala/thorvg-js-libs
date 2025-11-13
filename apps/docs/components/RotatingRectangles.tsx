"use client";

import { useEffect, useRef, useState } from "react";
import { Shape, Rect } from "react-thorvg-fiber";
import { SwCanvasWithLocateFile } from "./examples/SwCanvasWithLocateFile";

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

const DPR = 2;
const HTML_CANVAS_SIZE = 400;
const CANVAS_SIZE = HTML_CANVAS_SIZE * DPR;
const NUMBER_OF_RECTANGLES = 1000;

// Calculate how many shapes fit per row/col based on desired count
const SHAPES_PER_SIDE = Math.ceil(Math.sqrt(NUMBER_OF_RECTANGLES));
const SHAPE_SIZE = CANVAS_SIZE / SHAPES_PER_SIDE;
const RADIUS = SHAPE_SIZE / 2;

type ShapeData = {
  key: string;
  x: number;
  y: number;
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
    const x = col * SHAPE_SIZE + RADIUS;
    const y = row * SHAPE_SIZE + RADIUS;

    shapeData.push({
      key: `${row}-${col}`,
      x,
      y,
      color: [...rgb, 255] as [number, number, number, number],
    });
    shapeCount++;
  }
}

export function RotatingRectangles() {
  const [rotation, setRotation] = useState(0);
  const animationRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const startTime = Date.now();
    const duration = 10000; // 10 seconds for full rotation

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = (elapsed % duration) / duration;
      setRotation(progress * 360);
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <div className="flex items-center justify-center">
      <SwCanvasWithLocateFile
        width={HTML_CANVAS_SIZE}
        height={HTML_CANVAS_SIZE}
        devicePixelRatio={DPR}
      >
        {shapeData.map((shape) => (
          <Shape
            key={shape.key}
            x={shape.x}
            y={shape.y}
            fill={shape.color}
            rotation={rotation}
          >
            <Rect
              x={-SHAPE_SIZE / 2}
              y={-SHAPE_SIZE / 2}
              width={SHAPE_SIZE}
              height={SHAPE_SIZE}
            />
          </Shape>
        ))}
      </SwCanvasWithLocateFile>
    </div>
  );
}
