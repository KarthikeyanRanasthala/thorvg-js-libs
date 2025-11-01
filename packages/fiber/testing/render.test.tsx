import React from "react";
import { describe, it, expect } from "vitest";
import { render } from "./render";
import { Rect, Circle } from "../src/components";
import { TvgPaintType } from "bindings";

describe("Testing utilities", () => {
  it("render creates a container", async () => {
    const { container, unmount } = await render(
      <Rect x={0} y={0} width={50} height={50} />
    );

    expect(container).toBeDefined();
    expect(container.module).toBeDefined();
    expect(container.canvas).toBeDefined();
    expect(container.rootScene).toBeDefined();

    unmount();
  });

  it("render accepts custom dimensions", async () => {
    const { container, unmount } = await render(
      <Rect x={0} y={0} width={50} height={50} />,
      { width: 1024, height: 768 }
    );

    expect(container).toBeDefined();

    unmount();
  });

  it("queries find correct elements", async () => {
    const { getByType, queryByType, unmount } = await render(
      <Rect x={0} y={0} width={50} height={50} />
    );

    expect(getByType(TvgPaintType.SHAPE)).toBeDefined();
    expect(queryByType(TvgPaintType.TEXT)).toBeNull();

    unmount();
  });

  it("debug prints scene tree", async () => {
    const { debug, unmount } = await render(
      <>
        <Rect x={0} y={0} width={50} height={50} />
        <Circle radius={25} />
      </>
    );

    // Should not throw
    expect(() => debug()).not.toThrow();

    unmount();
  });

  it("toJSON returns scene snapshot", async () => {
    const { toJSON, unmount } = await render(
      <>
        <Rect x={0} y={0} width={50} height={50} />
        <Circle radius={25} />
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
      <Rect x={0} y={0} width={50} height={50} />
    );

    // Should not throw
    expect(() => unmount()).not.toThrow();
  });
});
