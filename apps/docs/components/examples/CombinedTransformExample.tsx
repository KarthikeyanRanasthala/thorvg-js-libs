"use client";

import { Shape, Rect } from "react-thorvg-fiber";
import { ExampleLayout } from "./ExampleLayout";
import { SwCanvasWithLocateFile } from "./SwCanvasWithLocateFile";

const code = `<SwCanvas width={200} height={200} devicePixelRatio={2}>
  <Shape
    fill={[34, 197, 94, 255]}
    x={200}
    y={200}
    rotation={30}
    scaleX={1.2}
    scaleY={1.2}
  >
    <Rect x={-40} y={-40} width={80} height={80} />
  </Shape>
</SwCanvas>`;

export function CombinedTransformExample() {
  return (
    <ExampleLayout code={code}>
      <SwCanvasWithLocateFile width={200} height={200} devicePixelRatio={2}>
        <Shape
          fill={[34, 197, 94, 255]}
          x={200}
          y={200}
          rotation={30}
          scaleX={1.2}
          scaleY={1.2}
        >
          <Rect x={-40} y={-40} width={80} height={80} />
        </Shape>
      </SwCanvasWithLocateFile>
    </ExampleLayout>
  );
}
