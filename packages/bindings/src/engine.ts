import { checkResult } from "./utils.js";
import { AnyThorVGModule } from "./wasm.js";

export class Engine {
  private module: AnyThorVGModule;

  constructor(module: AnyThorVGModule) {
    this.module = module;
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
