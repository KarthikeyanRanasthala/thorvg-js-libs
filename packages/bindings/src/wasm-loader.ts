import MainModuleFactory, { type MainModule } from "../wasm/thorvg.js";

// Re-export MainModule type
export type { MainModule };

// Typed interface for wrapped functions - IN SCOPE ONLY
export interface ThorVGAPI {
  // Engine
  tvg_engine_init: (threads: number) => number;
  tvg_engine_term: () => number;

  // Canvas
  tvg_swcanvas_create: (option: number) => number;
  tvg_swcanvas_set_target: (
    canvas: number,
    buffer: number,
    stride: number,
    w: number,
    h: number,
    cs: number
  ) => number;
  tvg_canvas_push: (canvas: number, paint: number) => number;
  tvg_canvas_push_at: (canvas: number, target: number, at: number) => number;
  tvg_canvas_remove: (canvas: number, paint: number) => number;
  tvg_canvas_update: (canvas: number) => number;
  tvg_canvas_draw: (canvas: number, clear: number) => number;
  tvg_canvas_sync: (canvas: number) => number;
  tvg_canvas_destroy: (canvas: number) => number;

  // Shape - rect/circle only
  tvg_shape_new: () => number;
  tvg_shape_reset: (paint: number) => number;
  tvg_shape_append_rect: (
    paint: number,
    x: number,
    y: number,
    w: number,
    h: number,
    rx: number,
    ry: number,
    cw: number
  ) => number;
  tvg_shape_append_circle: (
    paint: number,
    cx: number,
    cy: number,
    rx: number,
    ry: number,
    cw: number
  ) => number;

  // Fill/Stroke only
  tvg_shape_set_fill_color: (
    paint: number,
    r: number,
    g: number,
    b: number,
    a: number
  ) => number;
  tvg_shape_set_stroke_color: (
    paint: number,
    r: number,
    g: number,
    b: number,
    a: number
  ) => number;
  tvg_shape_set_stroke_width: (paint: number, width: number) => number;

  // Scene
  tvg_scene_new: () => number;
  tvg_scene_push: (scene: number, paint: number) => number;
  tvg_scene_push_at: (scene: number, target: number, at: number) => number;
  tvg_scene_remove: (scene: number, paint: number) => number;

  // Paint transform/properties (shared by Shape and Scene)
  tvg_paint_set_transform: (paint: number, matrix: number) => number;
  tvg_paint_get_transform: (paint: number, matrix: number) => number;
  tvg_paint_set_opacity: (paint: number, opacity: number) => number;
}

export interface ThorVGContext {
  module: MainModule;
  api: ThorVGAPI;
}

export async function loadWasm({
  wasmPath,
}: {
  wasmPath?: string;
}): Promise<ThorVGContext> {
  const module = await MainModuleFactory({
    locateFile: (path: string, scriptDirectory: string) => {
      if (wasmPath) {
        return wasmPath;
      }

      return scriptDirectory + path;
    },
  });

  // Wrap ALL functions ONCE - zero runtime overhead later
  const api: ThorVGAPI = {
    // Engine
    tvg_engine_init: module.cwrap("tvg_engine_init", "number", ["number"]),
    tvg_engine_term: module.cwrap("tvg_engine_term", "number", []),

    // Canvas
    tvg_swcanvas_create: module.cwrap("tvg_swcanvas_create", "number", [
      "number",
    ]),
    tvg_swcanvas_set_target: module.cwrap("tvg_swcanvas_set_target", "number", [
      "number",
      "number",
      "number",
      "number",
      "number",
      "number",
    ]),
    tvg_canvas_push: module.cwrap("tvg_canvas_push", "number", [
      "number",
      "number",
    ]),
    tvg_canvas_push_at: module.cwrap("tvg_canvas_push_at", "number", [
      "number",
      "number",
      "number",
    ]),
    tvg_canvas_remove: module.cwrap("tvg_canvas_remove", "number", [
      "number",
      "number",
    ]),
    tvg_canvas_update: module.cwrap("tvg_canvas_update", "number", ["number"]),
    tvg_canvas_draw: module.cwrap("tvg_canvas_draw", "number", [
      "number",
      "number",
    ]),
    tvg_canvas_sync: module.cwrap("tvg_canvas_sync", "number", ["number"]),
    tvg_canvas_destroy: module.cwrap("tvg_canvas_destroy", "number", [
      "number",
    ]),

    // Shape
    tvg_shape_new: module.cwrap("tvg_shape_new", "number", []),
    tvg_shape_reset: module.cwrap("tvg_shape_reset", "number", ["number"]),
    tvg_shape_append_rect: module.cwrap("tvg_shape_append_rect", "number", [
      "number",
      "number",
      "number",
      "number",
      "number",
      "number",
      "number",
      "number",
    ]),
    tvg_shape_append_circle: module.cwrap("tvg_shape_append_circle", "number", [
      "number",
      "number",
      "number",
      "number",
      "number",
      "number",
    ]),
    tvg_shape_set_fill_color: module.cwrap(
      "tvg_shape_set_fill_color",
      "number",
      ["number", "number", "number", "number", "number"]
    ),
    tvg_shape_set_stroke_color: module.cwrap(
      "tvg_shape_set_stroke_color",
      "number",
      ["number", "number", "number", "number", "number"]
    ),
    tvg_shape_set_stroke_width: module.cwrap(
      "tvg_shape_set_stroke_width",
      "number",
      ["number", "number"]
    ),

    // Scene
    tvg_scene_new: module.cwrap("tvg_scene_new", "number", []),
    tvg_scene_push: module.cwrap("tvg_scene_push", "number", [
      "number",
      "number",
    ]),
    tvg_scene_push_at: module.cwrap("tvg_scene_push_at", "number", [
      "number",
      "number",
      "number",
    ]),
    tvg_scene_remove: module.cwrap("tvg_scene_remove", "number", [
      "number",
      "number",
    ]),

    // Paint transform/properties
    tvg_paint_set_transform: module.cwrap("tvg_paint_set_transform", "number", [
      "number",
      "number",
    ]),
    tvg_paint_get_transform: module.cwrap("tvg_paint_get_transform", "number", [
      "number",
      "number",
    ]),
    tvg_paint_set_opacity: module.cwrap("tvg_paint_set_opacity", "number", [
      "number",
      "number",
    ]),
  };

  return { module, api };
}
