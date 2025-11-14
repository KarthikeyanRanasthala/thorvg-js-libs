import { Paint } from "./paint.js";
import { checkResult } from "./utils.js";
import { AnyThorVGModule } from "./wasm.js";

export const PathCommand = {
  Close: 0,
  MoveTo: 1,
  LineTo: 2,
  CubicTo: 3,
} as const;

export type PathCommandType = (typeof PathCommand)[keyof typeof PathCommand];

export const FillRule = {
  NonZero: 0,
  EvenOdd: 1,
} as const;

export type FillRuleType = (typeof FillRule)[keyof typeof FillRule];

export const StrokeCap = {
  Butt: 0,
  Round: 1,
  Square: 2,
} as const;

export type StrokeCapType = (typeof StrokeCap)[keyof typeof StrokeCap];

export const StrokeJoin = {
  Bevel: 0,
  Round: 1,
  Miter: 2,
} as const;

export type StrokeJoinType = (typeof StrokeJoin)[keyof typeof StrokeJoin];

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

  appendPath(commands: PathCommandType[], points: Point[]): this {
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

  fillRule(rule: FillRuleType): this {
    const result = this.module._tvg_shape_set_fill_rule(this.handle, rule);
    checkResult(result);
    return this;
  }

  strokeDash(dashPattern: number[], offset = 0): this {
    const count = dashPattern.length;
    const patternPtr = this.module._malloc(count * 4); // 4 bytes per float

    try {
      // Copy dash pattern to WASM memory
      for (let i = 0; i < count; i++) {
        this.module.HEAPF32[patternPtr / 4 + i] = dashPattern[i];
      }

      const result = this.module._tvg_shape_set_stroke_dash(
        this.handle,
        patternPtr,
        count,
        offset
      );
      checkResult(result);
    } finally {
      this.module._free(patternPtr);
    }

    return this;
  }

  strokeCap(cap: StrokeCapType): this {
    const result = this.module._tvg_shape_set_stroke_cap(this.handle, cap);
    checkResult(result);
    return this;
  }

  strokeJoin(join: StrokeJoinType): this {
    const result = this.module._tvg_shape_set_stroke_join(this.handle, join);
    checkResult(result);
    return this;
  }

  strokeMiterlimit(miterlimit: number): this {
    const result = this.module._tvg_shape_set_stroke_miterlimit(
      this.handle,
      miterlimit
    );
    checkResult(result);
    return this;
  }
}
