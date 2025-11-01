import React from "react";
import { TvgPaintType } from "bindings";
import { describe, expect, it } from "vitest";
import { render } from "../../testing";
import { Shape, Rect, Circle, Scene } from "../components";

describe("shape", () => {
  it("should maintain instance when props change", async () => {
    const { getByType, unmount, rerender } = await render(
      <Shape fill={[255, 0, 0, 255]} />
    );

    const shape = getByType(TvgPaintType.SHAPE);
    expect(shape.handle).toBeDefined();

    await rerender(<Shape fill={[0, 255, 0, 255]} />);

    const updatedShape = getByType(TvgPaintType.SHAPE);
    expect(updatedShape.handle).toBe(shape.handle);

    unmount();
  });

  it("should maintain instance when children change", async () => {
    const { getByType, unmount, rerender } = await render(
      <Shape fill={[255, 0, 0, 255]}>
        <Rect width={50} height={50} />
      </Shape>
    );

    const shape = getByType(TvgPaintType.SHAPE);
    expect(shape.handle).toBeDefined();

    await rerender(
      <Shape fill={[0, 255, 0, 255]}>
        <Circle radius={25} />
      </Shape>
    );

    const updatedShape = getByType(TvgPaintType.SHAPE);
    expect(updatedShape.handle).toBe(shape.handle);

    unmount();
  });

  it("should maintain instance when children's props change", async () => {
    const { getByType, unmount, rerender } = await render(
      <Shape fill={[255, 0, 0, 255]}>
        <Rect width={50} height={50} />
      </Shape>
    );

    const shape = getByType(TvgPaintType.SHAPE);
    expect(shape.handle).toBeDefined();

    await rerender(
      <Shape fill={[0, 255, 0, 255]}>
        <Rect width={100} height={100} />
      </Shape>
    );

    const updatedShape = getByType(TvgPaintType.SHAPE);
    expect(updatedShape.handle).toBe(shape.handle);

    unmount();
  });

  it("should maintain instance when children are added", async () => {
    const { getByType, unmount, rerender } = await render(
      <Shape fill={[255, 0, 0, 255]}>
        <Rect width={50} height={50} />
      </Shape>
    );

    const shape = getByType(TvgPaintType.SHAPE);
    expect(shape.handle).toBeDefined();

    await rerender(
      <Shape fill={[0, 255, 0, 255]}>
        <Rect width={50} height={50} />
        <Circle radius={25} />
      </Shape>
    );

    const updatedShape = getByType(TvgPaintType.SHAPE);
    expect(updatedShape.handle).toBe(shape.handle);

    unmount();
  });

  it("should maintain instance when children are removed", async () => {
    const { getByType, unmount, rerender } = await render(
      <Shape fill={[255, 0, 0, 255]}>
        <Rect width={50} height={50} />
        <Circle radius={25} />
      </Shape>
    );

    const shape = getByType(TvgPaintType.SHAPE);
    expect(shape.handle).toBeDefined();

    await rerender(
      <Shape fill={[0, 255, 0, 255]}>
        <Rect width={50} height={50} />
      </Shape>
    );

    const updatedShape = getByType(TvgPaintType.SHAPE);
    expect(updatedShape.handle).toBe(shape.handle);

    unmount();
  });

  it("should maintain instance when children are reordered", async () => {
    const { getByType, unmount, rerender } = await render(
      <Shape fill={[255, 0, 0, 255]}>
        <Rect width={50} height={50} />
        <Circle radius={25} />
      </Shape>
    );

    const shape = getByType(TvgPaintType.SHAPE);
    expect(shape.handle).toBeDefined();

    await rerender(
      <Shape fill={[0, 255, 0, 255]}>
        <Circle radius={25} />
        <Rect width={50} height={50} />
      </Shape>
    );

    const updatedShape = getByType(TvgPaintType.SHAPE);
    expect(updatedShape.handle).toBe(shape.handle);

    unmount();
  });
});

describe("scene", () => {
  it("should render a scene", async () => {
    const { getByType, unmount } = await render(<Scene />);

    const scene = getByType(TvgPaintType.SCENE);
    expect(scene).toBeDefined();

    unmount();
  });

  it("should render multiple scenes", async () => {
    const { getAllByType, unmount } = await render(
      <>
        <Scene />
        <Scene />
      </>
    );

    const scenes = getAllByType(TvgPaintType.SCENE);
    expect(scenes).toHaveLength(2);

    unmount();
  });
});
