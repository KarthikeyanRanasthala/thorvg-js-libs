"use client";

import { Shape, Rect } from "react-thorvg-fiber";
import { ExampleLayout } from "./ExampleLayout";
import { SwCanvasWithLocateFile } from "./SwCanvasWithLocateFile";

const code = `<SwCanvas width={200} height={200} devicePixelRatio={2}>
  <Shape fill={[59, 130, 246, 255]} scaleX={1.5} scaleY={0.8}>
    <Rect x={120} y={150} width={80} height={50} />
  </Shape>
</SwCanvas>`;

export function ScaleExample() {
  return (
    <ExampleLayout code={code}>
      <SwCanvasWithLocateFile width={200} height={200} devicePixelRatio={2}>
        <Shape fill={[59, 130, 246, 255]} scaleX={1.5} scaleY={0.8}>
          <Rect x={120} y={150} width={80} height={50} />
        </Shape>
      </SwCanvasWithLocateFile>
    </ExampleLayout>
  );
}
