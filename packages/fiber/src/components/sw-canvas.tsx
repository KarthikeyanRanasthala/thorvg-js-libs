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

export type SwCanvasProps = ComponentPropsWithoutRef<"canvas"> & {
  width: number;
  height: number;
  wasmPath?: string;
  devicePixelRatio?: number;
  locateFile?: (path: string, prefix: string) => string;
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
  const rootRef = useRef<OpaqueRoot>(null);
  const thorvgCanvasRef = useRef<ThorVGSwCanvas>(null);
  const reconcilerRef = useRef(createReconciler());

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

        rootRef.current = createReconcilerContainer({
          reconciler: reconcilerRef.current,
          module,
          canvas: swCanvas,
        });

        // Render the children into the reconciler container
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

  // Update the container when children change
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
