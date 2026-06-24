import { useEffect, useState } from "react";
import type { KonvaEventObject } from "konva/lib/Node";
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
  }, [backgroundImage?.src]);

  if (!backgroundImage) {
    return null;
  }

  const image = backgroundImage;

  const widthPx = metersToPixels(image.width);
  const heightPx = metersToPixels(image.height);

  const centerX = metersToPixels(image.x + image.width / 2);
  const centerY = metersToPixels(image.y + image.height / 2);

  const isDraggable = isInteractive && !image.locked;

  function handleDragMove(event: KonvaEventObject<DragEvent>) {
    if (!snapToGrid) return;

    const nextTopLeftX = event.target.x() - widthPx / 2;
    const nextTopLeftY = event.target.y() - heightPx / 2;

    event.target.x(snapPixels(nextTopLeftX) + widthPx / 2);
    event.target.y(snapPixels(nextTopLeftY) + heightPx / 2);
  }

  function handleDragEnd(event: KonvaEventObject<DragEvent>) {
    const nextTopLeftX = pixelsToMeters(event.target.x() - widthPx / 2);
    const nextTopLeftY = pixelsToMeters(event.target.y() - heightPx / 2);

    onUpdateBackgroundImage({
      ...image,
      x: snapToGrid ? snapMeters(nextTopLeftX) : nextTopLeftX,
      y: snapToGrid ? snapMeters(nextTopLeftY) : nextTopLeftY,
    });
  }

  return (
    <Layer listening={isInteractive && !image.locked}>
      {imageElement ? (
        <KonvaImage
          image={imageElement}
          x={centerX}
          y={centerY}
          width={widthPx}
          height={heightPx}
          offsetX={widthPx / 2}
          offsetY={heightPx / 2}
          rotation={image.rotation}
          opacity={image.opacity}
          draggable={isDraggable}
          onDragMove={handleDragMove}
          onDragEnd={handleDragEnd}
        />
      ) : (
        <Rect
          x={centerX}
          y={centerY}
          width={widthPx}
          height={heightPx}
          offsetX={widthPx / 2}
          offsetY={heightPx / 2}
          rotation={image.rotation}
          fill="#eee"
          stroke="#999"
          draggable={isDraggable}
          onDragMove={handleDragMove}
          onDragEnd={handleDragEnd}
        />
      )}

      {showEditorDecorations && !image.locked && (
        <Rect
          x={centerX}
          y={centerY}
          width={widthPx}
          height={heightPx}
          offsetX={widthPx / 2}
          offsetY={heightPx / 2}
          rotation={image.rotation}
          stroke="#0097a7"
          strokeWidth={2}
          dash={[10, 6]}
          listening={false}
        />
      )}
    </Layer>
  );
}
