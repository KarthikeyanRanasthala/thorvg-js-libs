import { Engine, SwCanvas, TvgColorspace, SwModuleFactory } from "bindings";
import {
  createReconciler,
  createReconcilerContainer,
  updateReconcilerContainer,
  cleanupReconcilerContainer,
  type Reconciler,
} from "../src/reconciler";
import type { RenderResult, RenderOptions } from "./types";
import {
  getByType,
  getAllByType,
  queryByType,
  queryAllByType,
} from "./queries";
import { debug, toJSON } from "./snapshot";

export async function render(
  element: React.ReactElement,
  options?: RenderOptions
): Promise<RenderResult> {
  const { width = 800, height = 600 } = options ?? {};

  const module = await SwModuleFactory({
    locateFile: (path) => {
      // In tests, map thorvg.wasm to thorvg-sw.wasm from sibling bindings package
      if (path === "thorvg.wasm") {
        return "../bindings/dist/thorvg-sw.wasm";
      }
      return path;
    },
  });
  const engine = new Engine(module);
  engine.init();

  const canvas = new SwCanvas(module);
  canvas.setTarget(width, height, TvgColorspace.ABGR8888);

  const reconciler = createReconciler();
  const root = createReconcilerContainer({ reconciler, module, canvas });

  await new Promise<void>((resolve) => {
    updateReconcilerContainer({
      children: element,
      root,
      reconciler,
      callback: resolve,
    });
  });

  const container = (root as any).containerInfo;

  return {
    container,

    getByType: (type) => getByType(container, type),
    getAllByType: (type) => getAllByType(container, type),
    queryByType: (type) => queryByType(container, type),
    queryAllByType: (type) => queryAllByType(container, type),

    rerender: async (newElement) => {
      // updateContainer schedules async work via the scheduler
      await new Promise<void>((resolve) => {
        updateReconcilerContainer({
          children: newElement,
          root,
          reconciler,
          callback: resolve,
        });
      });
    },

    unmount: () => {
      cleanupReconcilerContainer({
        root,
        canvas,
        reconciler,
      });
    },

    debug: () => debug(container),
    toJSON: () => toJSON(container),
  };
}
