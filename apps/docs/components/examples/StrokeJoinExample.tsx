"use client";

import { Shape, Path, PathCommand, StrokeJoin } from "react-thorvg-fiber";
import { ExampleLayout } from "./ExampleLayout";
import { SwCanvasWithLocateFile } from "./SwCanvasWithLocateFile";

const code = `<SwCanvas width={200} height={200} devicePixelRatio={2}>
  {/* Miter - sharp pointed corner */}
  <Shape stroke={[234, 88, 12, 255]} strokeWidth={24} strokeJoin={StrokeJoin.Miter}>
    <Path
      commands={[PathCommand.MoveTo, PathCommand.LineTo, PathCommand.LineTo]}
      points={[{x: 40, y: 140}, {x: 200, y: 40}, {x: 360, y: 140}]}
    />
  </Shape>
  {/* Round - rounded corner */}
  <Shape stroke={[59, 130, 246, 255]} strokeWidth={24} strokeJoin={StrokeJoin.Round}>
    <Path
      commands={[PathCommand.MoveTo, PathCommand.LineTo, PathCommand.LineTo]}
      points={[{x: 40, y: 260}, {x: 200, y: 160}, {x: 360, y: 260}]}
    />
  </Shape>
  {/* Bevel - flat beveled corner */}
  <Shape stroke={[34, 197, 94, 255]} strokeWidth={24} strokeJoin={StrokeJoin.Bevel}>
    <Path
      commands={[PathCommand.MoveTo, PathCommand.LineTo, PathCommand.LineTo]}
      points={[{x: 40, y: 380}, {x: 200, y: 280}, {x: 360, y: 380}]}
    />
  </Shape>
</SwCanvas>`;

export function StrokeJoinExample() {
  return (
    <ExampleLayout code={code}>
      <SwCanvasWithLocateFile width={200} height={200} devicePixelRatio={2}>
        {/* Miter - sharp pointed corner */}
        <Shape stroke={[234, 88, 12, 255]} strokeWidth={24} strokeJoin={StrokeJoin.Miter}>
          <Path
            commands={[PathCommand.MoveTo, PathCommand.LineTo, PathCommand.LineTo]}
            points={[{x: 40, y: 140}, {x: 200, y: 40}, {x: 360, y: 140}]}
          />
        </Shape>
        {/* Round - rounded corner */}
        <Shape stroke={[59, 130, 246, 255]} strokeWidth={24} strokeJoin={StrokeJoin.Round}>
          <Path
            commands={[PathCommand.MoveTo, PathCommand.LineTo, PathCommand.LineTo]}
            points={[{x: 40, y: 260}, {x: 200, y: 160}, {x: 360, y: 260}]}
          />
        </Shape>
        {/* Bevel - flat beveled corner */}
        <Shape stroke={[34, 197, 94, 255]} strokeWidth={24} strokeJoin={StrokeJoin.Bevel}>
          <Path
            commands={[PathCommand.MoveTo, PathCommand.LineTo, PathCommand.LineTo]}
            points={[{x: 40, y: 380}, {x: 200, y: 280}, {x: 360, y: 380}]}
          />
        </Shape>
      </SwCanvasWithLocateFile>
    </ExampleLayout>
  );
}
