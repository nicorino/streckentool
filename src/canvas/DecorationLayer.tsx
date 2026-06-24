import { useEffect, useState } from "react";
import { Group, Image as KonvaImage, Layer, Rect, Text } from "react-konva";
import type { Decoration } from "../types/Decoration";
import type { Selection } from "../types/Selection";
import {
  metersToPixels,
  pixelsToMeters,
  snapMeters,
  snapPixels,
} from "../utils/snap";

type DecorationLayerProps = {
  decorations: Decoration[];
  selection: Selection | null;
  onSelect: (selection: Selection | null) => void;
  onUpdateDecoration: (decoration: Decoration) => void;
  snapToGrid: boolean;
  showEditorDecorations: boolean;
};

export function DecorationLayer({
  decorations,
  selection,
  onSelect,
  onUpdateDecoration,
  snapToGrid,
  showEditorDecorations,
}: DecorationLayerProps) {
  return (
    <Layer>
      {decorations.map((decoration) => {
        if (decoration.type === "text") {
          const isSelected =
            selection?.type === "decoration" && selection.id === decoration.id;

          return (
            <Group
              key={decoration.id}
              x={metersToPixels(decoration.x)}
              y={metersToPixels(decoration.y)}
              rotation={decoration.rotation}
              draggable
              onClick={(event) => {
                event.cancelBubble = true;
                onSelect({ type: "decoration", id: decoration.id });
              }}
              onTap={(event) => {
                event.cancelBubble = true;
                onSelect({ type: "decoration", id: decoration.id });
              }}
              onDragMove={(event) => {
                if (!snapToGrid) return;

                event.target.x(snapPixels(event.target.x()));
                event.target.y(snapPixels(event.target.y()));
              }}
              onDragEnd={(event) => {
                const nextX = pixelsToMeters(event.target.x());
                const nextY = pixelsToMeters(event.target.y());

                onUpdateDecoration({
                  ...decoration,
                  x: snapToGrid ? snapMeters(nextX) : nextX,
                  y: snapToGrid ? snapMeters(nextY) : nextY,
                });
              }}
            >
              <Rect
                x={0}
                y={0}
                width={metersToPixels(decoration.width)}
                height={metersToPixels(decoration.height)}
                fill="rgba(255,255,255,0.01)"
              />

              <Text
                x={0}
                y={0}
                width={metersToPixels(decoration.width)}
                height={metersToPixels(decoration.height)}
                text={decoration.text}
                fontSize={decoration.fontSize}
                fill={decoration.color}
                verticalAlign="middle"
              />

              {showEditorDecorations && isSelected && (
                <Rect
                  x={0}
                  y={0}
                  width={metersToPixels(decoration.width)}
                  height={metersToPixels(decoration.height)}
                  stroke="#1976d2"
                  strokeWidth={2}
                  dash={[6, 4]}
                />
              )}
            </Group>
          );
        }

        return (
          <ImageDecorationNode
            key={decoration.id}
            decoration={decoration}
            isSelected={
              selection?.type === "decoration" && selection.id === decoration.id
            }
            onSelect={() =>
              onSelect({ type: "decoration", id: decoration.id })
            }
            onUpdateDecoration={onUpdateDecoration}
            snapToGrid={snapToGrid}
            showEditorDecorations={showEditorDecorations}
          />
        );
      })}
    </Layer>
  );
}

type ImageDecoration = Extract<Decoration, { type: "image" }>;

type ImageDecorationNodeProps = {
  decoration: ImageDecoration;
  isSelected: boolean;
  onSelect: () => void;
  onUpdateDecoration: (decoration: Decoration) => void;
  snapToGrid: boolean;
  showEditorDecorations: boolean;
};

function ImageDecorationNode({
  decoration,
  isSelected,
  onSelect,
  onUpdateDecoration,
  snapToGrid,
  showEditorDecorations,
}: ImageDecorationNodeProps) {
  const [imageElement, setImageElement] = useState<HTMLImageElement | null>(
    null
  );

  useEffect(() => {
    const image = new window.Image();

    image.onload = () => {
      setImageElement(image);
    };

    image.src = decoration.src;

    return () => {
      image.onload = null;
    };
  }, [decoration.src]);

  return (
    <Group
      x={metersToPixels(decoration.x)}
      y={metersToPixels(decoration.y)}
      rotation={decoration.rotation}
      draggable
      onClick={(event) => {
        event.cancelBubble = true;
        onSelect();
      }}
      onTap={(event) => {
        event.cancelBubble = true;
        onSelect();
      }}
      onDragMove={(event) => {
        if (!snapToGrid) return;

        event.target.x(snapPixels(event.target.x()));
        event.target.y(snapPixels(event.target.y()));
      }}
      onDragEnd={(event) => {
        const nextX = pixelsToMeters(event.target.x());
        const nextY = pixelsToMeters(event.target.y());

        onUpdateDecoration({
          ...decoration,
          x: snapToGrid ? snapMeters(nextX) : nextX,
          y: snapToGrid ? snapMeters(nextY) : nextY,
        });
      }}
    >
      {imageElement ? (
        <KonvaImage
          image={imageElement}
          x={0}
          y={0}
          width={metersToPixels(decoration.width)}
          height={metersToPixels(decoration.height)}
        />
      ) : (
        <Rect
          x={0}
          y={0}
          width={metersToPixels(decoration.width)}
          height={metersToPixels(decoration.height)}
          fill="#eee"
          stroke="#999"
        />
      )}

      {showEditorDecorations && isSelected && (
        <Rect
          x={0}
          y={0}
          width={metersToPixels(decoration.width)}
          height={metersToPixels(decoration.height)}
          stroke="#1976d2"
          strokeWidth={2}
          dash={[6, 4]}
        />
      )}
    </Group>
  );
}