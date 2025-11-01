import { createElement, FC } from "react";
import { RectProps } from "../types";

export const Rect: FC<RectProps> = (props) => createElement("rect", props);
