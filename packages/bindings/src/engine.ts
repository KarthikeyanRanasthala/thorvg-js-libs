import { ThorVGAPI, ThorVGContext } from "./wasm-loader.js";
import { TvgResult } from "./types.js";

export class Engine {
  private api: ThorVGAPI;

  constructor(context: ThorVGContext) {
    this.api = context.api;
  }

  init(threads: number = 0): void {
    // Note: threads has no effect in WASM (build uses -Dthreads=false)
    const result = this.api.tvg_engine_init(threads);
    if (result !== TvgResult.SUCCESS) throw result;
  }

  term(): void {
    const result = this.api.tvg_engine_term();
    if (result !== TvgResult.SUCCESS) throw result;
  }
}
