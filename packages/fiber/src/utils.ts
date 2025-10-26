import { Shape, Scene, TvgPaint } from "bindings";
import { Props, Type, RectProps, CircleProps, GroupProps } from "./types";
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

export const applyProps = ({
  paint,
  shape,
  scene,
  type,
  props,
}: {
  paint: TvgPaint;
  shape?: Shape;
  scene?: Scene;
  type: Type;
  props: Props;
}) => {
  if (type === "group") {
    const groupProps = props as GroupProps;

    if (scene) {
      // Build transform matrix from props
      const matrix = buildTransformMatrix(
        groupProps.x ?? 0,
        groupProps.y ?? 0,
        groupProps.rotation ?? 0,
        groupProps.scale ?? 1,
        groupProps.scale ?? 1 // Use same scale for both X and Y
      );

      scene.setTransform(matrix);

      if (groupProps.opacity !== undefined) {
        scene.opacity(groupProps.opacity);
      }
    }
  } else {
    // Handle shapes (rect, circle)
    if (shape) {
      if (Object.keys(props).some((key) => !STYLE_PROPS.has(key))) {
        shape.reset();
      }

      if (type === "rect") {
        const rectProps = props as RectProps;
        shape.appendRect(
          rectProps.x,
          rectProps.y,
          rectProps.width,
          rectProps.height
        );
      }

      if (type === "circle") {
        const circleProps = props as CircleProps;
        shape.appendCircle(
          circleProps.cx,
          circleProps.cy,
          circleProps.rx,
          circleProps.ry
        );
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

      if (shapeProps.strokeWidth) {
        shape.strokeWidth(shapeProps.strokeWidth);
      }

      // Apply transform properties to shapes
      if (shapeProps.rotation !== undefined || shapeProps.scale !== undefined) {
        const matrix = buildTransformMatrix(
          0, // x translation (shapes use their own x/y for geometry)
          0, // y translation
          shapeProps.rotation ?? 0,
          shapeProps.scale ?? 1,
          shapeProps.scale ?? 1
        );
        shape.setTransform(matrix);
      }

      if (shapeProps.opacity !== undefined) {
        shape.opacity(shapeProps.opacity);
      }
    }
  }
};
