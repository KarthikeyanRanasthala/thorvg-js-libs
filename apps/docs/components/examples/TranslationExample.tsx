"use client";

import { Shape, Rect } from "react-thorvg-fiber";
import { ExampleLayout } from "./ExampleLayout";
import { SwCanvasWithLocateFile } from "./SwCanvasWithLocateFile";

const code = `<SwCanvas width={200} height={200} devicePixelRatio={2}>
  <Shape fill={[59, 130, 246, 255]} x={40} y={40}>
    <Rect x={0} y={0} width={60} height={60} />
  </Shape>
  <Shape fill={[234, 88, 12, 255]} x={240} y={240}>
    <Rect x={0} y={0} width={60} height={60} />
  </Shape>
</SwCanvas>`;

export function TranslationExample() {
  return (
    <ExampleLayout code={code}>
      <SwCanvasWithLocateFile width={200} height={200} devicePixelRatio={2}>
        <Shape fill={[59, 130, 246, 255]} x={40} y={40}>
          <Rect x={0} y={0} width={60} height={60} />
        </Shape>
        <Shape fill={[234, 88, 12, 255]} x={240} y={240}>
          <Rect x={0} y={0} width={60} height={60} />
        </Shape>
      </SwCanvasWithLocateFile>
    </ExampleLayout>
  );
}
