import { ThorVGContext } from './wasm-loader.js';
import { TvgResult } from './types.js';
import { Paint } from './paint.js';
import { checkResult } from './utils.js';

export class Shape extends Paint {
  constructor(context: ThorVGContext) {
    const handle = context.module._tvg_shape_new();
    super(context, handle);
  }

  reset(): this {
    const result = this.module._tvg_shape_reset(this.handle);
    checkResult(result);
    return this;
  }

  appendRect(
    x: number,
    y: number,
    w: number,
    h: number,
    rx = 0,
    ry = 0
  ): this {
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
    const result = this.module._tvg_shape_set_fill_color(this.handle, r, g, b, a);
    checkResult(result);
    return this;
  }

  stroke(r = 0, g = 0, b = 0, a = 255): this {
    const result = this.module._tvg_shape_set_stroke_color(this.handle, r, g, b, a);
    checkResult(result);
    return this;
  }

  strokeWidth(width: number): this {
    const result = this.module._tvg_shape_set_stroke_width(this.handle, width);
    checkResult(result);
    return this;
  }
}
