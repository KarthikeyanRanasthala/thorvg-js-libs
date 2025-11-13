"use client";

import { Shape, Path, PathCommand, StrokeJoin } from "react-thorvg-fiber";
import { ExampleLayout } from "./ExampleLayout";
import { SwCanvasWithLocateFile } from "./SwCanvasWithLocateFile";

const code = `<SwCanvas width={200} height={200} devicePixelRatio={2}>
  <Shape
    stroke={[234, 88, 12, 255]}
    strokeWidth={20}
    strokeJoin={StrokeJoin.Miter}
    strokeMiterlimit={2}
  >
    <Path
      commands={[PathCommand.MoveTo, PathCommand.LineTo, PathCommand.LineTo]}
      points={[{x: 60, y: 160}, {x: 200, y: 40}, {x: 340, y: 160}]}
    />
  </Shape>
  <Shape
    stroke={[59, 130, 246, 255]}
    strokeWidth={20}
    strokeJoin={StrokeJoin.Miter}
    strokeMiterlimit={10}
  >
    <Path
      commands={[PathCommand.MoveTo, PathCommand.LineTo, PathCommand.LineTo]}
      points={[{x: 60, y: 360}, {x: 200, y: 240}, {x: 340, y: 360}]}
    />
  </Shape>
</SwCanvas>`;

export function StrokeMiterLimitExample() {
  return (
    <ExampleLayout code={code}>
      <SwCanvasWithLocateFile width={200} height={200} devicePixelRatio={2}>
        <Shape
          stroke={[234, 88, 12, 255]}
          strokeWidth={20}
          strokeJoin={StrokeJoin.Miter}
          strokeMiterlimit={2}
        >
          <Path
            commands={[PathCommand.MoveTo, PathCommand.LineTo, PathCommand.LineTo]}
            points={[{x: 60, y: 160}, {x: 200, y: 40}, {x: 340, y: 160}]}
          />
        </Shape>
        <Shape
          stroke={[59, 130, 246, 255]}
          strokeWidth={20}
          strokeJoin={StrokeJoin.Miter}
          strokeMiterlimit={10}
        >
          <Path
            commands={[PathCommand.MoveTo, PathCommand.LineTo, PathCommand.LineTo]}
            points={[{x: 60, y: 360}, {x: 200, y: 240}, {x: 340, y: 360}]}
          />
        </Shape>
      </SwCanvasWithLocateFile>
    </ExampleLayout>
  );
}
