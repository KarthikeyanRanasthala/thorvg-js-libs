"use client";

import { Shape, Circle } from "react-thorvg-fiber";
import { ExampleLayout } from "./ExampleLayout";
import { SwCanvasWithLocateFile } from "./SwCanvasWithLocateFile";

const code = `<SwCanvas width={200} height={200} devicePixelRatio={2}>
  <Shape
    fill={[59, 130, 246, 255]}
    stroke={[234, 88, 12, 255]}
    strokeWidth={12}
    opacity={180}
  >
    <Circle x={200} y={200} radius={50} />
  </Shape>
</SwCanvas>`;

export function OpacityFillStrokeExample() {
  return (
    <ExampleLayout code={code}>
      <SwCanvasWithLocateFile width={200} height={200} devicePixelRatio={2}>
        <Shape
          fill={[59, 130, 246, 255]}
          stroke={[234, 88, 12, 255]}
          strokeWidth={12}
          opacity={180}
        >
          <Circle x={200} y={200} radius={50} />
        </Shape>
      </SwCanvasWithLocateFile>
    </ExampleLayout>
  );
}
