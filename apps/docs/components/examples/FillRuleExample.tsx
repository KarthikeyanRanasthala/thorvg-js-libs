"use client";

import { Shape, Path, PathCommand, FillRule } from "react-thorvg-fiber";
import { ExampleLayout } from "./ExampleLayout";
import { SwCanvasWithLocateFile } from "./SwCanvasWithLocateFile";

const code = `<SwCanvas width={200} height={200} devicePixelRatio={2}>
  <Shape fill={[59, 130, 246, 255]} fillRule={FillRule.EvenOdd}>
    <Path
      commands={[
        PathCommand.MoveTo, PathCommand.LineTo, PathCommand.LineTo,
        PathCommand.LineTo, PathCommand.LineTo, PathCommand.Close
      ]}
      points={[
        {x: 200, y: 40}, {x: 360, y: 360}, {x: 40, y: 140},
        {x: 360, y: 140}, {x: 40, y: 360}
      ]}
    />
  </Shape>
</SwCanvas>`;

export function FillRuleExample() {
  return (
    <ExampleLayout code={code}>
      <SwCanvasWithLocateFile width={200} height={200} devicePixelRatio={2}>
        <Shape fill={[59, 130, 246, 255]} fillRule={FillRule.EvenOdd}>
          <Path
            commands={[
              PathCommand.MoveTo, PathCommand.LineTo, PathCommand.LineTo,
              PathCommand.LineTo, PathCommand.LineTo, PathCommand.Close
            ]}
            points={[
              {x: 200, y: 40}, {x: 360, y: 360}, {x: 40, y: 140},
              {x: 360, y: 140}, {x: 40, y: 360}
            ]}
          />
        </Shape>
      </SwCanvasWithLocateFile>
    </ExampleLayout>
  );
}
