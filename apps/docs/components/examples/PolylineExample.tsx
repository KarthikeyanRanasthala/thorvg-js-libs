"use client";

import { Shape, Path, PathCommand } from "react-thorvg-fiber";
import { ExampleLayout } from "./ExampleLayout";
import { SwCanvasWithLocateFile } from "./SwCanvasWithLocateFile";

const code = `<SwCanvas width={200} height={200} devicePixelRatio={2}>
  <Shape stroke={[59, 130, 246, 255]} strokeWidth={8} fill={[59, 130, 246, 100]}>
    <Path
      commands={[
        PathCommand.MoveTo,
        PathCommand.LineTo,
        PathCommand.LineTo,
        PathCommand.LineTo,
        PathCommand.Close
      ]}
      points={[
        {x: 200, y: 60},
        {x: 340, y: 200},
        {x: 200, y: 340},
        {x: 60, y: 200}
      ]}
    />
  </Shape>
</SwCanvas>`;

export function PolylineExample() {
  return (
    <ExampleLayout code={code}>
      <SwCanvasWithLocateFile width={200} height={200} devicePixelRatio={2}>
        <Shape stroke={[59, 130, 246, 255]} strokeWidth={8} fill={[59, 130, 246, 100]}>
          <Path
            commands={[
              PathCommand.MoveTo,
              PathCommand.LineTo,
              PathCommand.LineTo,
              PathCommand.LineTo,
              PathCommand.Close
            ]}
            points={[
              {x: 200, y: 60},
              {x: 340, y: 200},
              {x: 200, y: 340},
              {x: 60, y: 200}
            ]}
          />
        </Shape>
      </SwCanvasWithLocateFile>
    </ExampleLayout>
  );
}
