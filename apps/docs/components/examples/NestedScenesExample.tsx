"use client";

import { Scene, Shape, Circle, Rect } from "react-thorvg-fiber";
import { ExampleLayout } from "./ExampleLayout";
import { SwCanvasWithLocateFile } from "./SwCanvasWithLocateFile";

const code = `<SwCanvas width={200} height={200} devicePixelRatio={2}>
  <Scene x={100} y={100}>
    <Shape fill={[59, 130, 246, 255]}>
      <Rect x={0} y={0} width={40} height={40} />
    </Shape>
    <Scene x={20} y={20}>
      <Shape fill={[234, 88, 12, 255]}>
        <Circle x={20} y={20} radius={15} />
      </Shape>
    </Scene>
  </Scene>
</SwCanvas>`;

export function NestedScenesExample() {
  return (
    <ExampleLayout code={code}>
      <SwCanvasWithLocateFile width={200} height={200} devicePixelRatio={2}>
        <Scene x={100} y={100}>
          <Shape fill={[59, 130, 246, 255]}>
            <Rect x={0} y={0} width={40} height={40} />
          </Shape>
          <Scene x={20} y={20}>
            <Shape fill={[234, 88, 12, 255]}>
              <Circle x={20} y={20} radius={15} />
            </Shape>
          </Scene>
        </Scene>
      </SwCanvasWithLocateFile>
    </ExampleLayout>
  );
}
