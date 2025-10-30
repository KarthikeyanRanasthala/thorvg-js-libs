import { ThorVGContext, type MainModule } from "./wasm-loader.js";
import { TvgResult } from "./types.js";
import { checkResult } from "./utils.js";

export class Engine {
  private module: MainModule;

  constructor(context: ThorVGContext) {
    this.module = context.module;
  }

  init(): void {
    // Note: threads has no effect in WASM (build uses -Dthreads=false)
    const result = this.module._tvg_engine_init(0);
    checkResult(result);
  }

  term(): void {
    const result = this.module._tvg_engine_term();
    checkResult(result);
  }
}
