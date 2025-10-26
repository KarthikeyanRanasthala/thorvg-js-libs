import {
  Shape,
  Scene,
  ThorVGContext,
  SwCanvas as ThorVGSwCanvas,
  TvgPaint,
} from "bindings";

export interface Container {
  ctx: ThorVGContext;
  canvas: ThorVGSwCanvas;
  htmlCanvas?: HTMLCanvasElement;
}

export interface Instance {
  paint: TvgPaint; // Unified handle for Shape or Scene
  shape?: Shape; // Keep reference for shape-specific operations
  scene?: Scene; // Keep reference for scene-specific operations
  type: Type;
}

export interface HostContext {}

export type Color = [number, number, number, number];

export interface BaseShapeProps {
  fill?: Color;
  stroke?: Color;
  strokeWidth?: number;
  rotation?: number;
  scale?: number;
  opacity?: number;
}

export interface RectProps extends BaseShapeProps {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface CircleProps extends BaseShapeProps {
  cx: number;
  cy: number;
  rx: number;
  ry: number;
}

export interface GroupProps {
  x?: number;
  y?: number;
  rotation?: number;
  scale?: number;
  opacity?: number;
}

export type Type = "rect" | "circle" | "group";

export type Props = RectProps | CircleProps | GroupProps;
