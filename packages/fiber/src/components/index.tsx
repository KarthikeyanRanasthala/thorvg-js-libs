import { createElement, FC, memo, PropsWithChildren } from "react";
import {
  ShapeProps,
  SceneProps,
  RectProps,
  PathProps,
  CircleProps,
} from "../types";
import { ElementType } from "../constants";

export { SwCanvas, type SwCanvasProps } from "./sw-canvas";
export { GlCanvas, type GlCanvasProps } from "./gl-canvas";
export { ElementType } from "../constants";

export const Scene: FC<PropsWithChildren<SceneProps>> = memo(
  ({ children, ...props }) => createElement(ElementType.SCENE, props, children)
);

export const Shape: FC<PropsWithChildren<ShapeProps>> = memo(
  ({ children, ...props }) => createElement(ElementType.SHAPE, props, children)
);

export const Rect: FC<PropsWithChildren<RectProps>> = memo(
  ({ children, ...props }) => createElement(ElementType.RECT, props, children)
);

export const Circle: FC<PropsWithChildren<CircleProps>> = memo(
  ({ children, ...props }) => createElement(ElementType.CIRCLE, props, children)
);

export const Path: FC<PropsWithChildren<PathProps>> = memo(
  ({ children, ...props }) => createElement(ElementType.PATH, props, children)
);

export type { ShapeProps, SceneProps, RectProps, CircleProps, PathProps };
