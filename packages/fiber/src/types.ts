import {
  Shape,
  Scene,
  SwCanvas as ThorVGSwCanvas,
  GlCanvas as ThorVGGlCanvas,
  TvgPaint,
  AnyThorVGModule,
  PathCommand,
  FillRule,
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

export interface BaseShapeProps extends TransformProps {
  fill?: Color;
  stroke?: Color;
  strokeWidth?: number;
  opacity?: number;
  fillRule?: "nonzero" | "evenodd";
}

// Shape component props (parent that contains geometry)
export interface ShapeProps extends BaseShapeProps {}

// Geometry child components (add geometry to parent Shape)
export interface RectProps {
  width: number;
  height: number;
}

export interface CircleProps {
  radius?: number;
  rx?: number;
  ry?: number;
}

// Path command types - discriminated union for type safety
export type PathCommandMoveTo = {
  type: 'M';
  x: number;
  y: number;
};

export type PathCommandLineTo = {
  type: 'L';
  x: number;
  y: number;
};

export type PathCommandCubicTo = {
  type: 'C';
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  x: number;
  y: number;
};

export type PathCommandClose = {
  type: 'Z';
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
export { PathCommand, FillRule, type Point };
