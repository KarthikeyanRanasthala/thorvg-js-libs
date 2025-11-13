import { Shape, Scene, FillRule } from "bindings";
import {
  Props,
  Type,
  RectProps,
  CircleProps,
  PathProps,
  ShapeProps,
  SceneProps,
} from "./types";
import { RESERVED_PROPS, ElementType } from "./constants";
import { buildTransformMatrix } from "./matrix";

/**
 * Shallow comparison of props using reference equality.
 * Similar to React DOM's approach - only checks if references changed.
 * For objects/arrays to be considered "changed", they must have different references.
 */
export const diffProps = (
  oldProps: Props,
  newProps: Props
): Partial<Props> | null => {
  const changedProps: Partial<Props> = {};
  let diffExists = false;

  // Check for new or changed props (shallow equality check)
  for (const key in newProps) {
    if (RESERVED_PROPS.has(key)) continue;

    // @ts-ignore - Use reference equality (===) like React DOM
    if (oldProps[key] !== newProps[key]) {
      diffExists = true;
      // @ts-ignore
      changedProps[key] = newProps[key];
    }
  }

  // Check for removed props
  for (const key in oldProps) {
    if (RESERVED_PROPS.has(key)) continue;

    // @ts-ignore
    if (!(key in newProps)) {
      diffExists = true;
      // @ts-ignore - undefined indicates prop was removed
      changedProps[key] = undefined;
    }
  }

  return diffExists ? changedProps : null;
};

const DEFAULT_OPACITY = 255;
const DEFAULT_SCALE = 1;
const DEFAULT_ROTATION = 0;
const DEFAULT_POSITION = 0;
const DEFAULT_STROKE_WIDTH = 0;

export const applyProps = ({
  shape,
  scene,
  type,
  props,
}: {
  shape?: Shape;
  scene?: Scene;
  type: Type;
  props: Props;
}) => {
  if (type === ElementType.SCENE && scene) {
    const sceneProps = props as SceneProps;

    // Build transform matrix from props
    const matrix = buildTransformMatrix(
      sceneProps.x ?? DEFAULT_POSITION,
      sceneProps.y ?? DEFAULT_POSITION,
      sceneProps.rotation ?? DEFAULT_ROTATION,
      sceneProps.scaleX ?? DEFAULT_SCALE,
      sceneProps.scaleY ?? DEFAULT_SCALE
    );

    scene.setTransform(matrix);

    if (Object.hasOwn(sceneProps, "opacity")) {
      scene.opacity(sceneProps.opacity ?? DEFAULT_OPACITY);
    }

    return;
  }

  // Handle Shape component (parent that holds geometry)
  if (type === ElementType.SHAPE && shape) {
    const shapeProps = props as ShapeProps;

    // Apply fill color
    if (shapeProps.fill) {
      shape.fill(
        shapeProps.fill[0],
        shapeProps.fill[1],
        shapeProps.fill[2],
        shapeProps.fill[3]
      );
    }

    // Apply stroke
    if (shapeProps.stroke) {
      shape.stroke(
        shapeProps.stroke[0],
        shapeProps.stroke[1],
        shapeProps.stroke[2],
        shapeProps.stroke[3]
      );
    }

    if (Object.hasOwn(shapeProps, "strokeWidth")) {
      shape.strokeWidth(shapeProps.strokeWidth ?? DEFAULT_STROKE_WIDTH);
    }

    // Apply stroke dash
    if (shapeProps.strokeDash && shapeProps.strokeDash.length > 0) {
      shape.strokeDash(shapeProps.strokeDash, shapeProps.strokeDashOffset ?? 0);
    }

    // Apply stroke cap
    if (Object.hasOwn(shapeProps, "strokeCap")) {
      shape.strokeCap(shapeProps.strokeCap!);
    }

    // Apply stroke join
    if (Object.hasOwn(shapeProps, "strokeJoin")) {
      shape.strokeJoin(shapeProps.strokeJoin!);
    }

    // Apply stroke miterlimit
    if (Object.hasOwn(shapeProps, "strokeMiterlimit")) {
      shape.strokeMiterlimit(shapeProps.strokeMiterlimit ?? 4);
    }

    // Apply fill rule
    if (shapeProps.fillRule) {
      shape.fillRule(shapeProps.fillRule);
    }

    // Apply transform
    const matrix = buildTransformMatrix(
      shapeProps.x ?? DEFAULT_POSITION,
      shapeProps.y ?? DEFAULT_POSITION,
      shapeProps.rotation ?? DEFAULT_ROTATION,
      shapeProps.scaleX ?? DEFAULT_SCALE,
      shapeProps.scaleY ?? DEFAULT_SCALE
    );
    shape.setTransform(matrix);

    // Apply opacity
    if (Object.hasOwn(shapeProps, "opacity")) {
      shape.opacity(shapeProps.opacity ?? DEFAULT_OPACITY);
    }

    return;
  }

  // Handle geometry children (rect, circle, path)
  if (shape) {
    if (type === ElementType.RECT) {
      const rectProps = props as RectProps;

      shape.appendRect(
        rectProps.x,
        rectProps.y,
        rectProps.width,
        rectProps.height,
        rectProps.rx ?? 0,
        rectProps.ry ?? 0
      );
    } else if (type === ElementType.CIRCLE) {
      const circleProps = props as CircleProps;

      const rx = circleProps.radius ?? circleProps.rx ?? 0;
      const ry = circleProps.radius ?? circleProps.ry ?? 0;

      shape.appendCircle(circleProps.x, circleProps.y, rx, ry);
    } else if (type === ElementType.PATH) {
      const pathProps = props as PathProps;

      // Pass commands and points directly to appendPath
      shape.appendPath(pathProps.commands, pathProps.points);
    }
  }
};
