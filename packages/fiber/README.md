# react-thorvg-fiber

A React renderer for ThorVG, enabling declarative 2D vector graphics with high performance rendering.

## Installation

```bash
npm install react-thorvg-fiber
# or
pnpm add react-thorvg-fiber
```

## Usage

```jsx
import { Canvas, Rect, Circle, Group } from "react-thorvg-fiber";
import wasmUrl from "react-thorvg-fiber/thorvg.wasm?url";

function App() {
  return (
    <Canvas width={500} height={500} wasmPath={wasmUrl}>
      <Rect x={50} y={50} width={100} height={100} fill={[255, 0, 0, 255]} />
      <Circle cx={250} cy={250} rx={50} ry={50} fill={[0, 0, 255, 255]} />
      <Group x={300} y={300} rotation={45}>
        <Rect x={-25} y={-25} width={50} height={50} fill={[0, 255, 0, 255]} />
      </Group>
    </Canvas>
  );
}
```

## Components

### Canvas

The root container for ThorVG rendering.

**Props:**

- `width`: Canvas width in pixels
- `height`: Canvas height in pixels
- `wasmPath`: Path to the ThorVG WASM binary

### Rect

Renders a rectangle.

**Props:**

- `x`, `y`: Position
- `width`, `height`: Dimensions
- `fill`: RGBA color array `[r, g, b, a]`
- `stroke`: RGBA color array for border
- `strokeWidth`: Border width

### Circle

Renders an ellipse/circle.

**Props:**

- `cx`, `cy`: Center position
- `rx`, `ry`: Horizontal and vertical radius
- `fill`: RGBA color array `[r, g, b, a]`
- `stroke`: RGBA color array for border
- `strokeWidth`: Border width

### Group

Container for transforming multiple shapes together.

**Props:**

- `x`, `y`: Translation
- `rotation`: Rotation in degrees
- `scale`: Uniform scale factor
- `opacity`: Group opacity (0-1)

## Features

- Automatic DPR (Device Pixel Ratio) support for crisp rendering on high-DPI displays
- React-style declarative API
- Full TypeScript support
