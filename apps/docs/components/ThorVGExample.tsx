"use client";

import { useCallback } from "react";
import { SwCanvas, Shape, Rect } from "react-thorvg-fiber";
// @ts-expect-error - WASM import
import wasmUrl from "react-thorvg-fiber/thorvg-sw.wasm";

export function ThorVGExample() {
  const locateFile = useCallback(() => {
    return wasmUrl;
  }, []);

  return (
    <div className="p-4">
      <SwCanvas
        width={400}
        height={300}
        devicePixelRatio={2}
        locateFile={locateFile}
      >
        <Shape x={200} y={150} fill={[255, 0, 0, 255]}>
          <Rect x={-50} y={-50} width={100} height={100} />
        </Shape>
      </SwCanvas>
    </div>
  );
}
