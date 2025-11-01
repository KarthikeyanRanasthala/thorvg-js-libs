import React from "react";
import { describe, it, expect } from "vitest";
import { render } from "../testing";
import { Rect, Circle, Group } from "./components";
import { TvgPaintType } from "bindings";

describe("Reconciler", () => {
  describe("Instance stability", () => {
    it("preserves instance identity when rerendering with same props", async () => {
      const { getAllByType, rerender, unmount } = await render(
        <Rect x={0} y={0} width={100} height={100} />
      );

      const [firstRect] = getAllByType(TvgPaintType.SHAPE);
      const firstHandle = firstRect.handle;

      // Rerender with identical props
      await rerender(<Rect x={0} y={0} width={100} height={100} />);

      const [secondRect] = getAllByType(TvgPaintType.SHAPE);
      const secondHandle = secondRect.handle;

      // Handle should be identical - same instance was reused
      expect(secondHandle).toBe(firstHandle);

      unmount();
    });

    it("preserves existing instances when adding new elements", async () => {
      const { getAllByType, rerender, unmount } = await render(
        <Rect x={0} y={0} width={100} height={100} />
      );

      const [originalRect] = getAllByType(TvgPaintType.SHAPE);
      const originalHandle = originalRect.handle;

      // Add a second rectangle
      await rerender(
        <>
          <Rect x={0} y={0} width={100} height={100} />
          <Rect x={200} y={0} width={100} height={100} />
        </>
      );

      const [firstRect, secondRect] = getAllByType(TvgPaintType.SHAPE);

      // First rectangle should be the same instance
      expect(firstRect.handle).toBe(originalHandle);
      // Second rectangle should be a new instance
      expect(secondRect.handle).not.toBe(originalHandle);
      expect(secondRect.handle).not.toBe(firstRect.handle);

      unmount();
    });

    it("updates instance when props change", async () => {
      const { getAllByType, rerender, unmount } = await render(
        <Rect x={0} y={0} width={100} height={100} />
      );

      const [firstRect] = getAllByType(TvgPaintType.SHAPE);
      const originalHandle = firstRect.handle;

      // Rerender with different props
      await rerender(<Rect x={50} y={50} width={200} height={200} />);

      const [updatedRect] = getAllByType(TvgPaintType.SHAPE);

      // Should be same instance (same handle) but with updated props
      expect(updatedRect.handle).toBe(originalHandle);

      unmount();
    });

    it("creates only new instances for new elements", async () => {
      const { getAllByType, rerender, unmount } = await render(
        <>
          <Rect x={0} y={0} width={50} height={50} />
          <Circle radius={25} />
        </>
      );

      const originalShapes = getAllByType(TvgPaintType.SHAPE);
      expect(originalShapes).toHaveLength(2);
      const [rect1Handle, circle1Handle] = originalShapes.map((s) => s.handle);

      // Add two more shapes
      await rerender(
        <>
          <Rect x={0} y={0} width={50} height={50} />
          <Circle radius={25} />
          <Rect x={100} y={100} width={50} height={50} />
          <Circle radius={30} />
        </>
      );

      const newShapes = getAllByType(TvgPaintType.SHAPE);
      expect(newShapes).toHaveLength(4);

      // First two should be original instances
      expect(newShapes[0].handle).toBe(rect1Handle);
      expect(newShapes[1].handle).toBe(circle1Handle);

      // Last two should be new instances
      expect(newShapes[2].handle).not.toBe(rect1Handle);
      expect(newShapes[2].handle).not.toBe(circle1Handle);
      expect(newShapes[3].handle).not.toBe(rect1Handle);
      expect(newShapes[3].handle).not.toBe(circle1Handle);

      unmount();
    });
  });

  describe("Element removal", () => {
    it("removes instances when elements are removed (with keys)", async () => {
      const { getAllByType, rerender, unmount } = await render(
        <>
          <Rect key="first" x={0} y={0} width={50} height={50} />
          <Rect key="middle" x={100} y={0} width={50} height={50} />
          <Rect key="last" x={200} y={0} width={50} height={50} />
        </>
      );

      const originalShapes = getAllByType(TvgPaintType.SHAPE);
      expect(originalShapes).toHaveLength(3);

      const firstHandle = originalShapes[0].handle;
      const lastHandle = originalShapes[2].handle;

      // Remove middle rectangle
      await rerender(
        <>
          <Rect key="first" x={0} y={0} width={50} height={50} />
          <Rect key="last" x={200} y={0} width={50} height={50} />
        </>
      );

      const remainingShapes = getAllByType(TvgPaintType.SHAPE);
      expect(remainingShapes).toHaveLength(2);

      // With keys, first and last elements should preserve their handles
      expect(remainingShapes[0].handle).toBe(firstHandle);
      expect(remainingShapes[1].handle).toBe(lastHandle);

      unmount();
    });

    it("removes all instances when container is emptied", async () => {
      const { getAllByType, queryAllByType, rerender, unmount } = await render(
        <>
          <Rect x={0} y={0} width={50} height={50} />
          <Circle radius={25} />
        </>
      );

      expect(getAllByType(TvgPaintType.SHAPE)).toHaveLength(2);

      // Remove all elements
      await rerender(<></>);

      // Use queryAllByType since getAllByType throws when no elements found
      expect(queryAllByType(TvgPaintType.SHAPE)).toHaveLength(0);

      unmount();
    });
  });

  describe("Type changes", () => {
    it("creates new instance when element type changes", async () => {
      const { getAllByType, rerender, unmount } = await render(
        <Rect x={0} y={0} width={100} height={100} />
      );

      const [originalRect] = getAllByType(TvgPaintType.SHAPE);
      const originalHandle = originalRect.handle;

      // Change from Rect to Circle
      await rerender(<Circle radius={50} />);

      const [newCircle] = getAllByType(TvgPaintType.SHAPE);

      // Should be a completely new instance
      expect(newCircle.handle).not.toBe(originalHandle);

      unmount();
    });
  });

  describe("Nested structures", () => {
    it("preserves nested group structure across rerenders", async () => {
      const { getAllByType, rerender, unmount } = await render(
        <Group>
          <Rect x={0} y={0} width={50} height={50} />
        </Group>
      );

      const originalGroups = getAllByType(TvgPaintType.SCENE);
      const originalGroupHandles = originalGroups.map((g) => g.handle);

      // Rerender with same structure
      await rerender(
        <Group>
          <Rect x={0} y={0} width={50} height={50} />
        </Group>
      );

      const newGroups = getAllByType(TvgPaintType.SCENE);

      // Group instances should be preserved
      expect(newGroups).toHaveLength(originalGroups.length);
      newGroups.forEach((group, i) => {
        expect(group.handle).toBe(originalGroupHandles[i]);
      });

      unmount();
    });

    it("preserves parent instances when modifying children", async () => {
      const { getAllByType, rerender, unmount } = await render(
        <Group>
          <Rect x={0} y={0} width={50} height={50} />
        </Group>
      );

      const [originalGroup] = getAllByType(TvgPaintType.SCENE);
      const originalGroupHandle = originalGroup.handle;
      const [originalRect] = getAllByType(TvgPaintType.SHAPE);
      const originalRectHandle = originalRect.handle;

      // Add another child to the group
      await rerender(
        <Group>
          <Rect x={0} y={0} width={50} height={50} />
          <Circle radius={25} />
        </Group>
      );

      const [newGroup] = getAllByType(TvgPaintType.SCENE);
      const shapes = getAllByType(TvgPaintType.SHAPE);

      // Group should be same instance
      expect(newGroup.handle).toBe(originalGroupHandle);
      // Original rect should be same instance
      expect(shapes[0].handle).toBe(originalRectHandle);
      // New circle should be different
      expect(shapes[1].handle).not.toBe(originalRectHandle);
      expect(shapes).toHaveLength(2);

      unmount();
    });
  });

  describe("Prop updates", () => {
    it("efficiently updates multiple props on same instance", async () => {
      const { getAllByType, rerender, unmount } = await render(
        <Rect x={0} y={0} width={100} height={100} />
      );

      const [originalRect] = getAllByType(TvgPaintType.SHAPE);
      const originalHandle = originalRect.handle;

      // Update multiple props
      await rerender(<Rect x={10} y={20} width={150} height={200} />);

      const [updatedRect] = getAllByType(TvgPaintType.SHAPE);

      // Should still be same instance
      expect(updatedRect.handle).toBe(originalHandle);

      unmount();
    });

    it("handles partial prop updates", async () => {
      const { getAllByType, rerender, unmount } = await render(
        <Rect x={0} y={0} width={100} height={100} />
      );

      const [originalRect] = getAllByType(TvgPaintType.SHAPE);
      const originalHandle = originalRect.handle;

      // Update only some props
      await rerender(<Rect x={50} y={0} width={100} height={100} />);

      const [updatedRect] = getAllByType(TvgPaintType.SHAPE);

      // Should still be same instance
      expect(updatedRect.handle).toBe(originalHandle);

      unmount();
    });
  });

  describe("Reordering", () => {
    it("handles element reordering", async () => {
      const { getAllByType, rerender, unmount } = await render(
        <>
          <Rect x={0} y={0} width={50} height={50} />
          <Circle radius={25} />
        </>
      );

      const originalShapes = getAllByType(TvgPaintType.SHAPE);
      expect(originalShapes).toHaveLength(2);

      // Swap order (note: without keys, React may not preserve identity)
      await rerender(
        <>
          <Circle radius={25} />
          <Rect x={0} y={0} width={50} height={50} />
        </>
      );

      const reorderedShapes = getAllByType(TvgPaintType.SHAPE);
      expect(reorderedShapes).toHaveLength(2);

      unmount();
    });
  });

  describe("Complex scenarios", () => {
    it("handles mixed additions, removals, and updates", async () => {
      const { getAllByType, rerender, unmount } = await render(
        <>
          <Rect x={0} y={0} width={50} height={50} />
          <Circle radius={25} />
          <Rect x={100} y={100} width={50} height={50} />
        </>
      );

      const originalShapes = getAllByType(TvgPaintType.SHAPE);
      expect(originalShapes).toHaveLength(3);
      const firstRectHandle = originalShapes[0].handle;

      // Remove middle element, update first, add new at end
      await rerender(
        <>
          <Rect x={10} y={10} width={50} height={50} />
          <Rect x={100} y={100} width={50} height={50} />
          <Circle radius={30} />
        </>
      );

      const newShapes = getAllByType(TvgPaintType.SHAPE);
      expect(newShapes).toHaveLength(3);

      // First rect should be updated but same instance
      expect(newShapes[0].handle).toBe(firstRectHandle);

      unmount();
    });
  });
});
