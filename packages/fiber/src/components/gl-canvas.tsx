import {
  ComponentPropsWithoutRef,
  FC,
  PropsWithChildren,
  useEffect,
  useRef,
} from "react";
import { OpaqueRoot } from "react-reconciler";

import {
  Engine,
  GlCanvas as ThorVGGlCanvas,
  TvgColorspace,
  GlModuleFactory,
} from "bindings";
import {
  createReconcilerContainer,
  updateReconcilerContainer,
  cleanupReconcilerContainer,
  createReconciler,
} from "../reconciler";
import { logger } from "../logger";
import { setupCanvasElement } from "./utils";

/**
 * Custom props specific to the GlCanvas component.
 */
export interface GlCanvasCustomProps {
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

  /**
   * Required unique ID for the canvas element.
   * Used by WebGL context to bind to the canvas.
   */
  id: string;
}

/**
 * Props for the GlCanvas component.
 * Extends standard HTML canvas element props with GlCanvas-specific props.
 */
export type GlCanvasProps = ComponentPropsWithoutRef<"canvas"> & GlCanvasCustomProps;

/**
 * Hardware-accelerated canvas component for ThorVG using WebGL.
 *
 * This component initializes a ThorVG WebGL rendering context and provides
 * a React-based declarative API for rendering 2D vector graphics. It uses GPU-based
 * rendering for better performance with complex scenes compared to the CPU-based SwCanvas.
 *
 * The GlCanvas component:
 * - Initializes the ThorVG WASM module and engine
 * - Creates a WebGL rendering canvas with the specified dimensions
 * - Sets up a React reconciler to handle declarative child components
 * - Automatically handles canvas updates when children or props change
 * - Properly cleans up resources on unmount
 *
 * @param props - Component props including width, height, id, and optional configuration
 * @returns A canvas element with ThorVG WebGL rendering context
 */
export const GlCanvas: FC<PropsWithChildren<GlCanvasProps>> = ({
  children,
  width,
  height,
  devicePixelRatio,
  id,
  locateFile,
  ...props
}) => {
  const canvasElementRef = useRef<HTMLCanvasElement>(null);
  const rootRef = useRef<OpaqueRoot>(null);
  const thorvgCanvasRef = useRef<ThorVGGlCanvas>(null);
  const reconcilerRef = useRef(createReconciler());
  const locateFileRef = useRef(locateFile);

  useEffect(() => {
    (async () => {
      try {
        const module = await GlModuleFactory({
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

        // Create ThorVG GL canvas
        const glCanvas = new ThorVGGlCanvas(module, `#${id}`);
        // GL canvas only supports ABGR8888S (straight alpha)
        glCanvas.setTarget(scaledWidth, scaledHeight, TvgColorspace.ABGR8888S);
        thorvgCanvasRef.current = glCanvas;

        rootRef.current = createReconcilerContainer({
          reconciler: reconcilerRef.current,
          module,
          canvas: glCanvas,
        });

        // Render the children into the reconciler container
        updateReconcilerContainer({
          children,
          root: rootRef.current,
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
  }, [width, height, devicePixelRatio, id]);

  useEffect(() => {
    if (
      rootRef.current &&
      thorvgCanvasRef.current &&
      canvasElementRef.current
    ) {
      updateReconcilerContainer({
        children,
        root: rootRef.current,
        reconciler: reconcilerRef.current,
      });
    }
  }, [children]);

  return <canvas ref={canvasElementRef} id={id} {...props} />;
};
