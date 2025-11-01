import { Paint } from "./paint.js";
import { checkResult } from "./utils.js";
import { AnyThorVGModule } from "./wasm.js";

/**
 * Path command types for building paths
 */
export const PathCommand = {
  Close: 0,
  MoveTo: 1,
  LineTo: 2,
  CubicTo: 3,
} as const;

export type PathCommand = (typeof PathCommand)[keyof typeof PathCommand];

/**
 * Fill rule determines how the interior of a shape is determined
 */
export const FillRule = {
  NonZero: 0,
  EvenOdd: 1,
} as const;

export type FillRule = (typeof FillRule)[keyof typeof FillRule];

/**
 * A point in 2D space
 */
export interface Point {
  x: number;
  y: number;
}

export class Shape extends Paint {
  constructor(module: AnyThorVGModule) {
    const handle = module._tvg_shape_new();
    super(module, handle);
  }

  reset(): this {
    const result = this.module._tvg_shape_reset(this.handle);
    checkResult(result);
    return this;
  }

  appendRect(x: number, y: number, w: number, h: number, rx = 0, ry = 0): this {
    const result = this.module._tvg_shape_append_rect(
      this.handle,
      x,
      y,
      w,
      h,
      rx,
      ry,
      1
    );
    checkResult(result);
    return this;
  }

  appendCircle(cx: number, cy: number, rx: number, ry: number): this {
    const result = this.module._tvg_shape_append_circle(
      this.handle,
      cx,
      cy,
      rx,
      ry,
      1
    );
    checkResult(result);
    return this;
  }

  fill(r = 0, g = 0, b = 0, a = 255): this {
    const result = this.module._tvg_shape_set_fill_color(
      this.handle,
      r,
      g,
      b,
      a
    );
    checkResult(result);
    return this;
  }

  stroke(r = 0, g = 0, b = 0, a = 255): this {
    const result = this.module._tvg_shape_set_stroke_color(
      this.handle,
      r,
      g,
      b,
      a
    );
    checkResult(result);
    return this;
  }

  strokeWidth(width: number): this {
    const result = this.module._tvg_shape_set_stroke_width(this.handle, width);
    checkResult(result);
    return this;
  }

  moveTo(x: number, y: number): this {
    const result = this.module._tvg_shape_move_to(this.handle, x, y);
    checkResult(result);
    return this;
  }

  lineTo(x: number, y: number): this {
    const result = this.module._tvg_shape_line_to(this.handle, x, y);
    checkResult(result);
    return this;
  }

  cubicTo(
    cx1: number,
    cy1: number,
    cx2: number,
    cy2: number,
    x: number,
    y: number
  ): this {
    const result = this.module._tvg_shape_cubic_to(
      this.handle,
      cx1,
      cy1,
      cx2,
      cy2,
      x,
      y
    );
    checkResult(result);
    return this;
  }

  close(): this {
    const result = this.module._tvg_shape_close(this.handle);
    checkResult(result);
    return this;
  }

  appendPath(commands: PathCommand[], points: Point[]): this {
    // Allocate memory for commands array
    const cmdCount = commands.length;
    const cmdPtr = this.module._malloc(cmdCount);

    // Allocate memory for points array
    const pointCount = points.length;
    const pointsSize = pointCount * 8; // 2 floats (x, y) * 4 bytes each
    const pointsPtr = this.module._malloc(pointsSize);

    try {
      // Copy commands to WASM memory
      for (let i = 0; i < cmdCount; i++) {
        this.module.HEAPU8[cmdPtr + i] = commands[i];
      }

      // Copy points to WASM memory
      for (let i = 0; i < pointCount; i++) {
        const offset = pointsPtr / 4 + i * 2; // Divide by 4 for float32 indexing
        this.module.HEAPF32[offset] = points[i].x;
        this.module.HEAPF32[offset + 1] = points[i].y;
      }

      const result = this.module._tvg_shape_append_path(
        this.handle,
        cmdPtr,
        cmdCount,
        pointsPtr,
        pointCount
      );
      checkResult(result);
    } finally {
      // Free allocated memory
      this.module._free(cmdPtr);
      this.module._free(pointsPtr);
    }

    return this;
  }

  fillRule(rule: FillRule): this {
    const result = this.module._tvg_shape_set_fill_rule(this.handle, rule);
    checkResult(result);
    return this;
  }
}
