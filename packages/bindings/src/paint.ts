import { ThorVGContext, type MainModule } from "./wasm-loader.js";
import { TvgPaint, TvgMatrix } from "./types.js";
import { checkResult } from "./utils.js";

/**
 * Base class for all drawable objects (Shape, Scene, etc.)
 * Provides common transformation and appearance operations.
 */
export abstract class Paint {
  readonly handle: TvgPaint;
  protected module: MainModule;

  constructor(context: ThorVGContext, handle: TvgPaint) {
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
      // Write matrix values to WASM memory using bulk write
      this.module.HEAPF32.set(matrix, matrixPtr / 4);

      const result = this.module._tvg_paint_set_transform(
        this.handle,
        matrixPtr
      );
      checkResult(result);
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
      const result = this.module._tvg_paint_get_transform(
        this.handle,
        matrixPtr
      );
      checkResult(result);

      // Read matrix values from WASM memory using HEAPF32 (bulk read)
      const offset = matrixPtr / 4;
      return Array.from(
        this.module.HEAPF32.subarray(offset, offset + 9)
      ) as TvgMatrix;
    } finally {
      this.module._free(matrixPtr);
    }
  }

  /**
   * Set the opacity of this paint object.
   * @param value Opacity value (0-255)
   */
  opacity(value: number): this {
    const result = this.module._tvg_paint_set_opacity(this.handle, value);
    checkResult(result);
    return this;
  }
}
