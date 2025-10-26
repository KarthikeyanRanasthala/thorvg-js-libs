import { TvgMatrix } from "bindings";

/**
 * Build a transformation matrix from individual transform properties.
 * Matrix format: [e11, e12, e13, e21, e22, e23, e31, e32, e33]
 * Represents: | e11  e12  e13 |
 *             | e21  e22  e23 |
 *             | e31  e32  e33 |
 *
 * Where:
 * - e11, e12, e21, e22 = rotation and scale
 * - e13, e23 = translation (x, y)
 * - e31, e32 = 0
 * - e33 = 1
 */
export function buildTransformMatrix(
  x: number = 0,
  y: number = 0,
  rotation: number = 0,
  scaleX: number = 1,
  scaleY: number = 1
): TvgMatrix {
  // Convert rotation from degrees to radians
  const rad = (rotation * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);

  // Build combined transformation matrix
  // Order: Scale -> Rotate -> Translate
  // Matrix multiplication: T * R * S

  // Row 1: [scaleX*cos, -scaleY*sin, translateX]
  const e11 = cos * scaleX;
  const e12 = -sin * scaleY;
  const e13 = x;

  // Row 2: [scaleX*sin, scaleY*cos, translateY]
  const e21 = sin * scaleX;
  const e22 = cos * scaleY;
  const e23 = y;

  // Row 3: [0, 0, 1]
  const e31 = 0;
  const e32 = 0;
  const e33 = 1;

  return [e11, e12, e13, e21, e22, e23, e31, e32, e33];
}
