import _SwModuleFactory, {
  type MainModule as SwModule,
} from "../wasm/thorvg-sw.js";

import _GlModuleFactory, {
  type MainModule as _GlModule,
} from "../wasm/thorvg-gl.js";

interface GlModule extends _GlModule {
  _tvg_webgl_create_context: (selector: string) => number;
}

type AnyThorVGModule = SwModule | GlModule;

interface Options {
  locateFile?: (path: string, prefix: string) => string;
}

const SwModuleFactory = (options?: Options) => _SwModuleFactory(options);
const GlModuleFactory = (options?: Options) =>
  _GlModuleFactory(options) as Promise<GlModule>;

export {
  SwModuleFactory,
  type SwModule,
  GlModuleFactory,
  type GlModule,
  type AnyThorVGModule,
};
