"use client";

import { type ReactNode } from "react";
import { DynamicCodeBlock } from "fumadocs-ui/components/dynamic-codeblock";

interface ExampleLayoutProps {
  code: string;
  children: ReactNode;
}

export function ExampleLayout({ code, children }: ExampleLayoutProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 my-6 overflow-hidden rounded-lg border">
      <div className="flex">
        <DynamicCodeBlock lang="tsx" code={code} />
      </div>
      <div className="flex items-center justify-center p-8 bg-fd-muted/50">
        {children}
      </div>
    </div>
  );
}
