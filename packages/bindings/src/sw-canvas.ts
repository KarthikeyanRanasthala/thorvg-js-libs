import { ThorVGContext } from "./wasm-loader.js";
import { TvgColorspace, TvgEngineOption } from "./types.js";
import { Canvas } from "./canvas.js";
import { checkResult } from "./utils.js";

export class SwCanvas extends Canvas {
  bufferPtr: number = 0;
  bufferSize: number = 0;

  constructor(
    context: ThorVGContext,
    option: TvgEngineOption = TvgEngineOption.DEFAULT
  ) {
    const handle = context.module._tvg_swcanvas_create(option);

    super(context.module, handle);
  }

  setTarget(width: number, height: number, colorspace: TvgColorspace): void {
    this.bufferSize = width * height * 4;
    if (this.bufferPtr !== 0) {
      this.module._free(this.bufferPtr);
    }
    this.bufferPtr = this.module._malloc(this.bufferSize);

    const result = this.module._tvg_swcanvas_set_target(
      this.handle,
      this.bufferPtr,
      width,
      width,
      height,
      colorspace
    );
    checkResult(result);
  }

  destroy(): void {
    // Free allocated buffer
    if (this.bufferPtr !== 0) {
      this.module._free(this.bufferPtr);
      this.bufferPtr = 0;
    }
    // Destroy canvas
    this.destroyCanvas();
  }
}
