import { TvgResult } from "./types.js";
import type { AnyThorVGModule } from "./wasm.js";

/**
 * Checks if a ThorVG operation result is successful, throws if not.
 * @param result - The result code from a ThorVG operation
 * @throws {TvgResult} The error code if the operation failed
 */
export function checkResult(result: number): void {
  if (result !== TvgResult.SUCCESS) throw result as TvgResult;
}
