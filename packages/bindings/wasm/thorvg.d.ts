// TypeScript bindings for emscripten-generated code.  Automatically generated at compile time.
declare namespace RuntimeExports {
    /**
     * @param {string=} returnType
     * @param {Array=} argTypes
     * @param {Object=} opts
     */
    function cwrap(ident: any, returnType?: string | undefined, argTypes?: any[] | undefined, opts?: any | undefined): any;
    /**
     * @param {string|null=} returnType
     * @param {Array=} argTypes
     * @param {Array=} args
     * @param {Object=} opts
     */
    function ccall(ident: any, returnType?: (string | null) | undefined, argTypes?: any[] | undefined, args?: any[] | undefined, opts?: any | undefined): any;
    /**
     * @param {number} ptr
     * @param {string} type
     */
    function getValue(ptr: number, type?: string): any;
    /**
     * @param {number} ptr
     * @param {number} value
     * @param {string} type
     */
    function setValue(ptr: number, value: number, type?: string): void;
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

type EmbindString = ArrayBuffer|Uint8Array|Uint8ClampedArray|Int8Array|string;
export interface ClassHandle {
  isAliasOf(other: ClassHandle): boolean;
  delete(): void;
  deleteLater(): this;
  isDeleted(): boolean;
  // @ts-ignore - If targeting lower than ESNext, this symbol might not exist.
  [Symbol.dispose](): void;
  clone(): this;
}
export interface TvgLottieAnimation extends ClassHandle {
  size(): Float32Array;
  render(): ArrayBuffer;
  update(): boolean;
  quality(_0: number): boolean;
  resize(_0: number, _1: number): void;
  duration(): number;
  totalFrame(): number;
  curFrame(): number;
  frame(_0: number): boolean;
  viewport(_0: number, _1: number, _2: number, _3: number): boolean;
  error(): string;
  load(_0: EmbindString, _1: EmbindString, _2: number, _3: number): boolean;
  save(_0: EmbindString, _1: EmbindString): boolean;
}

interface EmbindModule {
  TvgLottieAnimation: {
    new(_0: EmbindString, _1: EmbindString): TvgLottieAnimation;
  };
  term(): void;
  init(): number;
}

export type MainModule = WasmModule & typeof RuntimeExports & EmbindModule;
export default function MainModuleFactory (options?: unknown): Promise<MainModule>;
