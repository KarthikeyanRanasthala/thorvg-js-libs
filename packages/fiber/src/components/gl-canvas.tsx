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

export type GlCanvasProps = ComponentPropsWithoutRef<"canvas"> & {
  width: number;
  height: number;
  devicePixelRatio?: number;
  locateFile?: (path: string, prefix: string) => string;
  id: string;
};

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
