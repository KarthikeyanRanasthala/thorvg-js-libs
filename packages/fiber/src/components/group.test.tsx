import React from "react";
import { describe, it, expect } from "vitest";
import { render } from "../../testing";
import { Rect } from "./rect";
import { Circle } from "./circle";
import { Group } from "./group";
import { TvgPaintType } from "bindings";

describe("Group component", () => {
  it("renders a group", async () => {
    const { getByType, unmount } = await render(
      <Group>
        <Rect x={0} y={0} width={100} height={100} />
      </Group>
    );

    const scene = getByType(TvgPaintType.SCENE);
    expect(scene).toBeDefined();
    expect(scene.type).toBe(TvgPaintType.SCENE);

    unmount();
  });

  it("renders nested groups", async () => {
    const { getAllByType, unmount } = await render(
      <Group>
        <Rect x={0} y={0} width={100} height={100} />
        <Group>
          <Circle radius={50} />
        </Group>
      </Group>
    );

    const scenes = getAllByType(TvgPaintType.SCENE);
    expect(scenes).toHaveLength(2);

    const shapes = getAllByType(TvgPaintType.SHAPE);
    expect(shapes).toHaveLength(2);

    unmount();
  });

  it("matches snapshot", async () => {
    const { toJSON, unmount } = await render(
      <Group>
        <Rect x={0} y={0} width={100} height={100} />
        <Group>
          <Circle radius={50} />
        </Group>
      </Group>
    );

    expect(toJSON()).toMatchSnapshot();

    unmount();
  });

  it("can rerender nested structure", async () => {
    const { rerender, getAllByType, unmount } = await render(
      <Group>
        <Rect x={0} y={0} width={50} height={50} />
      </Group>
    );

    expect(getAllByType(TvgPaintType.SHAPE)).toHaveLength(1);

    await rerender(
      <Group>
        <Rect x={0} y={0} width={50} height={50} />
        <Circle radius={25} />
        <Group>
          <Rect x={100} y={100} width={50} height={50} />
        </Group>
      </Group>
    );

    expect(getAllByType(TvgPaintType.SCENE)).toHaveLength(2);
    expect(getAllByType(TvgPaintType.SHAPE)).toHaveLength(3);

    unmount();
  });
});
