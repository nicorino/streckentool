import { useEffect, useState } from "react";
import type { KonvaEventObject } from "konva/lib/Node";
import { Group, Image as KonvaImage, Layer, Rect } from "react-konva";
import type { CourseBackgroundImage } from "../types/CourseBackgroundImage";
import type { CourseRect } from "../types/CourseRect";
import {
  metersToPixels,
  pixelsToMeters,
  snapMeters,
  snapPixels,
} from "../utils/snap";

type BackgroundImageLayerProps = {
  backgroundImage: CourseBackgroundImage | null;
  courseRects: CourseRect[];
  clipToCourseAreas: boolean;
  isSelected: boolean;
  onSelect: () => void;
  onUpdateBackgroundImage: (backgroundImage: CourseBackgroundImage) => void;
  showEditorDecorations: boolean;
  isInteractive: boolean;
  snapToGrid: boolean;
};

export function BackgroundImageLayer({
  backgroundImage,
  courseRects,
  clipToCourseAreas,
  isSelected,
  onSelect,
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

  function handleSelect(event: KonvaEventObject<MouseEvent | TouchEvent>) {
    event.cancelBubble = true;
    onSelect();
  }

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

  const imageNode = imageElement ? (
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
      onClick={handleSelect}
      onTap={handleSelect}
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
      onClick={handleSelect}
      onTap={handleSelect}
      onDragMove={handleDragMove}
      onDragEnd={handleDragEnd}
    />
  );

  return (
    <Layer listening={isInteractive}>
      {clipToCourseAreas && courseRects.length > 0 ? (
        <Group clipFunc={(context) => drawCourseAreaClip(context, courseRects)}>
          {imageNode}
        </Group>
      ) : (
        imageNode
      )}

      {showEditorDecorations && isSelected && (
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

function drawCourseAreaClip(
  context: {
    beginPath?: () => void;
    moveTo: (x: number, y: number) => void;
    lineTo: (x: number, y: number) => void;
    closePath: () => void;
  },
  courseRects: CourseRect[]
) {
  context.beginPath?.();

  for (const rect of courseRects) {
    const centerX = metersToPixels(rect.x + rect.width / 2);
    const centerY = metersToPixels(rect.y + rect.height / 2);
    const halfWidth = metersToPixels(rect.width / 2);
    const halfHeight = metersToPixels(rect.height / 2);
    const rotation = (rect.rotation * Math.PI) / 180;

    const corners = [
      { x: -halfWidth, y: -halfHeight },
      { x: halfWidth, y: -halfHeight },
      { x: halfWidth, y: halfHeight },
      { x: -halfWidth, y: halfHeight },
    ].map((corner) => ({
      x:
        centerX +
        corner.x * Math.cos(rotation) -
        corner.y * Math.sin(rotation),
      y:
        centerY +
        corner.x * Math.sin(rotation) +
        corner.y * Math.cos(rotation),
    }));

    context.moveTo(corners[0].x, corners[0].y);

    for (const corner of corners.slice(1)) {
      context.lineTo(corner.x, corner.y);
    }

    context.closePath();
  }
}
