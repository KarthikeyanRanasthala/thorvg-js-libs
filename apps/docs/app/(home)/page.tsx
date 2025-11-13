import Link from "next/link";
import { RotatingRectangles } from "@/components/RotatingRectangles";

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
          className="inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground px-6 py-3 text-sm font-medium hover:bg-primary/90 transition-colors"
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
