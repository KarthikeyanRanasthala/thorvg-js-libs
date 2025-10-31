import { TvgPaint } from "./types.js";
import { Paint } from "./paint.js";
import { checkResult } from "./utils.js";
import { AnyThorVGModule } from "./wasm.js";

export class Scene extends Paint {
  constructor(module: AnyThorVGModule) {
    const handle = module._tvg_scene_new();
    super(module, handle);
  }

  push(paint: TvgPaint): this {
    const result = this.module._tvg_scene_push(this.handle, paint);
    checkResult(result);
    return this;
  }

  insertBefore(target: TvgPaint, before: TvgPaint): this {
    const result = this.module._tvg_scene_push_at(this.handle, target, before);
    checkResult(result);
    return this;
  }

  remove(paint: TvgPaint | null): this {
    // When paint is null, remove all children (clear)
    const result = this.module._tvg_scene_remove(this.handle, paint || 0);
    checkResult(result);
    return this;
  }
}
