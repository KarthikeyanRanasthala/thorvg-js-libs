"use client";

import { Shape, Path, PathCommand } from "react-thorvg-fiber";
import { ExampleLayout } from "./ExampleLayout";
import { SwCanvasWithLocateFile } from "./SwCanvasWithLocateFile";

const code = `<SwCanvas width={200} height={200} devicePixelRatio={2}>
  <Shape fill={[34, 197, 94, 255]} stroke={[234, 88, 12, 255]} strokeWidth={6}>
    <Path
      commands={[
        PathCommand.MoveTo,
        PathCommand.LineTo,
        PathCommand.CubicTo,
        PathCommand.LineTo,
        PathCommand.Close
      ]}
      points={[
        {x: 200, y: 60},
        {x: 340, y: 160},
        {x: 360, y: 240}, {x: 280, y: 320}, {x: 200, y: 340},
        {x: 60, y: 200}
      ]}
    />
  </Shape>
</SwCanvas>`;

export function ComplexPathExample() {
  return (
    <ExampleLayout code={code}>
      <SwCanvasWithLocateFile width={200} height={200} devicePixelRatio={2}>
        <Shape fill={[34, 197, 94, 255]} stroke={[234, 88, 12, 255]} strokeWidth={6}>
          <Path
            commands={[
              PathCommand.MoveTo,
              PathCommand.LineTo,
              PathCommand.CubicTo,
              PathCommand.LineTo,
              PathCommand.Close
            ]}
            points={[
              {x: 200, y: 60},
              {x: 340, y: 160},
              {x: 360, y: 240}, {x: 280, y: 320}, {x: 200, y: 340},
              {x: 60, y: 200}
            ]}
          />
        </Shape>
      </SwCanvasWithLocateFile>
    </ExampleLayout>
  );
}
