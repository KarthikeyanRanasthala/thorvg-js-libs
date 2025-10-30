import MainModuleFactory, { type MainModule } from "../wasm/thorvg.js";

// Re-export MainModule type
export type { MainModule };

export interface ThorVGContext {
  module: MainModule;
}

export async function loadWasm({
  wasmPath,
}: {
  wasmPath?: string;
}): Promise<ThorVGContext> {
  const module = await MainModuleFactory({
    locateFile: (path: string, scriptDirectory: string) => {
      if (wasmPath) {
        return wasmPath;
      }

      return scriptDirectory + path;
    },
  });

  return { module };
}
