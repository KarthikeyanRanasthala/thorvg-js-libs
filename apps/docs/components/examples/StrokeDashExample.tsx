"use client";

import { Shape, Rect, Path, PathCommand } from "react-thorvg-fiber";
import { ExampleLayout } from "./ExampleLayout";
import { SwCanvasWithLocateFile } from "./SwCanvasWithLocateFile";

const code = `<SwCanvas width={200} height={200} devicePixelRatio={2}>
  {/* Solid rectangle for comparison */}
  <Shape stroke={[200, 200, 200, 255]} strokeWidth={4}>
    <Rect x={100} y={80} width={100} height={100} />
  </Shape>
  {/* Dashed rectangle */}
  <Shape
    stroke={[234, 88, 12, 255]}
    strokeWidth={4}
    strokeDash={[20, 10]}
  >
    <Rect x={100} y={200} width={100} height={100} />
  </Shape>
  {/* Solid line */}
  <Shape stroke={[200, 200, 200, 255]} strokeWidth={4}>
    <Path
      commands={[PathCommand.MoveTo, PathCommand.LineTo]}
      points={[{x: 50, y: 320}, {x: 350, y: 320}]}
    />
  </Shape>
  {/* Dashed line */}
  <Shape
    stroke={[234, 88, 12, 255]}
    strokeWidth={8}
    strokeDash={[30, 15]}
  >
    <Path
      commands={[PathCommand.MoveTo, PathCommand.LineTo]}
      points={[{x: 50, y: 360}, {x: 350, y: 360}]}
    />
  </Shape>
</SwCanvas>`;

export function StrokeDashExample() {
  return (
    <ExampleLayout code={code}>
      <SwCanvasWithLocateFile
        width={200}
        height={200}
        devicePixelRatio={2}
      >
        {/* Solid rectangle for comparison */}
        <Shape stroke={[200, 200, 200, 255]} strokeWidth={4}>
          <Rect x={100} y={80} width={100} height={100} />
        </Shape>
        {/* Dashed rectangle */}
        <Shape
          stroke={[234, 88, 12, 255]}
          strokeWidth={4}
          strokeDash={[20, 10]}
        >
          <Rect x={100} y={200} width={100} height={100} />
        </Shape>
        {/* Solid line */}
        <Shape stroke={[200, 200, 200, 255]} strokeWidth={4}>
          <Path
            commands={[PathCommand.MoveTo, PathCommand.LineTo]}
            points={[{x: 50, y: 320}, {x: 350, y: 320}]}
          />
        </Shape>
        {/* Dashed line */}
        <Shape
          stroke={[234, 88, 12, 255]}
          strokeWidth={8}
          strokeDash={[30, 15]}
        >
          <Path
            commands={[PathCommand.MoveTo, PathCommand.LineTo]}
            points={[{x: 50, y: 360}, {x: 350, y: 360}]}
          />
        </Shape>
      </SwCanvasWithLocateFile>
    </ExampleLayout>
  );
}
