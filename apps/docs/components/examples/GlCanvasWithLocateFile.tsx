"use client";

import { useCallback, type ReactNode } from "react";
import { GlCanvas, type GlCanvasProps } from "react-thorvg-fiber";
// @ts-expect-error - WASM import
import wasmUrl from "react-thorvg-fiber/thorvg-gl.wasm";

interface GlCanvasWithLocateFileProps extends Omit<GlCanvasProps, "locateFile"> {
  children: ReactNode;
}

export function GlCanvasWithLocateFile({
  children,
  ...props
}: GlCanvasWithLocateFileProps) {
  const locateFile = useCallback(() => {
    return wasmUrl;
  }, []);

  return (
    <GlCanvas {...props} locateFile={locateFile}>
      {children}
    </GlCanvas>
  );
}

