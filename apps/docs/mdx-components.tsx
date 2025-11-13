import defaultMdxComponents from "fumadocs-ui/mdx";
import { TypeTable } from "fumadocs-ui/components/type-table";
import { createTypeTable } from "fumadocs-typescript/ui";
import type { MDXComponents } from "mdx/types";

const { AutoTypeTable } = createTypeTable();

export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
    TypeTable,
    AutoTypeTable,
    ...components,
  };
}
