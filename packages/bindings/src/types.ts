export enum TvgResult {
  SUCCESS = 0,
  INVALID_ARGUMENT = 1,
  INSUFFICIENT_CONDITION = 2,
  FAILED_ALLOCATION = 3,
  MEMORY_CORRUPTION = 4,
  NOT_SUPPORTED = 5,
  UNKNOWN = 6,
}

export enum TvgColorspace {
  ABGR8888 = 0,
}

export enum TvgEngineOption {
  DEFAULT = 1,
}

export type TvgCanvas = number; // Pointer
export type TvgPaint = number; // Pointer

// 3x3 affine transformation matrix in row-major order
// Format: [e11, e12, e13, e21, e22, e23, e31, e32, e33]
// Represents: | e11  e12  e13 |
//             | e21  e22  e23 |
//             | e31  e32  e33 |
// Where:
//   - e11, e12, e21, e22 = rotation and scale
//   - e13, e23 = translation (x, y)
//   - e31, e32 = 0 (for 2D affine transforms)
//   - e33 = 1
// Transformation: x' = e11*x + e12*y + e13
//                 y' = e21*x + e22*y + e23
export type TvgMatrix = [
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number
];
