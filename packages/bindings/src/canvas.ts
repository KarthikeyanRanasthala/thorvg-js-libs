import { ThorVGAPI, ThorVGContext, type MainModule } from './wasm-loader.js';
import {
  TvgCanvas,
  TvgPaint,
  TvgColorspace,
  TvgEngineOption,
  TvgResult,
} from './types.js';

export class SwCanvas {
  readonly handle: TvgCanvas;
  private module: MainModule;
  private api: ThorVGAPI;
  private bufferPtr: number = 0;
  private bufferSize: number = 0;

  constructor(
    context: ThorVGContext,
    option: TvgEngineOption = TvgEngineOption.DEFAULT
  ) {
    this.module = context.module;
    this.api = context.api;
    this.handle = this.api.tvg_swcanvas_create(option);
  }

  setTarget(
    width: number,
    height: number,
    colorspace: TvgColorspace
  ): void {
    this.bufferSize = width * height * 4;
    this.bufferPtr = this.module._malloc(this.bufferSize);

    const result = this.api.tvg_swcanvas_set_target(
      this.handle,
      this.bufferPtr,
      width,
      width,
      height,
      colorspace
    );
    if (result !== TvgResult.SUCCESS) throw result;
  }

  push(paint: TvgPaint): void {
    const result = this.api.tvg_canvas_push(this.handle, paint);
    if (result !== TvgResult.SUCCESS) throw result;
  }

  insertBefore(target: TvgPaint, before: TvgPaint): void {
    const result = this.api.tvg_canvas_push_at(this.handle, target, before);
    if (result !== TvgResult.SUCCESS) throw result;
  }

  remove(paint: TvgPaint): void {
    const result = this.api.tvg_canvas_remove(this.handle, paint);
    if (result !== TvgResult.SUCCESS) throw result;
  }

  clear(): void {
    // Pass 0 (null) to remove all paints
    const result = this.api.tvg_canvas_remove(this.handle, 0);
    if (result !== TvgResult.SUCCESS) throw result;
  }

  update(): void {
    const result = this.api.tvg_canvas_update(this.handle);
    if (result !== TvgResult.SUCCESS) throw result;
  }

  draw(clear: boolean = true): void {
    const result = this.api.tvg_canvas_draw(this.handle, clear ? 1 : 0);
    if (result !== TvgResult.SUCCESS) throw result;
  }

  sync(): void {
    const result = this.api.tvg_canvas_sync(this.handle);
    if (result !== TvgResult.SUCCESS) throw result;
  }

  readPixels(buffer: Uint32Array): void {
    // Read pixel data from WASM memory
    for (let i = 0; i < buffer.length; i++) {
      buffer[i] = this.module.getValue(this.bufferPtr + i * 4, 'i32');
    }
  }

  destroy(): void {
    // Free allocated buffer
    if (this.bufferPtr !== 0) {
      this.module._free(this.bufferPtr);
      this.bufferPtr = 0;
    }
    // Destroy canvas
    const result = this.api.tvg_canvas_destroy(this.handle);
    if (result !== TvgResult.SUCCESS) throw result;
  }
}
