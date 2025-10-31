import {
  Shape,
  Scene,
  ThorVGContext,
  SwCanvas as ThorVGSwCanvas,
  GlCanvas as ThorVGGlCanvas,
  TvgPaint,
} from "bindings";

export type ThorVGCanvas = ThorVGSwCanvas | ThorVGGlCanvas;

export interface Container {
  ctx: ThorVGContext;
  canvas: ThorVGCanvas;
}

export interface Instance {
  paint: TvgPaint; // Unified handle for Shape or Scene
  shape?: Shape; // Keep reference for shape-specific operations
  scene?: Scene; // Keep reference for scene-specific operations
  type: Type;
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
}

export interface RectProps extends BaseShapeProps {
  width: number;
  height: number;
}

export interface CircleWithRadius extends BaseShapeProps {
  radius: number;
}

export interface EllipseWithRadii extends BaseShapeProps {
  rx: number;
  ry: number;
}

export type CircleProps = CircleWithRadius | EllipseWithRadii;

export interface GroupProps extends TransformProps {
  opacity?: number;
}

export type Type = "rect" | "circle" | "group";

export type Props = RectProps | CircleProps | GroupProps;
