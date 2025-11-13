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

/**
 * Scene component for grouping and transforming multiple shapes.
 *
 * Scenes act as containers that can hold multiple Shape children or other nested Scenes.
 * They support transformation props (x, y, rotation, scale) and opacity.
 *
 * @param props - Scene properties including transform and opacity
 * @returns A scene element that can contain Shape children
 */
export const Scene: FC<PropsWithChildren<SceneProps>> = memo(
  ({ children, ...props }) => createElement(ElementType.SCENE, props, children)
);

/**
 * Shape component for rendering 2D vector graphics.
 *
 * Shapes define the visual appearance (fill, stroke, opacity) and must contain
 * geometry children (Rect, Circle, or Path) to define what to draw.
 *
 * @param props - Shape properties including fill, stroke, transform, and style
 * @returns A shape element that requires geometry children (Rect, Circle, Path)
 */
export const Shape: FC<PropsWithChildren<ShapeProps>> = memo(
  ({ children, ...props }) => createElement(ElementType.SHAPE, props, children)
);

/**
 * Rectangle geometry component.
 * Must be a child of a Shape component.
 *
 * @param props - Rectangle properties including position, size, and corner radii
 * @returns A rectangle geometry element
 */
export const Rect: FC<PropsWithChildren<RectProps>> = memo(
  ({ children, ...props }) => createElement(ElementType.RECT, props, children)
);

/**
 * Circle/Ellipse geometry component.
 * Must be a child of a Shape component.
 *
 * @param props - Circle properties including center position and radius
 * @returns A circle/ellipse geometry element
 */
export const Circle: FC<PropsWithChildren<CircleProps>> = memo(
  ({ children, ...props }) => createElement(ElementType.CIRCLE, props, children)
);

/**
 * Path geometry component for custom shapes.
 * Must be a child of a Shape component.
 *
 * @param props - Path properties including an array of path commands
 * @returns A path geometry element
 */
export const Path: FC<PropsWithChildren<PathProps>> = memo(
  ({ children, ...props }) => createElement(ElementType.PATH, props, children)
);

export type { ShapeProps, SceneProps, RectProps, CircleProps, PathProps };
