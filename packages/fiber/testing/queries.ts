import { TvgPaintType, PaintInfo, Accessor } from "bindings";
import { Container } from "../src/types";

function getAllPaintsByType(
  container: Container,
  type: TvgPaintType
): PaintInfo[] {
  const found: PaintInfo[] = [];
  const accessor = new Accessor(container.module);

  accessor.traverse(container.rootScene.handle, (paint) => {
    // Skip the rootScene itself - it's an internal implementation detail
    if (paint.handle !== container.rootScene.handle && paint.type === type) {
      found.push(paint);
    }
    return true;
  });

  accessor.destroy();
  return found;
}

function getTypeName(type: TvgPaintType): string {
  const typeNames: Record<number, string> = {
    0: "Undefined",
    1: "Shape",
    2: "Scene",
    3: "Picture",
    4: "Text",
    10: "LinearGrad",
    11: "RadialGrad",
  };
  return typeNames[type] || `Unknown(${type})`;
}

export function getByType(container: Container, type: TvgPaintType): PaintInfo {
  const matches = getAllPaintsByType(container, type);

  if (matches.length === 0) {
    throw new Error(
      `Unable to find an element with type: ${getTypeName(type)}`
    );
  }

  if (matches.length > 1) {
    throw new Error(
      `Found multiple elements with type: ${getTypeName(type)} (found ${
        matches.length
      })`
    );
  }

  return matches[0];
}

export function getAllByType(
  container: Container,
  type: TvgPaintType
): PaintInfo[] {
  const matches = getAllPaintsByType(container, type);

  if (matches.length === 0) {
    throw new Error(
      `Unable to find any elements with type: ${getTypeName(type)}`
    );
  }

  return matches;
}

export function queryByType(
  container: Container,
  type: TvgPaintType
): PaintInfo | null {
  const matches = getAllPaintsByType(container, type);

  if (matches.length > 1) {
    throw new Error(
      `Found multiple elements with type: ${getTypeName(type)} (found ${
        matches.length
      })`
    );
  }

  return matches[0] || null;
}

export function queryAllByType(
  container: Container,
  type: TvgPaintType
): PaintInfo[] {
  return getAllPaintsByType(container, type);
}
