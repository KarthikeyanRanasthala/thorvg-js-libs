import React from "react";
import { describe, it, expect } from "vitest";
import { render } from "../../testing";
import { Shape, Rect, Circle, Scene } from ".";
import { TvgPaintType } from "bindings";

describe("Scene component", () => {
  it("renders a scene", async () => {
    const { getByType, unmount } = await render(
      <Scene>
        <Shape fill={[255, 0, 0, 255]} x={0} y={0}>
          <Rect width={100} height={100} />
        </Shape>
      </Scene>
    );

    const scene = getByType(TvgPaintType.SCENE);
    expect(scene).toBeDefined();
    expect(scene.type).toBe(TvgPaintType.SCENE);

    unmount();
  });

  it("renders nested scenes", async () => {
    const { getAllByType, unmount } = await render(
      <Scene>
        <Shape fill={[255, 0, 0, 255]} x={0} y={0}>
          <Rect width={100} height={100} />
        </Shape>
        <Scene>
          <Shape fill={[0, 255, 0, 255]}>
            <Circle radius={50} />
          </Shape>
        </Scene>
      </Scene>
    );

    const scenes = getAllByType(TvgPaintType.SCENE);
    expect(scenes).toHaveLength(2);

    const shapes = getAllByType(TvgPaintType.SHAPE);
    expect(shapes).toHaveLength(2);

    unmount();
  });

  it("matches snapshot", async () => {
    const { toJSON, unmount } = await render(
      <Scene>
        <Shape fill={[255, 0, 0, 255]} x={0} y={0}>
          <Rect width={100} height={100} />
        </Shape>
        <Scene>
          <Shape fill={[0, 255, 0, 255]}>
            <Circle radius={50} />
          </Shape>
        </Scene>
      </Scene>
    );

    expect(toJSON()).toMatchSnapshot();

    unmount();
  });

  it("can rerender nested structure", async () => {
    const { rerender, getAllByType, unmount } = await render(
      <Scene>
        <Shape fill={[255, 0, 0, 255]} x={0} y={0}>
          <Rect width={50} height={50} />
        </Shape>
      </Scene>
    );

    expect(getAllByType(TvgPaintType.SHAPE)).toHaveLength(1);

    await rerender(
      <Scene>
        <Shape fill={[255, 0, 0, 255]} x={0} y={0}>
          <Rect width={50} height={50} />
        </Shape>
        <Shape fill={[0, 255, 0, 255]}>
          <Circle radius={25} />
        </Shape>
        <Scene>
          <Shape fill={[0, 0, 255, 255]} x={100} y={100}>
            <Rect width={50} height={50} />
          </Shape>
        </Scene>
      </Scene>
    );

    expect(getAllByType(TvgPaintType.SCENE)).toHaveLength(2);
    expect(getAllByType(TvgPaintType.SHAPE)).toHaveLength(3);

    unmount();
  });
});
