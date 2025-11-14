import Link from "next/link";
import { RotatingRectangles } from "@/components/RotatingRectangles";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/cn";

export default function HomePage() {
  return (
    <div className="flex flex-col justify-center flex-1 max-w-4xl mx-auto px-4">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-6">React ThorVG Fiber</h1>
        <p className="text-lg text-muted-foreground mb-8">
          A React renderer for ThorVG, enabling declarative 2D vector graphics
          with high performance rendering.
        </p>
        <Link
          href="/docs"
          className={cn(
            buttonVariants({
              color: "primary",
              className: "px-6 py-3",
            })
          )}
        >
          View Documentation
        </Link>
      </div>
      <div className="mt-12">
        <RotatingRectangles />
      </div>
    </div>
  );
}
