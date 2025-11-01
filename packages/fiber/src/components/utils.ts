import { type SwCanvas as ThorVGSwCanvas } from "bindings";

export const flushSwCanvasToHtmlCanvas = (
  swCanvas: ThorVGSwCanvas | null,
  htmlCanvas: HTMLCanvasElement | null
): void => {
  if (!htmlCanvas || !swCanvas) return;

  const pixelBuffer = new Uint8ClampedArray(
    swCanvas.module.HEAPU8.buffer,
    swCanvas.bufferPtr,
    swCanvas.bufferSize
  );
  const imageData = new ImageData(
    pixelBuffer,
    htmlCanvas.width,
    htmlCanvas.height
  );
  htmlCanvas.getContext("2d")?.putImageData(imageData, 0, 0);
};

export const setupCanvasElement = (
  canvasElement: HTMLCanvasElement | null,
  width: number,
  height: number,
  devicePixelRatio?: number
): { scaledWidth: number; scaledHeight: number } => {
  if (!canvasElement) {
    throw new Error("Canvas element not found");
  }

  const dpr = devicePixelRatio ?? 1;
  const scaledWidth = Math.floor(width * dpr);
  const scaledHeight = Math.floor(height * dpr);

  canvasElement.width = scaledWidth;
  canvasElement.height = scaledHeight;
  canvasElement.style.width = `${width}px`;
  canvasElement.style.height = `${height}px`;

  return { scaledWidth, scaledHeight };
};
