import { ThorVGContext } from './wasm-loader.js';
import { TvgPaint, TvgResult } from './types.js';
import { Paint } from './paint.js';

export class Scene extends Paint {
  constructor(context: ThorVGContext) {
    const handle = context.api.tvg_scene_new();
    super(context, handle);
  }

  push(paint: TvgPaint): this {
    const result = this.api.tvg_scene_push(this.handle, paint);
    if (result !== TvgResult.SUCCESS) throw result;
    return this;
  }

  insertBefore(target: TvgPaint, before: TvgPaint): this {
    const result = this.api.tvg_scene_push_at(this.handle, target, before);
    if (result !== TvgResult.SUCCESS) throw result;
    return this;
  }

  remove(paint: TvgPaint | null): this {
    // When paint is null, remove all children (clear)
    const result = this.api.tvg_scene_remove(this.handle, paint || 0);
    if (result !== TvgResult.SUCCESS) throw result;
    return this;
  }
}
