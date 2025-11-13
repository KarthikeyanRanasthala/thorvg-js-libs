import {
  Shape,
  Scene,
  SwCanvas as ThorVGSwCanvas,
  GlCanvas as ThorVGGlCanvas,
  TvgPaint,
  AnyThorVGModule,
  PathCommand,
  FillRule,
  StrokeCap,
  StrokeJoin,
  Point,
} from "bindings";

export type ThorVGCanvas = ThorVGSwCanvas | ThorVGGlCanvas;

export interface Container {
  module: AnyThorVGModule;
  canvas: ThorVGCanvas;
  rootScene: Scene;
}

export interface Instance {
  paint?: TvgPaint; // Unified handle for Shape or Scene (undefined for geometry children)
  shape?: Shape; // Keep reference for shape-specific operations
  scene?: Scene; // Keep reference for scene-specific operations
  type: Type;
  props?: Props; // Store props for geometry children (rect, circle, path)
  geometryChildren?: Instance[]; // Track geometry children (rect, circle, path) for Shapes
  parentInstance?: Instance; // Reference to parent Shape instance for geometry children
}

export interface HostContext {}

export type Color = [number, number, number, number];

export interface TransformProps {
  x?: number;
  y?: number;
  rotation?: number;
  scaleX?: number;
  scaleY?: number;
}

export interface ShapeProps extends TransformProps {
  fill?: Color;
  stroke?: Color;
  strokeWidth?: number;
  strokeDash?: number[];
  strokeDashOffset?: number;
  strokeCap?: StrokeCap;
  strokeJoin?: StrokeJoin;
  strokeMiterlimit?: number;
  opacity?: number;
  fillRule?: "nonzero" | "evenodd";
}

// Geometry child components (add geometry to parent Shape)
export interface RectProps {
  x: number;
  y: number;
  width: number;
  height: number;
  rx?: number;
  ry?: number;
}

export interface CircleProps {
  x: number;
  y: number;
  radius?: number;
  rx?: number;
  ry?: number;
}

export type PathCommandMoveTo = {
  type: "M";
  x: number;
  y: number;
};

export type PathCommandLineTo = {
  type: "L";
  x: number;
  y: number;
};

export type PathCommandCubicTo = {
  type: "C";
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  x: number;
  y: number;
};

export type PathCommandClose = {
  type: "Z";
};

export type PathCommandObject =
  | PathCommandMoveTo
  | PathCommandLineTo
  | PathCommandCubicTo
  | PathCommandClose;

export interface PathProps {
  commands: PathCommandObject[];
}

export interface SceneProps extends TransformProps {
  opacity?: number;
}

export type Type = "shape" | "rect" | "circle" | "path" | "scene";

export type Props =
  | ShapeProps
  | RectProps
  | CircleProps
  | PathProps
  | SceneProps;

// Re-export for convenience
export { PathCommand, FillRule, StrokeCap, StrokeJoin, type Point };
