import { createElement, FC, PropsWithChildren } from "react";
import { GroupProps } from "../types";

export const Group: FC<PropsWithChildren<GroupProps>> = (props) =>
  createElement("group", props);
