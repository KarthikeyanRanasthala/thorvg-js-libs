"use client";

import { Shape, Circle } from "react-thorvg-fiber";
import { ExampleLayout } from "./ExampleLayout";
import { SwCanvasWithLocateFile } from "./SwCanvasWithLocateFile";

const code = `<SwCanvas width={200} height={200} devicePixelRatio={2}>
  <Shape fill={[234, 88, 12, 255]} opacity={255}>
    <Circle x={140} y={200} radius={40} />
  </Shape>
  <Shape fill={[59, 130, 246, 255]} opacity={128}>
    <Circle x={260} y={200} radius={40} />
  </Shape>
</SwCanvas>`;

export function OpacityExample() {
  return (
    <ExampleLayout code={code}>
      <SwCanvasWithLocateFile width={200} height={200} devicePixelRatio={2}>
        <Shape fill={[234, 88, 12, 255]} opacity={255}>
          <Circle x={140} y={200} radius={40} />
        </Shape>
        <Shape fill={[59, 130, 246, 255]} opacity={128}>
          <Circle x={260} y={200} radius={40} />
        </Shape>
      </SwCanvasWithLocateFile>
    </ExampleLayout>
  );
}
