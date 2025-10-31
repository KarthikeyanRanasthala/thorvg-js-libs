import { TvgColorspace } from "./types.js";
import { Canvas } from "./canvas.js";
import { checkResult } from "./utils.js";
import { GlModule } from "./wasm.js";

export class GlCanvas extends Canvas {
  private emscriptenContextHandle: number = 0;

  constructor(module: GlModule, canvasSelector: string) {
    // Create WebGL context via Emscripten FIRST
    // This creates a proper Emscripten-managed WebGL2 context and makes it current
    const emscriptenContextHandle =
      module._tvg_webgl_create_context(canvasSelector);

    if (emscriptenContextHandle === 0) {
      throw new Error(
        `Failed to create WebGL2 context for selector: ${canvasSelector}`
      );
    }

    // Now create GL canvas handle (after WebGL context is ready)
    const handle = module._tvg_glcanvas_create();

    super(module, handle);

    this.emscriptenContextHandle = emscriptenContextHandle;
  }

  setTarget(width: number, height: number, colorspace: TvgColorspace): void {
    const result = this.module._tvg_glcanvas_set_target(
      this.handle,
      this.emscriptenContextHandle,
      0, // framebuffer ID (0 = default framebuffer)
      width,
      height,
      colorspace
    );
    checkResult(result);
  }

  destroy(): void {
    this.destroyCanvas();
  }
}
