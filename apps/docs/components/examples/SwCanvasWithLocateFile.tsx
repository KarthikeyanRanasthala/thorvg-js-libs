"use client";

import { useCallback, type ReactNode } from "react";
import { SwCanvas, type SwCanvasProps } from "react-thorvg-fiber";
// @ts-expect-error - WASM import
import wasmUrl from "react-thorvg-fiber/thorvg-sw.wasm";

interface SwCanvasWithLocateFileProps extends Omit<SwCanvasProps, "locateFile"> {
  children: ReactNode;
}

export function SwCanvasWithLocateFile({
  children,
  ...props
}: SwCanvasWithLocateFileProps) {
  const locateFile = useCallback(() => {
    return wasmUrl;
  }, []);

  return (
    <SwCanvas {...props} locateFile={locateFile}>
      {children}
    </SwCanvas>
  );
}

