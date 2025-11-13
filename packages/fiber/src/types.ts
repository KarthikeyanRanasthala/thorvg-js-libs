import {
  Shape,
  Scene,
  SwCanvas as ThorVGSwCanvas,
  GlCanvas as ThorVGGlCanvas,
  TvgPaint,
  AnyThorVGModule,
  Point,
  PathCommand,
  type PathCommandType,
  type FillRuleType,
  type StrokeCapType,
  type StrokeJoinType,
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

/**
 * RGBA color represented as a tuple of four numbers [R, G, B, A].
 * Each component should be in the range 0-255.
 */
export type Color = [number, number, number, number];

/**
 * Base transformation properties for positioned elements.
 */
export interface TransformProps {
  /**
   * X-axis translation in pixels.
   */
  x?: number;

  /**
   * Y-axis translation in pixels.
   */
  y?: number;

  /**
   * Rotation angle in degrees.
   */
  rotation?: number;

  /**
   * Horizontal scale factor.
   * @default 1
   */
  scaleX?: number;

  /**
   * Vertical scale factor.
   * @default 1
   */
  scaleY?: number;
}

/**
 * Props for the Shape component.
 * Shapes can contain geometry children (Rect, Circle, Path) to define their appearance.
 */
export interface ShapeProps extends TransformProps {
  /**
   * Fill color as RGBA tuple [R, G, B, A], each component 0-255.
   */
  fill?: Color;

  /**
   * Stroke color as RGBA tuple [R, G, B, A], each component 0-255.
   */
  stroke?: Color;

  /**
   * Width of the stroke in pixels.
   */
  strokeWidth?: number;

  /**
   * Stroke dash pattern as an array of lengths.
   * @example [5, 10] creates a 5px dash followed by 10px gap
   */
  strokeDash?: number[];

  /**
   * Offset for stroke dash pattern in pixels.
   */
  strokeDashOffset?: number;

  /**
   * Cap style for stroke endpoints.
   */
  strokeCap?: StrokeCapType;

  /**
   * Join style for stroke corners.
   */
  strokeJoin?: StrokeJoinType;

  /**
   * Miter limit for stroke joins.
   * @default 4
   */
  strokeMiterlimit?: number;

  /**
   * Opacity value from 0 (transparent) to 255 (opaque).
   * @default 255
   */
  opacity?: number;

  /**
   * Fill rule for determining shape interior.
   */
  fillRule?: FillRuleType;
}

/**
 * Props for the Rect component.
 * Must be a child of a Shape component to be rendered.
 */
export interface RectProps {
  /**
   * X-coordinate of the rectangle's top-left corner.
   */
  x: number;

  /**
   * Y-coordinate of the rectangle's top-left corner.
   */
  y: number;

  /**
   * Width of the rectangle in pixels.
   */
  width: number;

  /**
   * Height of the rectangle in pixels.
   */
  height: number;

  /**
   * Horizontal corner radius for rounded rectangles.
   */
  rx?: number;

  /**
   * Vertical corner radius for rounded rectangles.
   */
  ry?: number;
}

/**
 * Props for the Circle component.
 * Must be a child of a Shape component to be rendered.
 */
export interface CircleProps {
  /**
   * X-coordinate of the circle's center.
   */
  x: number;

  /**
   * Y-coordinate of the circle's center.
   */
  y: number;

  /**
   * Radius for a perfect circle.
   */
  radius?: number;

  /**
   * Horizontal radius for an ellipse.
   */
  rx?: number;

  /**
   * Vertical radius for an ellipse.
   */
  ry?: number;
}

/**
 * Props for the Path component.
 * Must be a child of a Shape component to be rendered.
 * Matches the appendPath API from the bindings package.
 */
export interface PathProps {
  /**
   * Array of path command types.
   * Use PathCommand constants: PathCommand.MoveTo, PathCommand.LineTo, PathCommand.CubicTo, PathCommand.Close
   * @example [PathCommand.MoveTo, PathCommand.LineTo, PathCommand.Close]
   */
  commands: PathCommandType[];

  /**
   * Array of points corresponding to the commands.
   * Each command consumes a different number of points:
   * - MoveTo: 1 point (x, y)
   * - LineTo: 1 point (x, y)
   * - CubicTo: 3 points (x1, y1), (x2, y2), (x, y)
   * - Close: 0 points
   * @example [{ x: 0, y: 0 }, { x: 100, y: 100 }]
   */
  points: Point[];
}

/**
 * Props for the Scene component.
 * Scenes can contain multiple Shape children and other nested Scenes.
 */
export interface SceneProps extends TransformProps {
  /**
   * Opacity value from 0 (transparent) to 255 (opaque).
   * @default 255
   */
  opacity?: number;
}

export type Type = "shape" | "rect" | "circle" | "path" | "scene";

export type Props =
  | ShapeProps
  | RectProps
  | CircleProps
  | PathProps
  | SceneProps;

// Re-export from bindings for convenience
export {
  PathCommand,
  type PathCommandType,
  type FillRuleType,
  type StrokeCapType,
  type StrokeJoinType,
  type Point,
};
