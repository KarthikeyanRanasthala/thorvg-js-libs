import { Accessor, TvgPaintType } from "bindings";
import { Container } from "../src/types";
import type { SceneSnapshot } from "./types";

function getTypeName(type: number): string {
  const typeNames: Record<number, string> = {
    [TvgPaintType.UNDEF]: "Undefined",
    [TvgPaintType.SHAPE]: "Shape",
    [TvgPaintType.SCENE]: "Scene",
    [TvgPaintType.PICTURE]: "Picture",
    [TvgPaintType.TEXT]: "Text",
    [TvgPaintType.LINEAR_GRAD]: "LinearGrad",
    [TvgPaintType.RADIAL_GRAD]: "RadialGrad",
  };
  return typeNames[type] || `Unknown(${type})`;
}

export function debug(container: Container): void {
  console.log("\n=== Scene Tree ===");

  const accessor = new Accessor(container.module);
  let nodeCount = 0;

  accessor.traverse(container.rootScene.handle, (paint) => {
    const typeName = getTypeName(paint.type);
    console.log(`  ${typeName} (handle: ${paint.handle})`);
    nodeCount++;
    return true;
  });

  console.log(`\n  Total nodes: ${nodeCount}`);
  console.log("==================\n");

  accessor.destroy();
}

export function toJSON(container: Container): SceneSnapshot {
  const accessor = new Accessor(container.module);
  const stats = accessor.analyze(container.rootScene.handle);
  accessor.destroy();

  return {
    totalNodes: stats.totalNodes,
    nodesByType: Object.fromEntries(stats.nodesByType),
    maxDepth: stats.maxDepth,
  };
}
