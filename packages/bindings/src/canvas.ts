import { type Module } from "./wasm-loader.js";
import { TvgCanvas, TvgPaint } from "./types.js";
import { checkResult } from "./utils.js";

/**
 * Base class for ThorVG canvas implementations.
 * Contains common methods shared by SwCanvas and GlCanvas.
 */
export abstract class Canvas {
  protected readonly handle: TvgCanvas;
  readonly module: Module;

  protected constructor(module: Module, handle: TvgCanvas) {
    this.module = module;
    this.handle = handle;
  }

  /**
   * Push a paint object to the canvas for rendering.
   */
  push(paint: TvgPaint): this {
    const result = this.module._tvg_canvas_push(this.handle, paint);
    checkResult(result);
    return this;
  }

  /**
   * Insert a paint object before another paint object.
   */
  insertBefore(target: TvgPaint, before: TvgPaint): this {
    const result = this.module._tvg_canvas_push_at(this.handle, target, before);
    checkResult(result);
    return this;
  }

  /**
   * Remove a paint object from the canvas.
   */
  remove(paint: TvgPaint): this {
    const result = this.module._tvg_canvas_remove(this.handle, paint);
    checkResult(result);
    return this;
  }

  /**
   * Clear all paint objects from the canvas.
   */
  clear(): this {
    // Pass 0 (null) to remove all paints
    const result = this.module._tvg_canvas_remove(this.handle, 0);
    checkResult(result);
    return this;
  }

  /**
   * Update the canvas to reflect changes in paint objects.
   */
  update(): this {
    const result = this.module._tvg_canvas_update(this.handle);
    checkResult(result);
    return this;
  }

  /**
   * Draw the canvas content.
   * @param clear - Whether to clear the canvas before drawing
   */
  draw(clear: boolean = true): this {
    const result = this.module._tvg_canvas_draw(this.handle, clear ? 1 : 0);
    checkResult(result);
    return this;
  }

  /**
   * Synchronize the canvas (wait for rendering to complete).
   */
  sync(): this {
    const result = this.module._tvg_canvas_sync(this.handle);
    checkResult(result);
    return this;
  }

  /**
   * Destroy the canvas handle.
   * Subclasses should call this after cleaning up their own resources.
   */
  protected destroyCanvas(): void {
    const result = this.module._tvg_canvas_destroy(this.handle);
    checkResult(result);
  }

  /**
   * Destroy the canvas and clean up resources.
   * Subclasses must implement this to clean up their specific resources.
   */
  abstract destroy(): void;
}
