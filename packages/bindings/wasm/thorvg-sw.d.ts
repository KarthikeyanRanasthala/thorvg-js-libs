// TypeScript bindings for emscripten-generated code.  Automatically generated at compile time.
declare namespace RuntimeExports {
    let HEAPU8: any;
    let HEAPF32: any;
    /**
     * Given a pointer 'ptr' to a null-terminated UTF8-encoded string in the
     * emscripten HEAP, returns a copy of that string as a Javascript String object.
     *
     * @param {number} ptr
     * @param {number=} maxBytesToRead - An optional length that specifies the
     *   maximum number of bytes to read. You can omit this parameter to scan the
     *   string until the first 0 byte. If maxBytesToRead is passed, and the string
     *   at [ptr, ptr+maxBytesToReadr[ contains a null byte in the middle, then the
     *   string will cut short at that byte index.
     * @param {boolean=} ignoreNul - If true, the function will not stop on a NUL character.
     * @return {string}
     */
    function UTF8ToString(ptr: number, maxBytesToRead?: number | undefined, ignoreNul?: boolean | undefined): string;
    function stringToUTF8(str: any, outPtr: any, maxBytesToWrite: any): any;
    function lengthBytesUTF8(str: any): number;
    /** @param {string=} sig */
    function addFunction(func: any, sig?: string | undefined): any;
    function removeFunction(index: any): void;
}
interface WasmModule {
  _free(_0: number): void;
  _malloc(_0: number): number;
  _tvg_engine_init(_0: number): number;
  _tvg_engine_term(): number;
  _tvg_swcanvas_create(_0: number): number;
  _tvg_glcanvas_create(): number;
  _tvg_canvas_destroy(_0: number): number;
  _tvg_swcanvas_set_target(_0: number, _1: number, _2: number, _3: number, _4: number, _5: number): number;
  _tvg_glcanvas_set_target(_0: number, _1: number, _2: number, _3: number, _4: number, _5: number): number;
  _tvg_canvas_push(_0: number, _1: number): number;
  _tvg_canvas_push_at(_0: number, _1: number, _2: number): number;
  _tvg_canvas_remove(_0: number, _1: number): number;
  _tvg_canvas_update(_0: number): number;
  _tvg_canvas_draw(_0: number, _1: number): number;
  _tvg_canvas_sync(_0: number): number;
  _tvg_paint_set_transform(_0: number, _1: number): number;
  _tvg_paint_get_transform(_0: number, _1: number): number;
  _tvg_paint_set_opacity(_0: number, _1: number): number;
  _tvg_paint_get_type(_0: number, _1: number): number;
  _tvg_shape_new(): number;
  _tvg_shape_reset(_0: number): number;
  _tvg_shape_move_to(_0: number, _1: number, _2: number): number;
  _tvg_shape_line_to(_0: number, _1: number, _2: number): number;
  _tvg_shape_cubic_to(_0: number, _1: number, _2: number, _3: number, _4: number, _5: number, _6: number): number;
  _tvg_shape_close(_0: number): number;
  _tvg_shape_append_rect(_0: number, _1: number, _2: number, _3: number, _4: number, _5: number, _6: number, _7: number): number;
  _tvg_shape_append_circle(_0: number, _1: number, _2: number, _3: number, _4: number, _5: number): number;
  _tvg_shape_append_path(_0: number, _1: number, _2: number, _3: number, _4: number): number;
  _tvg_shape_set_stroke_width(_0: number, _1: number): number;
  _tvg_shape_set_stroke_color(_0: number, _1: number, _2: number, _3: number, _4: number): number;
  _tvg_shape_set_fill_color(_0: number, _1: number, _2: number, _3: number, _4: number): number;
  _tvg_shape_set_fill_rule(_0: number, _1: number): number;
  _tvg_scene_new(): number;
  _tvg_scene_push(_0: number, _1: number): number;
  _tvg_scene_push_at(_0: number, _1: number, _2: number): number;
  _tvg_scene_remove(_0: number, _1: number): number;
  _tvg_accessor_new(): number;
  _tvg_accessor_del(_0: number): number;
  _tvg_accessor_set(_0: number, _1: number, _2: number, _3: number): number;
  _tvg_accessor_generate_id(_0: number): number;
}

interface EmbindModule {
}

export type MainModule = WasmModule & typeof RuntimeExports & EmbindModule;
export default function MainModuleFactory (options?: unknown): Promise<MainModule>;
