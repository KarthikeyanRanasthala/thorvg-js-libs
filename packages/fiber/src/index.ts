export {
  SwCanvas,
  GlCanvas,
  Shape,
  Rect,
  Circle,
  Path,
  Scene,
} from "./components";

export type { SwCanvasProps, GlCanvasProps } from "./components";

export type {
  ShapeProps,
  RectProps,
  CircleProps,
  PathProps,
  SceneProps,
  Color,
  TransformProps,
  BaseShapeProps,
} from "./types";

// Re-export PathCommand, FillRule, and Point from bindings
export { PathCommand, FillRule, type Point } from "bindings";
