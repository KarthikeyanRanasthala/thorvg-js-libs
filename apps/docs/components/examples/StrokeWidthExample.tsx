"use client";

import { Shape, Circle } from "react-thorvg-fiber";
import { ExampleLayout } from "./ExampleLayout";
import { SwCanvasWithLocateFile } from "./SwCanvasWithLocateFile";

const code = `<SwCanvas width={200} height={200} devicePixelRatio={2}>
  <Shape stroke={[234, 88, 12, 255]} strokeWidth={4}>
    <Circle x={120} y={200} radius={25} />
  </Shape>
  <Shape stroke={[234, 88, 12, 255]} strokeWidth={12}>
    <Circle x={280} y={200} radius={25} />
  </Shape>
</SwCanvas>`;

export function StrokeWidthExample() {
  return (
    <ExampleLayout code={code}>
      <SwCanvasWithLocateFile width={200} height={200} devicePixelRatio={2}>
        <Shape stroke={[234, 88, 12, 255]} strokeWidth={4}>
          <Circle x={120} y={200} radius={25} />
        </Shape>
        <Shape stroke={[234, 88, 12, 255]} strokeWidth={12}>
          <Circle x={280} y={200} radius={25} />
        </Shape>
      </SwCanvasWithLocateFile>
    </ExampleLayout>
  );
}
