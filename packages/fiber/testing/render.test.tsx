import React from "react";
import { describe, it, expect } from "vitest";
import { render } from "./render";
import { Shape, Rect, Circle } from "../src/components";
import { TvgPaintType } from "bindings";

describe("Testing utilities", () => {
  it("render creates a container", async () => {
    const { container, unmount } = await render(
      <Shape fill={[255, 0, 0, 255]} x={0} y={0}>
        <Rect width={50} height={50} />
      </Shape>
    );

    expect(container).toBeDefined();
    expect(container.module).toBeDefined();
    expect(container.canvas).toBeDefined();
    expect(container.rootScene).toBeDefined();

    unmount();
  });

  it("render accepts custom dimensions", async () => {
    const { container, unmount } = await render(
      <Shape fill={[255, 0, 0, 255]} x={0} y={0}>
        <Rect width={50} height={50} />
      </Shape>,
      { width: 1024, height: 768 }
    );

    expect(container).toBeDefined();

    unmount();
  });

  it("queries find correct elements", async () => {
    const { getByType, queryByType, unmount } = await render(
      <Shape fill={[255, 0, 0, 255]} x={0} y={0}>
        <Rect width={50} height={50} />
      </Shape>
    );

    expect(getByType(TvgPaintType.SHAPE)).toBeDefined();
    expect(queryByType(TvgPaintType.TEXT)).toBeNull();

    unmount();
  });

  it("getByType throws when element not found", async () => {
    const { getByType, unmount } = await render(
      <Shape fill={[255, 0, 0, 255]} x={0} y={0}>
        <Rect width={50} height={50} />
      </Shape>
    );

    expect(() => getByType(TvgPaintType.TEXT)).toThrow(
      "Unable to find an element with type: Text"
    );

    unmount();
  });

  it("getByType throws when multiple elements found", async () => {
    const { getByType, unmount } = await render(
      <>
        <Shape fill={[255, 0, 0, 255]} x={0} y={0}>
          <Rect width={50} height={50} />
        </Shape>
        <Shape fill={[0, 255, 0, 255]} x={100} y={0}>
          <Rect width={50} height={50} />
        </Shape>
      </>
    );

    expect(() => getByType(TvgPaintType.SHAPE)).toThrow(
      "Found multiple elements with type: Shape (found 2)"
    );

    unmount();
  });

  it("queryAllByType returns empty array when elements not found", async () => {
    const { queryAllByType, unmount } = await render(
      <Shape fill={[255, 0, 0, 255]} x={0} y={0}>
        <Rect width={50} height={50} />
      </Shape>
    );

    const results = queryAllByType(TvgPaintType.TEXT);
    expect(results).toEqual([]);

    unmount();
  });

  it("debug prints scene tree", async () => {
    const { debug, unmount } = await render(
      <>
        <Shape fill={[255, 0, 0, 255]} x={0} y={0}>
          <Rect width={50} height={50} />
        </Shape>
        <Shape fill={[0, 255, 0, 255]}>
          <Circle radius={25} />
        </Shape>
      </>
    );

    // Should not throw
    expect(() => debug()).not.toThrow();

    unmount();
  });

  it("toJSON returns scene snapshot", async () => {
    const { toJSON, unmount } = await render(
      <>
        <Shape fill={[255, 0, 0, 255]} x={0} y={0}>
          <Rect width={50} height={50} />
        </Shape>
        <Shape fill={[0, 255, 0, 255]}>
          <Circle radius={25} />
        </Shape>
      </>
    );

    const snapshot = toJSON();
    expect(snapshot).toBeDefined();
    expect(snapshot.totalNodes).toBeGreaterThan(0);
    expect(snapshot.nodesByType).toBeDefined();
    expect(snapshot.maxDepth).toBeGreaterThanOrEqual(0);

    unmount();
  });

  it("unmount cleans up resources", async () => {
    const { unmount } = await render(
      <Shape fill={[255, 0, 0, 255]} x={0} y={0}>
        <Rect width={50} height={50} />
      </Shape>
    );

    // Should not throw
    expect(() => unmount()).not.toThrow();
  });
});
