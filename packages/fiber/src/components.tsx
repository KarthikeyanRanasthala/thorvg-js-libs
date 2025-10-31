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
  SwCanvas as ThorVGSwCanvas,
  GlCanvas as ThorVGGlCanvas,
  TvgColorspace,
  AnyThorVGModule,
  SwModuleFactory,
  GlModuleFactory,
} from "bindings";
import { reconciler } from "./reconciler";
import { logger } from "./logger";
import { LegacyRoot } from "react-reconciler/constants";
import { RectProps, CircleProps, GroupProps } from "./types";

/**
 * Helper to flush software canvas pixel buffer to HTML canvas
 */
const flushSwCanvasToHtmlCanvas = (
  swCanvas: ThorVGSwCanvas | null,
  htmlCanvas: HTMLCanvasElement | null
): void => {
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
};

const createReconcilerContainer = (
  module: AnyThorVGModule,
  canvas: ThorVGSwCanvas | ThorVGGlCanvas
): ReactReconciler.OpaqueRoot => {
  return reconciler.createContainer(
    {
      module,
      canvas,
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
};

const updateReconcilerContainer = (
  children: React.ReactNode,
  root: ReactReconciler.OpaqueRoot,
  callback?: () => void
): void => {
  reconciler.updateContainer(children, root, null, callback ?? (() => {}));
};

const cleanupReconcilerContainer = (
  root: ReactReconciler.OpaqueRoot | null,
  canvas: ThorVGSwCanvas | ThorVGGlCanvas | null
): void => {
  if (root) {
    reconciler.updateContainer(null, root, null, () => {
      if (canvas) {
        canvas.destroy();
      }
    });
  } else if (canvas) {
    // Fallback if root doesn't exist
    canvas.destroy();
  }
};

const setupCanvasElement = (
  canvasElement: HTMLCanvasElement | null,
  width: number,
  height: number,
  devicePixelRatio?: number
): { scaledWidth: number; scaledHeight: number } => {
  if (!canvasElement) {
    throw new Error("Canvas element not found");
  }

  const dpr = devicePixelRatio ?? 1;
  const scaledWidth = Math.floor(width * dpr);
  const scaledHeight = Math.floor(height * dpr);

  canvasElement.width = scaledWidth;
  canvasElement.height = scaledHeight;
  canvasElement.style.width = `${width}px`;
  canvasElement.style.height = `${height}px`;

  return { scaledWidth, scaledHeight };
};

type CanvasPropsBase = ComponentPropsWithoutRef<"canvas"> & {
  width: number;
  height: number;
  wasmPath?: string;
  devicePixelRatio?: number;
  locateFile?: (path: string, prefix: string) => string;
};

export type SwCanvasProps = Omit<CanvasPropsBase, "id">;

export type GlCanvasProps = CanvasPropsBase & {
  id: string;
};

export const SwCanvas: FC<PropsWithChildren<SwCanvasProps>> = ({
  children,
  width,
  height,
  wasmPath,
  devicePixelRatio,
  locateFile,
  ...props
}) => {
  const canvasElementRef = useRef<HTMLCanvasElement>(null);
  const rootRef = useRef<ReactReconciler.OpaqueRoot>(null);
  const thorvgCanvasRef = useRef<ThorVGSwCanvas>(null);

  const flushToCanvas = useCallback(() => {
    flushSwCanvasToHtmlCanvas(
      thorvgCanvasRef.current,
      canvasElementRef.current
    );
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const module = await SwModuleFactory({
          locateFile,
        });
        const engine = new Engine(module);
        engine.init();

        const { scaledWidth, scaledHeight } = setupCanvasElement(
          canvasElementRef.current,
          width,
          height,
          devicePixelRatio
        );

        // Create ThorVG software canvas
        const swCanvas = new ThorVGSwCanvas(module);
        swCanvas.setTarget(scaledWidth, scaledHeight, TvgColorspace.ABGR8888);
        thorvgCanvasRef.current = swCanvas;

        rootRef.current = createReconcilerContainer(module, swCanvas);

        // Render the children into the reconciler container
        updateReconcilerContainer(children, rootRef.current, flushToCanvas);
      } catch (error) {
        logger.error(error);
      }
    })();

    return () => {
      cleanupReconcilerContainer(rootRef.current, thorvgCanvasRef.current);
    };
  }, [width, height, devicePixelRatio]);

  // Update the container when children change
  useEffect(() => {
    if (
      rootRef.current &&
      thorvgCanvasRef.current &&
      canvasElementRef.current
    ) {
      updateReconcilerContainer(children, rootRef.current, flushToCanvas);
    }
  }, [children, flushToCanvas]);

  return <canvas ref={canvasElementRef} {...props} />;
};

export const GlCanvas: FC<PropsWithChildren<GlCanvasProps>> = ({
  children,
  width,
  height,
  wasmPath,
  devicePixelRatio,
  id,
  locateFile,
  ...props
}) => {
  const canvasElementRef = useRef<HTMLCanvasElement>(null);
  const rootRef = useRef<ReactReconciler.OpaqueRoot>(null);
  const thorvgCanvasRef = useRef<ThorVGGlCanvas>(null);

  useEffect(() => {
    (async () => {
      try {
        const module = await GlModuleFactory({
          locateFile,
        });
        const engine = new Engine(module);
        engine.init();

        const { scaledWidth, scaledHeight } = setupCanvasElement(
          canvasElementRef.current,
          width,
          height,
          devicePixelRatio
        );

        // Create ThorVG GL canvas
        const glCanvas = new ThorVGGlCanvas(module, `#${id}`);
        // GL canvas only supports ABGR8888S (straight alpha)
        glCanvas.setTarget(scaledWidth, scaledHeight, TvgColorspace.ABGR8888S);
        thorvgCanvasRef.current = glCanvas;

        rootRef.current = createReconcilerContainer(module, glCanvas);

        // Render the children into the reconciler container
        updateReconcilerContainer(children, rootRef.current);
      } catch (error) {
        logger.error(error);
      }
    })();

    return () => {
      cleanupReconcilerContainer(rootRef.current, thorvgCanvasRef.current);
    };
  }, [wasmPath, width, height, devicePixelRatio, id]);

  useEffect(() => {
    if (
      rootRef.current &&
      thorvgCanvasRef.current &&
      canvasElementRef.current
    ) {
      updateReconcilerContainer(children, rootRef.current);
    }
  }, [children]);

  return <canvas ref={canvasElementRef} id={id} {...props} />;
};

export const Rect: FC<RectProps> = (props) => createElement("rect", props);

export const Circle: FC<CircleProps> = (props) =>
  createElement("circle", props as Partial<CircleProps>);

export const Group: FC<PropsWithChildren<GroupProps>> = (props) =>
  createElement("group", props);
