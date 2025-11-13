"use client";

import { Shape, Circle } from "react-thorvg-fiber";
import { ExampleLayout } from "./ExampleLayout";
import { SwCanvasWithLocateFile } from "./SwCanvasWithLocateFile";

const code = `<SwCanvas width={200} height={200} devicePixelRatio={2}>
  <Shape fill={[34, 197, 94, 255]}>
    <Circle x={200} y={200} rx={70} ry={40} />
  </Shape>
</SwCanvas>`;

export function EllipseExample() {
  return (
    <ExampleLayout code={code}>
      <SwCanvasWithLocateFile width={200} height={200} devicePixelRatio={2}>
        <Shape fill={[34, 197, 94, 255]}>
          <Circle x={200} y={200} rx={70} ry={40} />
        </Shape>
      </SwCanvasWithLocateFile>
    </ExampleLayout>
  );
}
