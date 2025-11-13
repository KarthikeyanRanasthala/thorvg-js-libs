import {
  ComponentPropsWithoutRef,
  FC,
  PropsWithChildren,
  useCallback,
  useEffect,
  useRef,
} from "react";
import { OpaqueRoot } from "react-reconciler";

import {
  Engine,
  SwCanvas as ThorVGSwCanvas,
  TvgColorspace,
  SwModuleFactory,
} from "bindings";
import {
  createReconcilerContainer,
  updateReconcilerContainer,
  cleanupReconcilerContainer,
  createReconciler,
} from "../reconciler";
import { logger } from "../logger";
import { flushSwCanvasToHtmlCanvas, setupCanvasElement } from "./utils";

/**
 * Custom props specific to the SwCanvas component.
 */
export interface SwCanvasCustomProps {
  /**
   * Width of the canvas in CSS pixels.
   */
  width: number;

  /**
   * Height of the canvas in CSS pixels.
   */
  height: number;

  /**
   * Device pixel ratio for high-DPI displays.
   * Defaults to `window.devicePixelRatio` if not specified.
   * @default window.devicePixelRatio
   */
  devicePixelRatio?: number;

  /**
   * Optional function to customize the location of WebAssembly files.
   * This is useful for environments with custom asset paths or CDN configurations.
   *
   * @param path - The requested file path
   * @param prefix - The default prefix for the file
   * @returns The resolved file path
   */
  locateFile?: (path: string, prefix: string) => string;
}

/**
 * Props for the SwCanvas component.
 * Extends standard HTML canvas element props with SwCanvas-specific props.
 */
export type SwCanvasProps = ComponentPropsWithoutRef<"canvas"> & SwCanvasCustomProps;

/**
 * Software-rendered canvas component for ThorVG.
 *
 * This component initializes a ThorVG software rendering context and provides
 * a React-based declarative API for rendering 2D vector graphics. It uses CPU-based
 * rendering, which is more compatible across different platforms but may be slower
 * than the GL (WebGL) variant for complex scenes.
 *
 * The SwCanvas component:
 * - Initializes the ThorVG WASM module and engine
 * - Creates a software rendering canvas with the specified dimensions
 * - Sets up a React reconciler to handle declarative child components
 * - Automatically handles canvas updates when children or props change
 * - Properly cleans up resources on unmount
 *
 * @param props - Component props including width, height, and optional configuration
 * @returns A canvas element with ThorVG software rendering context
 */
export const SwCanvas: FC<PropsWithChildren<SwCanvasProps>> = ({
  children,
  width,
  height,
  devicePixelRatio,
  locateFile,
  ...props
}) => {
  const canvasElementRef = useRef<HTMLCanvasElement>(null);
  const rootRef = useRef<OpaqueRoot>(null);
  const thorvgCanvasRef = useRef<ThorVGSwCanvas>(null);
  const reconcilerRef = useRef(createReconciler());
  const locateFileRef = useRef(locateFile);

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
          locateFile: locateFileRef.current,
        });
        const engine = new Engine(module);
        engine.init();

        const { scaledWidth, scaledHeight } = setupCanvasElement(
          canvasElementRef.current,
          width,
          height,
          devicePixelRatio
        );

        const swCanvas = new ThorVGSwCanvas(module);
        swCanvas.setTarget(scaledWidth, scaledHeight, TvgColorspace.ABGR8888);
        thorvgCanvasRef.current = swCanvas;

        rootRef.current = createReconcilerContainer({
          reconciler: reconcilerRef.current,
          module,
          canvas: swCanvas,
        });

        updateReconcilerContainer({
          children,
          root: rootRef.current,
          callback: flushToCanvas,
          reconciler: reconcilerRef.current,
        });
      } catch (error) {
        logger.error(error);
      }
    })();

    return () => {
      cleanupReconcilerContainer({
        root: rootRef.current,
        canvas: thorvgCanvasRef.current,
        reconciler: reconcilerRef.current,
      });
    };
  }, [width, height, devicePixelRatio]);

  useEffect(() => {
    if (
      rootRef.current &&
      thorvgCanvasRef.current &&
      canvasElementRef.current
    ) {
      updateReconcilerContainer({
        children,
        root: rootRef.current,
        callback: flushToCanvas,
        reconciler: reconcilerRef.current,
      });
    }
  }, [children, flushToCanvas]);

  return <canvas ref={canvasElementRef} {...props} />;
};
