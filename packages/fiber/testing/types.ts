import { TvgPaintType, PaintInfo } from "bindings";
import { Container } from "../src/types";

export interface RenderResult {
  container: Container;
  getByType: (type: TvgPaintType) => PaintInfo;
  getAllByType: (type: TvgPaintType) => PaintInfo[];
  queryByType: (type: TvgPaintType) => PaintInfo | null;
  queryAllByType: (type: TvgPaintType) => PaintInfo[];
  rerender: (element: React.ReactElement) => Promise<void>;
  unmount: () => void;
  debug: () => void;
  toJSON: () => SceneSnapshot;
}

export interface RenderOptions {
  width?: number;
  height?: number;
}

export interface SceneSnapshot {
  totalNodes: number;
  nodesByType: Record<number, number>;
  maxDepth: number;
}
