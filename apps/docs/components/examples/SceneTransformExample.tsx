"use client";

import { Scene, Shape, Rect } from "react-thorvg-fiber";
import { ExampleLayout } from "./ExampleLayout";
import { SwCanvasWithLocateFile } from "./SwCanvasWithLocateFile";

const code = `<SwCanvas width={200} height={200} devicePixelRatio={2}>
  <Scene x={200} y={200} rotation={30} scaleX={1.2} scaleY={1.2}>
    <Shape fill={[34, 197, 94, 255]}>
      <Rect x={-30} y={-30} width={60} height={60} />
    </Shape>
  </Scene>
</SwCanvas>`;

export function SceneTransformExample() {
  return (
    <ExampleLayout code={code}>
      <SwCanvasWithLocateFile width={200} height={200} devicePixelRatio={2}>
        <Scene x={200} y={200} rotation={30} scaleX={1.2} scaleY={1.2}>
          <Shape fill={[34, 197, 94, 255]}>
            <Rect x={-30} y={-30} width={60} height={60} />
          </Shape>
        </Scene>
      </SwCanvasWithLocateFile>
    </ExampleLayout>
  );
}
