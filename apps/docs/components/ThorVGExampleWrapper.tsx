'use client';

import dynamic from 'next/dynamic';

const ThorVGExample = dynamic(
  () => import('./ThorVGExample').then((mod) => ({ default: mod.ThorVGExample })),
  { ssr: false }
);

export function ThorVGExampleWrapper() {
  return <ThorVGExample />;
}
