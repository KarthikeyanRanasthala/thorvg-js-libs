"use client";

import { Shape, Path, PathCommand, StrokeCap } from "react-thorvg-fiber";
import { ExampleLayout } from "./ExampleLayout";
import { SwCanvasWithLocateFile } from "./SwCanvasWithLocateFile";

const code = `<SwCanvas width={200} height={200} devicePixelRatio={2}>
  {/* Butt - ends exactly at line endpoints */}
  <Shape stroke={[234, 88, 12, 255]} strokeWidth={30} strokeCap={StrokeCap.Butt}>
    <Path commands={[PathCommand.MoveTo, PathCommand.LineTo]} points={[{x: 100, y: 100}, {x: 300, y: 100}]} />
  </Shape>
  {/* Round - rounded ends extending beyond endpoints */}
  <Shape stroke={[59, 130, 246, 255]} strokeWidth={30} strokeCap={StrokeCap.Round}>
    <Path commands={[PathCommand.MoveTo, PathCommand.LineTo]} points={[{x: 100, y: 200}, {x: 300, y: 200}]} />
  </Shape>
  {/* Square - square ends extending beyond endpoints */}
  <Shape stroke={[34, 197, 94, 255]} strokeWidth={30} strokeCap={StrokeCap.Square}>
    <Path commands={[PathCommand.MoveTo, PathCommand.LineTo]} points={[{x: 100, y: 300}, {x: 300, y: 300}]} />
  </Shape>
  {/* Reference markers at line endpoints */}
  <Shape stroke={[150, 150, 150, 255]} strokeWidth={4}>
    <Path commands={[PathCommand.MoveTo, PathCommand.LineTo]} points={[{x: 100, y: 60}, {x: 100, y: 340}]} />
  </Shape>
  <Shape stroke={[150, 150, 150, 255]} strokeWidth={4}>
    <Path commands={[PathCommand.MoveTo, PathCommand.LineTo]} points={[{x: 300, y: 60}, {x: 300, y: 340}]} />
  </Shape>
</SwCanvas>`;

export function StrokeCapExample() {
  return (
    <ExampleLayout code={code}>
      <SwCanvasWithLocateFile width={200} height={200} devicePixelRatio={2}>
        {/* Butt - ends exactly at line endpoints */}
        <Shape stroke={[234, 88, 12, 255]} strokeWidth={30} strokeCap={StrokeCap.Butt}>
          <Path commands={[PathCommand.MoveTo, PathCommand.LineTo]} points={[{x: 100, y: 100}, {x: 300, y: 100}]} />
        </Shape>
        {/* Round - rounded ends extending beyond endpoints */}
        <Shape stroke={[59, 130, 246, 255]} strokeWidth={30} strokeCap={StrokeCap.Round}>
          <Path commands={[PathCommand.MoveTo, PathCommand.LineTo]} points={[{x: 100, y: 200}, {x: 300, y: 200}]} />
        </Shape>
        {/* Square - square ends extending beyond endpoints */}
        <Shape stroke={[34, 197, 94, 255]} strokeWidth={30} strokeCap={StrokeCap.Square}>
          <Path commands={[PathCommand.MoveTo, PathCommand.LineTo]} points={[{x: 100, y: 300}, {x: 300, y: 300}]} />
        </Shape>
        {/* Reference markers at line endpoints */}
        <Shape stroke={[150, 150, 150, 255]} strokeWidth={4}>
          <Path commands={[PathCommand.MoveTo, PathCommand.LineTo]} points={[{x: 100, y: 60}, {x: 100, y: 340}]} />
        </Shape>
        <Shape stroke={[150, 150, 150, 255]} strokeWidth={4}>
          <Path commands={[PathCommand.MoveTo, PathCommand.LineTo]} points={[{x: 300, y: 60}, {x: 300, y: 340}]} />
        </Shape>
      </SwCanvasWithLocateFile>
    </ExampleLayout>
  );
}
