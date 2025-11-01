import React from "react";
import { describe, it, expect } from "vitest";
import { render } from "../../testing";
import { Rect } from "./rect";
import { TvgPaintType } from "bindings";

describe("Rect component", () => {
  it("renders a rectangle", async () => {
    const { getByType, unmount } = await render(
      <Rect x={0} y={0} width={100} height={50} />
    );

    const shape = getByType(TvgPaintType.SHAPE);
    expect(shape).toBeDefined();
    expect(shape.type).toBe(TvgPaintType.SHAPE);

    unmount();
  });

  it("renders multiple rectangles", async () => {
    const { getAllByType, unmount } = await render(
      <>
        <Rect x={0} y={0} width={50} height={50} />
        <Rect x={100} y={0} width={50} height={50} />
      </>
    );

    const shapes = getAllByType(TvgPaintType.SHAPE);
    expect(shapes).toHaveLength(2);
    expect(shapes[0].type).toBe(TvgPaintType.SHAPE);
    expect(shapes[1].type).toBe(TvgPaintType.SHAPE);

    unmount();
  });

  it("can rerender with new props", async () => {
    const { rerender, getAllByType, unmount } = await render(
      <Rect x={0} y={0} width={50} height={50} />
    );

    expect(getAllByType(TvgPaintType.SHAPE)).toHaveLength(1);

    await rerender(
      <>
        <Rect x={0} y={0} width={50} height={50} />
        <Rect x={100} y={0} width={50} height={50} />
      </>
    );

    expect(getAllByType(TvgPaintType.SHAPE)).toHaveLength(2);

    unmount();
  });

  it("throws when element not found with getByType", async () => {
    const { getByType, unmount } = await render(
      <Rect x={0} y={0} width={50} height={50} />
    );

    expect(() => getByType(TvgPaintType.TEXT)).toThrow(
      "Unable to find an element with type: Text"
    );

    unmount();
  });

  it("throws when multiple elements found with getByType", async () => {
    const { getByType, unmount } = await render(
      <>
        <Rect x={0} y={0} width={50} height={50} />
        <Rect x={100} y={0} width={50} height={50} />
      </>
    );

    expect(() => getByType(TvgPaintType.SHAPE)).toThrow(
      "Found multiple elements with type: Shape (found 2)"
    );

    unmount();
  });

  it("returns null with queryByType when element not found", async () => {
    const { queryByType, unmount } = await render(
      <Rect x={0} y={0} width={50} height={50} />
    );

    const result = queryByType(TvgPaintType.TEXT);
    expect(result).toBeNull();

    unmount();
  });

  it("returns empty array with queryAllByType when elements not found", async () => {
    const { queryAllByType, unmount } = await render(
      <Rect x={0} y={0} width={50} height={50} />
    );

    const results = queryAllByType(TvgPaintType.TEXT);
    expect(results).toEqual([]);

    unmount();
  });
});
