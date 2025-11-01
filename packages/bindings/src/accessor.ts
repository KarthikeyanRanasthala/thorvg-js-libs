import { AnyThorVGModule } from "./wasm.js";
import { TvgPaint, TvgAccessor } from "./types.js";
import { checkResult } from "./utils.js";

export interface PaintInfo {
  handle: TvgPaint;
  type: number;
  id?: number;
  transform?: number[];
  opacity?: number;
}

export type AccessorCallback = (paint: PaintInfo) => boolean;

export class Accessor {
  private readonly handle: TvgAccessor;
  private readonly module: AnyThorVGModule;

  constructor(module: AnyThorVGModule) {
    this.module = module;
    this.handle = module._tvg_accessor_new();
    if (!this.handle) {
      throw new Error("Failed to create Accessor");
    }
  }

  static generateId(name: string, module: AnyThorVGModule): number {
    const size = module.lengthBytesUTF8(name) + 1;

    const ptr = module._malloc(size);

    module.stringToUTF8(name, ptr, size);

    try {
      return module._tvg_accessor_generate_id(ptr);
    } finally {
      module._free(ptr);
    }
  }

  traverse(paint: TvgPaint, callback: AccessorCallback): void {
    const wrapperCallback = (paintPtr: TvgPaint) => {
      const typePtr = this.module._malloc(4);
      try {
        const result = this.module._tvg_paint_get_type(paintPtr, typePtr);
        checkResult(result);
        const type = this.module.HEAPU8[typePtr];

        return callback({ handle: paintPtr, type });
      } finally {
        this.module._free(typePtr);
      }
    };

    const callbackId = this.module.addFunction(wrapperCallback, "iii");

    try {
      const result = this.module._tvg_accessor_set(
        this.handle,
        paint,
        callbackId,
        0
      );
      checkResult(result);
    } finally {
      this.module.removeFunction(callbackId);
    }
  }

  analyze(paint: TvgPaint): {
    totalNodes: number;
    nodesByType: Map<number, number>;
    maxDepth: number;
  } {
    const stats = {
      totalNodes: 0,
      nodesByType: new Map<number, number>(),
      maxDepth: 0,
    };

    let currentDepth = 0;

    this.traverse(paint, (node) => {
      stats.totalNodes++;
      stats.nodesByType.set(
        node.type,
        (stats.nodesByType.get(node.type) || 0) + 1
      );
      stats.maxDepth = Math.max(stats.maxDepth, currentDepth);
      return true;
    });

    return stats;
  }

  destroy(): void {
    if (this.handle) {
      const result = this.module._tvg_accessor_del(this.handle);
      checkResult(result);
    }
  }
}
