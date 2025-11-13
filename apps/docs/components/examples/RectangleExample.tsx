"use client";

import { Shape, Rect } from "react-thorvg-fiber";
import { ExampleLayout } from "./ExampleLayout";
import { SwCanvasWithLocateFile } from "./SwCanvasWithLocateFile";

const code = `<SwCanvas width={200} height={200} devicePixelRatio={2}>
  <Shape fill={[59, 130, 246, 255]}>
    <Rect x={150} y={150} width={100} height={100} />
  </Shape>
</SwCanvas>`;

export function RectangleExample() {
  return (
    <ExampleLayout code={code}>
      <SwCanvasWithLocateFile width={200} height={200} devicePixelRatio={2}>
        <Shape fill={[59, 130, 246, 255]}>
          <Rect x={150} y={150} width={100} height={100} />
        </Shape>
      </SwCanvasWithLocateFile>
    </ExampleLayout>
  );
}
