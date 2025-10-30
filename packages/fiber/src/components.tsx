import {
  ComponentPropsWithoutRef,
  createElement,
  FC,
  PropsWithChildren,
  useCallback,
  useEffect,
  useRef,
} from "react";
import ReactReconciler from "react-reconciler";

import {
  Engine,
  loadWasm,
  SwCanvas as ThorVGSwCanvas,
  GlCanvas as ThorVGGlCanvas,
  TvgColorspace,
} from "bindings";
import { reconciler } from "./reconciler";
import { logger } from "./logger";
import { LegacyRoot } from "react-reconciler/constants";
import { RectProps, CircleProps, GroupProps } from "./types";

/**
 * Helper to flush software canvasElementRef.current pixel buffer to HTML canvasElementRef.current
 */
function flushSwCanvasToHtml(
  swCanvas: ThorVGSwCanvas | null,
  htmlCanvas: HTMLCanvasElement | null
): void {
  if (!htmlCanvas || !swCanvas) return;

  /**
   * Get a zero-copy view of the pixel buffer from WASM memory
   * This creates a Uint8ClampedArray view directly into WASM memory - no copying!
   *
   * Use with ABGR8888 colorspace for direct Canvas ImageData compatibility.
   * ABGR8888 on little-endian systems = RGBA format expected by Canvas.
   */
  const pixelBuffer = new Uint8ClampedArray(
    swCanvas.module.HEAPU8.buffer,
    swCanvas.bufferPtr,
    swCanvas.bufferSize
  );
  const imageData = new ImageData(
    pixelBuffer,
    htmlCanvas.width,
    htmlCanvas.height
  );
  htmlCanvas.getContext("2d")?.putImageData(imageData, 0, 0);
}

type CanvasPropsBase = ComponentPropsWithoutRef<"canvas"> & {
  width: number;
  height: number;
  wasmPath?: string;
  devicePixelRatio?: number;
};

type SwCanvasProps = CanvasPropsBase & {
  engine: "sw";
  id?: string;
};

type GlCanvasProps = CanvasPropsBase & {
  engine: "gl";
  id: string;
};

type CanvasProps = SwCanvasProps | GlCanvasProps;

export const Canvas: FC<PropsWithChildren<CanvasProps>> = ({
  children,
  engine,
  width,
  height,
  wasmPath,
  devicePixelRatio,
  ...props
}) => {
  const canvasElementRef = useRef<HTMLCanvasElement>(null);
  const rootRef = useRef<ReactReconciler.OpaqueRoot>(null);
  const thorvgCanvasRef = useRef<ThorVGSwCanvas | ThorVGGlCanvas>(null);

  useEffect(() => {
    (async () => {
      try {
        const ctx = await loadWasm({ wasmPath });

        const thorvgEngine = new Engine(ctx);
        thorvgEngine.init();

        if (!canvasElementRef.current) {
          throw new Error("Canvas element not found");
        }

        // Get device pixel ratio for high-DPI displays
        const dpr = devicePixelRatio ?? 1;
        const scaledWidth = Math.floor(width * dpr);
        const scaledHeight = Math.floor(height * dpr);

        // Set canvasElementRef.current buffer size to account for DPR
        canvasElementRef.current.width = scaledWidth;
        canvasElementRef.current.height = scaledHeight;
        canvasElementRef.current.style.width = `${width}px`;
        canvasElementRef.current.style.height = `${height}px`;

        // Create ThorVG canvas based on engine type
        if (engine === "sw") {
          const swCanvas = new ThorVGSwCanvas(ctx);
          swCanvas.setTarget(scaledWidth, scaledHeight, TvgColorspace.ABGR8888);
          thorvgCanvasRef.current = swCanvas;
        } else if (engine === "gl") {
          const glCanvas = new ThorVGGlCanvas(
            ctx,
            `#${canvasElementRef.current.id}`
          );
          // GL canvas only supports ABGR8888S (straight alpha)
          glCanvas.setTarget(
            scaledWidth,
            scaledHeight,
            TvgColorspace.ABGR8888S
          );
          thorvgCanvasRef.current = glCanvas;
        } else {
          throw new Error(`Unsupported engine: ${engine}`);
        }

        rootRef.current = reconciler.createContainer(
          {
            ctx,
            canvas: thorvgCanvasRef.current,
          },
          LegacyRoot,
          null,
          false,
          null,
          "",
          logger.error,
          logger.error,
          logger.error,
          () => {},
          null
        );

        // Render the children into the reconciler container
        const flushCallback =
          engine === "sw"
            ? () =>
                flushSwCanvasToHtml(
                  thorvgCanvasRef.current as ThorVGSwCanvas,
                  canvasElementRef.current
                )
            : () => {};

        reconciler.updateContainer(
          children,
          rootRef.current,
          null,
          flushCallback
        );
      } catch (error) {
        logger.error(error);
      }
    })();

    return () => {
      if (rootRef.current) {
        reconciler.updateContainer(null, rootRef.current, null, () => {
          if (thorvgCanvasRef.current) {
            thorvgCanvasRef.current.destroy();
          }
        });
      } else if (thorvgCanvasRef.current) {
        // Fallback if root doesn't exist
        thorvgCanvasRef.current.destroy();
      }
    };
  }, [engine]);

  // Update the container when children change
  useEffect(() => {
    if (
      rootRef.current &&
      thorvgCanvasRef.current &&
      canvasElementRef.current
    ) {
      const flushCallback =
        engine === "sw"
          ? () =>
              flushSwCanvasToHtml(
                thorvgCanvasRef.current as ThorVGSwCanvas,
                canvasElementRef.current!
              )
          : () => {};

      reconciler.updateContainer(
        children,
        rootRef.current,
        null,
        flushCallback
      );
    }
  }, [children, engine]);

  return <canvas ref={canvasElementRef} {...props} />;
};

export const Rect: FC<RectProps> = (props) => createElement("rect", props);

export const Circle: FC<CircleProps> = (props) =>
  createElement("circle", props as Partial<CircleProps>);

export const Group: FC<PropsWithChildren<GroupProps>> = (props) =>
  createElement("group", props);
