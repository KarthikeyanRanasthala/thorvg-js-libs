"use client";

import { Scene, Shape, Circle, Rect } from "react-thorvg-fiber";
import { ExampleLayout } from "./ExampleLayout";
import { SwCanvasWithLocateFile } from "./SwCanvasWithLocateFile";

const code = `<SwCanvas width={200} height={200} devicePixelRatio={2}>
  <Scene>
    <Shape fill={[59, 130, 246, 255]}>
      <Rect x={80} y={80} width={50} height={50} />
    </Shape>
    <Shape fill={[234, 88, 12, 255]}>
      <Circle x={260} y={260} radius={30} />
    </Shape>
  </Scene>
</SwCanvas>`;

export function BasicSceneExample() {
  return (
    <ExampleLayout code={code}>
      <SwCanvasWithLocateFile width={200} height={200} devicePixelRatio={2}>
        <Scene>
          <Shape fill={[59, 130, 246, 255]}>
            <Rect x={80} y={80} width={50} height={50} />
          </Shape>
          <Shape fill={[234, 88, 12, 255]}>
            <Circle x={260} y={260} radius={30} />
          </Shape>
        </Scene>
      </SwCanvasWithLocateFile>
    </ExampleLayout>
  );
}
