import { ThorVGAPI, ThorVGContext, type MainModule } from './wasm-loader.js';
import { TvgPaint, TvgResult, TvgMatrix } from './types.js';

/**
 * Base class for all drawable objects (Shape, Scene, etc.)
 * Provides common transformation and appearance operations.
 */
export abstract class Paint {
  readonly handle: TvgPaint;
  protected api: ThorVGAPI;
  protected module: MainModule;

  constructor(context: ThorVGContext, handle: TvgPaint) {
    this.api = context.api;
    this.module = context.module;
    this.handle = handle;
  }

  /**
   * Set the transformation matrix for this paint object.
   * This replaces any previous transform.
   */
  setTransform(matrix: TvgMatrix): this {
    // Allocate memory for the matrix (9 floats = 36 bytes)
    const matrixPtr = this.module._malloc(36);

    try {
      // Write matrix values to WASM memory
      for (let i = 0; i < 9; i++) {
        this.module.setValue(matrixPtr + i * 4, matrix[i], 'float');
      }

      const result = this.api.tvg_paint_set_transform(this.handle, matrixPtr);
      if (result !== TvgResult.SUCCESS) throw result;
    } finally {
      this.module._free(matrixPtr);
    }

    return this;
  }

  /**
   * Get the current transformation matrix of this paint object.
   */
  getTransform(): TvgMatrix {
    const matrixPtr = this.module._malloc(36);

    try {
      const result = this.api.tvg_paint_get_transform(this.handle, matrixPtr);
      if (result !== TvgResult.SUCCESS) throw result;

      // Read matrix values from WASM memory
      const matrix: TvgMatrix = [0, 0, 0, 0, 0, 0, 0, 0, 0];
      for (let i = 0; i < 9; i++) {
        matrix[i] = this.module.getValue(matrixPtr + i * 4, 'float');
      }

      return matrix;
    } finally {
      this.module._free(matrixPtr);
    }
  }

  /**
   * Set the opacity of this paint object.
   * @param value Opacity value (0-255)
   */
  opacity(value: number): this {
    const result = this.api.tvg_paint_set_opacity(this.handle, value);
    if (result !== TvgResult.SUCCESS) throw result;
    return this;
  }
}
