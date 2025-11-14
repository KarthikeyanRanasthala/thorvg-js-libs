import { TvgCanvas, TvgPaint } from "./types.js";
import { checkResult } from "./utils.js";
import { AnyThorVGModule } from "./wasm.js";

/**
 * Base class for ThorVG canvas implementations.
 * Contains common methods shared by SwCanvas and GlCanvas.
 */
export abstract class Canvas {
  protected readonly handle: TvgCanvas;
  readonly module: AnyThorVGModule;

  protected constructor(module: AnyThorVGModule, handle: TvgCanvas) {
    this.module = module;
    this.handle = handle;
  }

  push(paint: TvgPaint): this {
    const result = this.module._tvg_canvas_push(this.handle, paint);
    checkResult(result);
    return this;
  }

  insertBefore(target: TvgPaint, before: TvgPaint): this {
    const result = this.module._tvg_canvas_push_at(this.handle, target, before);
    checkResult(result);
    return this;
  }

  remove(paint: TvgPaint): this {
    const result = this.module._tvg_canvas_remove(this.handle, paint);
    checkResult(result);
    return this;
  }

  clear(): this {
    // Pass 0 (null) to remove all paints
    const result = this.module._tvg_canvas_remove(this.handle, 0);
    checkResult(result);
    return this;
  }

  update(): this {
    const result = this.module._tvg_canvas_update(this.handle);
    checkResult(result);
    return this;
  }

  /**
   * @param clear - Whether to clear the canvas before drawing
   */
  draw(clear: boolean = true): this {
    const result = this.module._tvg_canvas_draw(this.handle, clear ? 1 : 0);
    checkResult(result);
    return this;
  }

  sync(): this {
    const result = this.module._tvg_canvas_sync(this.handle);
    checkResult(result);
    return this;
  }

  protected destroyCanvas(): void {
    const result = this.module._tvg_canvas_destroy(this.handle);
    checkResult(result);
  }

  abstract destroy(): void;
}
