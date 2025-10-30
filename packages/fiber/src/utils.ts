import { Shape, Scene } from "bindings";
import {
  Props,
  Type,
  RectProps,
  CircleProps,
  GroupProps,
  CircleWithRadius,
  EllipseWithRadii,
} from "./types";
import { RESERVED_PROPS, STYLE_PROPS } from "./constants";
import { buildTransformMatrix } from "./matrix";

export const diffProps = (
  oldProps: Props,
  newProps: Props
): Partial<Props> | null => {
  const changedProps: Partial<Props> = {};
  let diffExists = false;

  for (const key in newProps) {
    if (RESERVED_PROPS.has(key)) continue;

    // @ts-ignore
    if (oldProps[key] !== newProps[key]) {
      diffExists = true;
      // @ts-ignore
      changedProps[key] = newProps[key];
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
  if (type === "group" && scene) {
    const groupProps = props as GroupProps;

    // Build transform matrix from props
    const matrix = buildTransformMatrix(
      groupProps.x ?? DEFAULT_POSITION,
      groupProps.y ?? DEFAULT_POSITION,
      groupProps.rotation ?? DEFAULT_ROTATION,
      groupProps.scaleX ?? DEFAULT_SCALE,
      groupProps.scaleY ?? DEFAULT_SCALE
    );

    scene.setTransform(matrix);

    if (Object.hasOwn(groupProps, "opacity")) {
      scene.opacity(groupProps.opacity ?? DEFAULT_OPACITY);
    }

    return;
  }
  // Handle shapes (rect, circle)
  if (shape) {
    if (Object.keys(props).some((key) => !STYLE_PROPS.has(key))) {
      shape.reset();
    }

    if (type === "rect") {
      const rectProps = props as RectProps;

      shape.appendRect(
        -rectProps.width / 2,
        -rectProps.height / 2,
        rectProps.width,
        rectProps.height
      );
    }

    if (type === "circle") {
      const circleProps = props as CircleProps;

      const rx =
        (circleProps as CircleWithRadius).radius ??
        (circleProps as EllipseWithRadii).rx ??
        0;
      const ry =
        (circleProps as CircleWithRadius).radius ??
        (circleProps as EllipseWithRadii).ry ??
        0;

      shape.appendCircle(0, 0, rx, ry);
    }

    const shapeProps = props as RectProps | CircleProps;

    if (shapeProps.fill) {
      shape.fill(
        shapeProps.fill[0],
        shapeProps.fill[1],
        shapeProps.fill[2],
        shapeProps.fill[3]
      );
    }

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

    const matrix = buildTransformMatrix(
      shapeProps.x ?? DEFAULT_POSITION,
      shapeProps.y ?? DEFAULT_POSITION,
      shapeProps.rotation ?? DEFAULT_ROTATION,
      shapeProps.scaleX ?? DEFAULT_SCALE,
      shapeProps.scaleY ?? DEFAULT_SCALE
    );
    shape.setTransform(matrix);

    if (Object.hasOwn(shapeProps, "opacity")) {
      shape.opacity(shapeProps.opacity ?? DEFAULT_OPACITY);
    }
  }
};
