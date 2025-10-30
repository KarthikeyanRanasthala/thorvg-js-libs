// TypeScript bindings for emscripten-generated code.  Automatically generated at compile time.
declare namespace RuntimeExports {
    let HEAPU8: any;
    let HEAPF32: any;
}
interface WasmModule {
  _free(_0: number): void;
  _malloc(_0: number): number;
  _tvg_engine_init(_0: number): number;
  _tvg_engine_term(): number;
  _tvg_swcanvas_create(_0: number): number;
  _tvg_canvas_destroy(_0: number): number;
  _tvg_swcanvas_set_target(_0: number, _1: number, _2: number, _3: number, _4: number, _5: number): number;
  _tvg_canvas_push(_0: number, _1: number): number;
  _tvg_canvas_push_at(_0: number, _1: number, _2: number): number;
  _tvg_canvas_remove(_0: number, _1: number): number;
  _tvg_canvas_update(_0: number): number;
  _tvg_canvas_draw(_0: number, _1: number): number;
  _tvg_canvas_sync(_0: number): number;
  _tvg_paint_set_transform(_0: number, _1: number): number;
  _tvg_paint_get_transform(_0: number, _1: number): number;
  _tvg_paint_set_opacity(_0: number, _1: number): number;
  _tvg_shape_new(): number;
  _tvg_shape_reset(_0: number): number;
  _tvg_shape_append_rect(_0: number, _1: number, _2: number, _3: number, _4: number, _5: number, _6: number, _7: number): number;
  _tvg_shape_append_circle(_0: number, _1: number, _2: number, _3: number, _4: number, _5: number): number;
  _tvg_shape_set_stroke_width(_0: number, _1: number): number;
  _tvg_shape_set_stroke_color(_0: number, _1: number, _2: number, _3: number, _4: number): number;
  _tvg_shape_set_fill_color(_0: number, _1: number, _2: number, _3: number, _4: number): number;
  _tvg_scene_new(): number;
  _tvg_scene_push(_0: number, _1: number): number;
  _tvg_scene_push_at(_0: number, _1: number, _2: number): number;
  _tvg_scene_remove(_0: number, _1: number): number;
}

interface EmbindModule {
}

export type MainModule = WasmModule & typeof RuntimeExports & EmbindModule;
export default function MainModuleFactory (options?: unknown): Promise<MainModule>;
