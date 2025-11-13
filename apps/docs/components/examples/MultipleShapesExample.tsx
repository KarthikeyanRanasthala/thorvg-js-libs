"use client";

import { Shape, Circle, Rect } from "react-thorvg-fiber";
import { ExampleLayout } from "./ExampleLayout";
import { SwCanvasWithLocateFile } from "./SwCanvasWithLocateFile";

const code = `<SwCanvas width={200} height={200} devicePixelRatio={2}>
  <Shape fill={[59, 130, 246, 255]}>
    <Rect x={60} y={60} width={60} height={60} />
  </Shape>
  <Shape fill={[234, 88, 12, 255]}>
    <Circle x={260} y={120} radius={30} />
  </Shape>
  <Shape fill={[34, 197, 94, 255]}>
    <Rect x={220} y={220} width={60} height={60} rx={10} ry={10} />
  </Shape>
</SwCanvas>`;

export function MultipleShapesExample() {
  return (
    <ExampleLayout code={code}>
      <SwCanvasWithLocateFile width={200} height={200} devicePixelRatio={2}>
        <Shape fill={[59, 130, 246, 255]}>
          <Rect x={60} y={60} width={60} height={60} />
        </Shape>
        <Shape fill={[234, 88, 12, 255]}>
          <Circle x={260} y={120} radius={30} />
        </Shape>
        <Shape fill={[34, 197, 94, 255]}>
          <Rect x={220} y={220} width={60} height={60} rx={10} ry={10} />
        </Shape>
      </SwCanvasWithLocateFile>
    </ExampleLayout>
  );
}
