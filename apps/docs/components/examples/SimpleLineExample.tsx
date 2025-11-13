"use client";

import { Shape, Path, PathCommand } from "react-thorvg-fiber";
import { ExampleLayout } from "./ExampleLayout";
import { SwCanvasWithLocateFile } from "./SwCanvasWithLocateFile";

const code = `<SwCanvas width={200} height={200} devicePixelRatio={2}>
  <Shape stroke={[234, 88, 12, 255]} strokeWidth={8}>
    <Path
      commands={[PathCommand.MoveTo, PathCommand.LineTo]}
      points={[{x: 100, y: 100}, {x: 300, y: 300}]}
    />
  </Shape>
</SwCanvas>`;

export function SimpleLineExample() {
  return (
    <ExampleLayout code={code}>
      <SwCanvasWithLocateFile width={200} height={200} devicePixelRatio={2}>
        <Shape stroke={[234, 88, 12, 255]} strokeWidth={8}>
          <Path
            commands={[PathCommand.MoveTo, PathCommand.LineTo]}
            points={[{x: 100, y: 100}, {x: 300, y: 300}]}
          />
        </Shape>
      </SwCanvasWithLocateFile>
    </ExampleLayout>
  );
}
