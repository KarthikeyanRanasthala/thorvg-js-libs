import { createElement, FC } from "react";
import { CircleProps } from "../types";

export const Circle: FC<CircleProps> = (props) =>
  createElement("circle", props as Partial<CircleProps>);
