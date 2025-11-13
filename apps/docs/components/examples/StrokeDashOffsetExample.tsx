"use client";

import { Shape, Path, PathCommand } from "react-thorvg-fiber";
import { ExampleLayout } from "./ExampleLayout";
import { SwCanvasWithLocateFile } from "./SwCanvasWithLocateFile";

const code = `<SwCanvas width={200} height={200} devicePixelRatio={2}>
  {/* Offset 0 */}
  <Shape
    stroke={[234, 88, 12, 255]}
    strokeWidth={12}
    strokeDash={[30, 15]}
    strokeDashOffset={0}
  >
    <Path
      commands={[PathCommand.MoveTo, PathCommand.LineTo]}
      points={[{x: 50, y: 100}, {x: 350, y: 100}]}
    />
  </Shape>
  {/* Offset 20 - dash pattern starts at different point */}
  <Shape
    stroke={[59, 130, 246, 255]}
    strokeWidth={12}
    strokeDash={[30, 15]}
    strokeDashOffset={20}
  >
    <Path
      commands={[PathCommand.MoveTo, PathCommand.LineTo]}
      points={[{x: 50, y: 200}, {x: 350, y: 200}]}
    />
  </Shape>
</SwCanvas>`;

export function StrokeDashOffsetExample() {
  return (
    <ExampleLayout code={code}>
      <SwCanvasWithLocateFile width={200} height={200} devicePixelRatio={2}>
        {/* Offset 0 */}
        <Shape
          stroke={[234, 88, 12, 255]}
          strokeWidth={12}
          strokeDash={[30, 15]}
          strokeDashOffset={0}
        >
          <Path
            commands={[PathCommand.MoveTo, PathCommand.LineTo]}
            points={[{x: 50, y: 100}, {x: 350, y: 100}]}
          />
        </Shape>
        {/* Offset 20 - dash pattern starts at different point */}
        <Shape
          stroke={[59, 130, 246, 255]}
          strokeWidth={12}
          strokeDash={[30, 15]}
          strokeDashOffset={20}
        >
          <Path
            commands={[PathCommand.MoveTo, PathCommand.LineTo]}
            points={[{x: 50, y: 200}, {x: 350, y: 200}]}
          />
        </Shape>
      </SwCanvasWithLocateFile>
    </ExampleLayout>
  );
}
