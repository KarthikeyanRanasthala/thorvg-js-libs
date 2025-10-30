import { ThorVGContext, type MainModule } from "./wasm-loader.js";
import {
  TvgCanvas,
  TvgPaint,
  TvgColorspace,
  TvgEngineOption,
  TvgResult,
} from "./types.js";
import { checkResult } from "./utils.js";

export class SwCanvas {
  readonly handle: TvgCanvas;
  readonly module: MainModule;
  bufferPtr: number = 0;
  bufferSize: number = 0;

  constructor(
    context: ThorVGContext,
    option: TvgEngineOption = TvgEngineOption.DEFAULT
  ) {
    this.module = context.module;
    this.handle = this.module._tvg_swcanvas_create(option);
  }

  setTarget(width: number, height: number, colorspace: TvgColorspace): void {
    this.bufferSize = width * height * 4;
    if (this.bufferPtr !== 0) {
      this.module._free(this.bufferPtr);
    }
    this.bufferPtr = this.module._malloc(this.bufferSize);

    const result = this.module._tvg_swcanvas_set_target(
      this.handle,
      this.bufferPtr,
      width,
      width,
      height,
      colorspace
    );
    checkResult(result);
  }

  push(paint: TvgPaint): void {
    const result = this.module._tvg_canvas_push(this.handle, paint);
    checkResult(result);
  }

  insertBefore(target: TvgPaint, before: TvgPaint): void {
    const result = this.module._tvg_canvas_push_at(this.handle, target, before);
    checkResult(result);
  }

  remove(paint: TvgPaint): void {
    const result = this.module._tvg_canvas_remove(this.handle, paint);
    checkResult(result);
  }

  clear(): void {
    // Pass 0 (null) to remove all paints
    const result = this.module._tvg_canvas_remove(this.handle, 0);
    checkResult(result);
  }

  update(): void {
    const result = this.module._tvg_canvas_update(this.handle);
    checkResult(result);
  }

  draw(clear: boolean = true): void {
    const result = this.module._tvg_canvas_draw(this.handle, clear ? 1 : 0);
    checkResult(result);
  }

  sync(): void {
    const result = this.module._tvg_canvas_sync(this.handle);
    checkResult(result);
  }

  destroy(): void {
    // Free allocated buffer
    if (this.bufferPtr !== 0) {
      this.module._free(this.bufferPtr);
      this.bufferPtr = 0;
    }
    // Destroy canvas
    const result = this.module._tvg_canvas_destroy(this.handle);
    checkResult(result);
  }
}
