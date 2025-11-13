"use client";

import { Shape, Circle } from "react-thorvg-fiber";
import { ExampleLayout } from "./ExampleLayout";
import { SwCanvasWithLocateFile } from "./SwCanvasWithLocateFile";

const code = `<SwCanvas width={200} height={200} devicePixelRatio={2}>
  <Shape fill={[234, 88, 12, 255]}>
    <Circle x={200} y={200} radius={50} />
  </Shape>
</SwCanvas>`;

export function CircleExample() {
  return (
    <ExampleLayout code={code}>
      <SwCanvasWithLocateFile width={200} height={200} devicePixelRatio={2}>
        <Shape fill={[234, 88, 12, 255]}>
          <Circle x={200} y={200} radius={50} />
        </Shape>
      </SwCanvasWithLocateFile>
    </ExampleLayout>
  );
}
