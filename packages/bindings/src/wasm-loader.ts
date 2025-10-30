import MainModuleFactory, { type MainModule } from "../wasm/thorvg.js";

export type Module = MainModule & {
  _tvg_webgl_create_context: (selector: string) => number;
};

export interface ThorVGContext {
  module: Module;
}

export async function loadWasm({
  wasmPath,
}: {
  wasmPath?: string;
} = {}): Promise<ThorVGContext> {
  const module = (await MainModuleFactory({
    locateFile: (path: string, scriptDirectory: string) => {
      if (wasmPath) {
        return wasmPath;
      }

      return scriptDirectory + path;
    },
  })) as Module;

  return { module };
}
