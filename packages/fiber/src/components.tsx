import {
  ComponentPropsWithoutRef,
  createElement,
  FC,
  PropsWithChildren,
  useEffect,
  useRef,
} from "react";
import ReactReconciler from "react-reconciler";

import {
  Engine,
  loadWasm,
  SwCanvas as ThorVGSwCanvas,
  TvgColorspace,
} from "bindings";
import { reconciler } from "./reconciler";
import { logger } from "./logger";
import { LegacyRoot } from "react-reconciler/constants";
import { RectProps, CircleProps, GroupProps } from "./types";

interface SwCanvasProps extends ComponentPropsWithoutRef<"canvas"> {
  width: number;
  height: number;
  wasmPath?: string;
}

export const SwCanvas: FC<PropsWithChildren<SwCanvasProps>> = ({
  children,
  width,
  height,
  wasmPath,
  ...props
}) => {
  const canvasElementRef = useRef<HTMLCanvasElement>(null);
  const rootRef = useRef<ReactReconciler.OpaqueRoot>(null);
  const thorvgCanvasRef = useRef<ThorVGSwCanvas>(null);

  useEffect(() => {
    (async () => {
      try {
        const ctx = await loadWasm({ wasmPath });

        const engine = new Engine(ctx);
        engine.init();

        // Get device pixel ratio for high-DPI displays
        const dpr = window.devicePixelRatio || 1;
        const scaledWidth = Math.floor(width * dpr);
        const scaledHeight = Math.floor(height * dpr);

        // Set canvas buffer size to account for DPR
        if (canvasElementRef.current) {
          canvasElementRef.current.width = scaledWidth;
          canvasElementRef.current.height = scaledHeight;
          canvasElementRef.current.style.width = `${width}px`;
          canvasElementRef.current.style.height = `${height}px`;
        }

        thorvgCanvasRef.current = new ThorVGSwCanvas(ctx);
        thorvgCanvasRef.current.setTarget(
          scaledWidth,
          scaledHeight,
          TvgColorspace.ABGR8888
        );

        const container = {
          ctx,
          canvas: thorvgCanvasRef.current,
          htmlCanvas: canvasElementRef.current ?? undefined,
        };

        rootRef.current = reconciler.createContainer(
          container,
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
        reconciler.updateContainer(children, rootRef.current, null, () => {});
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
  }, []);

  // Update the container when children change
  useEffect(() => {
    if (rootRef.current) {
      reconciler.updateContainer(children, rootRef.current, null, () => {});
    }
  }, [children]);

  return (
    <canvas ref={canvasElementRef} {...props} />
  );
};

export const Rect: FC<RectProps> = (props) => createElement("rect", props);

export const Circle: FC<CircleProps> = (props) =>
  createElement("circle", props);

export const Group: FC<PropsWithChildren<GroupProps>> = (props) =>
  createElement("group", props);
