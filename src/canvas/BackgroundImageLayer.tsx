import { useEffect, useState } from "react";
import { Image as KonvaImage, Layer, Rect } from "react-konva";
import type { CourseBackgroundImage } from "../types/CourseBackgroundImage";
import {
  metersToPixels,
  pixelsToMeters,
  snapMeters,
  snapPixels,
} from "../utils/snap";

type BackgroundImageLayerProps = {
  backgroundImage: CourseBackgroundImage | null;
  onUpdateBackgroundImage: (backgroundImage: CourseBackgroundImage) => void;
  showEditorDecorations: boolean;
  isInteractive: boolean;
  snapToGrid: boolean;
};

export function BackgroundImageLayer({
  backgroundImage,
  onUpdateBackgroundImage,
  showEditorDecorations,
  isInteractive,
  snapToGrid,
}: BackgroundImageLayerProps) {
  const [imageElement, setImageElement] = useState<HTMLImageElement | null>(
    null
  );

  useEffect(() => {
    if (!backgroundImage) {
      setImageElement(null);
      return;
    }

    const image = new window.Image();

    image.onload = () => {
      setImageElement(image);
    };

    image.src = backgroundImage.src;

    return () => {
      image.onload = null;
    };
  }, [backgroundImage]);

  if (!backgroundImage) {
    return null;
  }

  const isDraggable = isInteractive && !backgroundImage.locked;

  return (
    <Layer listening={isInteractive && !backgroundImage.locked}>
      {imageElement ? (
        <KonvaImage
          image={imageElement}
          x={metersToPixels(backgroundImage.x)}
          y={metersToPixels(backgroundImage.y)}
          width={metersToPixels(backgroundImage.width)}
          height={metersToPixels(backgroundImage.height)}
          opacity={backgroundImage.opacity}
          draggable={isDraggable}
          onDragMove={(event) => {
            if (!snapToGrid) return;

            event.target.x(snapPixels(event.target.x()));
            event.target.y(snapPixels(event.target.y()));
          }}
          onDragEnd={(event) => {
            const nextX = pixelsToMeters(event.target.x());
            const nextY = pixelsToMeters(event.target.y());

            onUpdateBackgroundImage({
              ...backgroundImage,
              x: snapToGrid ? snapMeters(nextX) : nextX,
              y: snapToGrid ? snapMeters(nextY) : nextY,
            });
          }}
        />
      ) : (
        <Rect
          x={metersToPixels(backgroundImage.x)}
          y={metersToPixels(backgroundImage.y)}
          width={metersToPixels(backgroundImage.width)}
          height={metersToPixels(backgroundImage.height)}
          fill="#eee"
          stroke="#999"
        />
      )}

      {showEditorDecorations && !backgroundImage.locked && (
        <Rect
          x={metersToPixels(backgroundImage.x)}
          y={metersToPixels(backgroundImage.y)}
          width={metersToPixels(backgroundImage.width)}
          height={metersToPixels(backgroundImage.height)}
          stroke="#0097a7"
          strokeWidth={2}
          dash={[10, 6]}
          listening={false}
        />
      )}
    </Layer>
  );
}