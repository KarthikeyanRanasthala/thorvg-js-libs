"use client";

import { Shape, Path, PathCommand } from "react-thorvg-fiber";
import { ExampleLayout } from "./ExampleLayout";
import { SwCanvasWithLocateFile } from "./SwCanvasWithLocateFile";

const code = `<SwCanvas width={200} height={200} devicePixelRatio={2}>
  <Shape stroke={[234, 88, 12, 255]} strokeWidth={8}>
    <Path
      commands={[PathCommand.MoveTo, PathCommand.CubicTo]}
      points={[
        {x: 60, y: 200},
        {x: 140, y: 60},
        {x: 260, y: 340},
        {x: 340, y: 200}
      ]}
    />
  </Shape>
</SwCanvas>`;

export function CubicBezierExample() {
  return (
    <ExampleLayout code={code}>
      <SwCanvasWithLocateFile width={200} height={200} devicePixelRatio={2}>
        <Shape stroke={[234, 88, 12, 255]} strokeWidth={8}>
          <Path
            commands={[PathCommand.MoveTo, PathCommand.CubicTo]}
            points={[
              {x: 60, y: 200},
              {x: 140, y: 60},
              {x: 260, y: 340},
              {x: 340, y: 200}
            ]}
          />
        </Shape>
      </SwCanvasWithLocateFile>
    </ExampleLayout>
  );
}
