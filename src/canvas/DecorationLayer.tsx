import { useEffect, useRef, useState } from "react";
import {
  Arrow,
  Group,
  Line,
  Image as KonvaImage,
  Layer,
  Path,
  Rect,
  Text,
  Transformer,
} from "react-konva";
import type { ArrowDecoration, Decoration } from "../types/Decoration";
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
        const isSelected =
          selection?.type === "decoration" && selection.id === decoration.id;

        if (decoration.type === "text") {
          return (
            <MovableDecorationGroup
              key={decoration.id}
              decoration={decoration}
              onSelect={() =>
                onSelect({ type: "decoration", id: decoration.id })
              }
              onUpdateDecoration={onUpdateDecoration}
              snapToGrid={snapToGrid}
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
                <SelectionRect decoration={decoration} />
              )}
            </MovableDecorationGroup>
          );
        }

        if (decoration.type === "image") {
          return (
            <ImageDecorationNode
              key={decoration.id}
              decoration={decoration}
              isSelected={isSelected}
              onSelect={() =>
                onSelect({ type: "decoration", id: decoration.id })
              }
              onUpdateDecoration={onUpdateDecoration}
              snapToGrid={snapToGrid}
              showEditorDecorations={showEditorDecorations}
            />
          );
        }

        return (
          <MovableDecorationGroup
            key={decoration.id}
            decoration={decoration}
            onSelect={() => onSelect({ type: "decoration", id: decoration.id })}
            onUpdateDecoration={onUpdateDecoration}
            snapToGrid={snapToGrid}
          >
            <Rect
              x={0}
              y={0}
              width={metersToPixels(decoration.width)}
              height={metersToPixels(decoration.height)}
              fill="rgba(255,255,255,0.01)"
            />

            <ArrowShape decoration={decoration} />

            {showEditorDecorations && isSelected && (
              <SelectionRect decoration={decoration} />
            )}
          </MovableDecorationGroup>
        );
      })}
    </Layer>
  );
}

type MovableDecorationGroupProps = {
  decoration: Decoration;
  children: React.ReactNode;
  onSelect: () => void;
  onUpdateDecoration: (decoration: Decoration) => void;
  snapToGrid: boolean;
};

function MovableDecorationGroup({
  decoration,
  children,
  onSelect,
  onUpdateDecoration,
  snapToGrid,
}: MovableDecorationGroupProps) {
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
      {children}
    </Group>
  );
}

function ArrowShape({ decoration }: { decoration: ArrowDecoration }) {
  const width = metersToPixels(decoration.width);
  const height = metersToPixels(decoration.height);
  const strokeWidth = 4;
  const color = decoration.color;

  if (decoration.arrowKind === "curve-right") {
    const startX = width * 0.18;
    const startY = height * 0.92;
    const control1X = width * 0.12;
    const control1Y = height * 0.55;
    const control2X = width * 0.42;
    const control2Y = height * 0.22;
    const endX = width * 0.88;
    const endY = height * 0.22;

    const arrowLength = 20;
    const arrowHalfHeight = 10;

    return (
      <>
        <Path
          data={`M ${startX} ${startY} C ${control1X} ${control1Y}, ${control2X} ${control2Y}, ${endX} ${endY}`}
          stroke={color}
          strokeWidth={strokeWidth}
          lineCap="round"
          lineJoin="round"
        />

        <Line
          points={[
            endX,
            endY,
            endX - arrowLength,
            endY - arrowHalfHeight,
            endX - arrowLength * 0.72,
            endY,
            endX - arrowLength,
            endY + arrowHalfHeight,
          ]}
          closed
          fill={color}
          stroke={color}
          strokeWidth={1}
          lineJoin="round"
        />
      </>
    );
  }

  if (decoration.arrowKind === "curve-left") {
    const startX = width * 0.82;
    const startY = height * 0.92;
    const control1X = width * 0.88;
    const control1Y = height * 0.55;
    const control2X = width * 0.58;
    const control2Y = height * 0.22;
    const endX = width * 0.12;
    const endY = height * 0.22;

    const arrowLength = 20;
    const arrowHalfHeight = 10;

    return (
      <>
        <Path
          data={`M ${startX} ${startY} C ${control1X} ${control1Y}, ${control2X} ${control2Y}, ${endX} ${endY}`}
          stroke={color}
          strokeWidth={strokeWidth}
          lineCap="round"
          lineJoin="round"
        />

        <Line
          points={[
            endX,
            endY,
            endX + arrowLength,
            endY - arrowHalfHeight,
            endX + arrowLength * 0.72,
            endY,
            endX + arrowLength,
            endY + arrowHalfHeight,
          ]}
          closed
          fill={color}
          stroke={color}
          strokeWidth={1}
          lineJoin="round"
        />
      </>
    );
  }

  if (decoration.arrowKind === "straight-long") {
    return (
      <Arrow
        points={[0, height / 2, width, height / 2]}
        stroke={color}
        fill={color}
        strokeWidth={strokeWidth}
        pointerLength={16}
        pointerWidth={16}
        lineCap="round"
        lineJoin="round"
      />
    );
  }

  return (
    <Arrow
      points={[0, height / 2, width, height / 2]}
      stroke={color}
      fill={color}
      strokeWidth={strokeWidth}
      pointerLength={14}
      pointerWidth={14}
      lineCap="round"
      lineJoin="round"
    />
  );
}

function SelectionRect({ decoration }: { decoration: Decoration }) {
  return (
    <Rect
      x={0}
      y={0}
      width={metersToPixels(decoration.width)}
      height={metersToPixels(decoration.height)}
      stroke="#1976d2"
      strokeWidth={2}
      dash={[6, 4]}
    />
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

  const groupRef = useRef<any>(null);
  const transformerRef = useRef<any>(null);

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

  useEffect(() => {
    if (!isSelected || !transformerRef.current || !groupRef.current) {
      return;
    }

    transformerRef.current.nodes([groupRef.current]);
    transformerRef.current.getLayer()?.batchDraw();
  }, [isSelected, decoration.width, decoration.height, decoration.rotation]);

  return (
    <>
      <Group
        ref={groupRef}
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
        onTransformEnd={(event) => {
          const node = event.target;

          const scaleX = node.scaleX();
          const scaleY = node.scaleY();
          const scale = Math.max(Math.abs(scaleX), Math.abs(scaleY), 0.01);

          const nextX = pixelsToMeters(node.x());
          const nextY = pixelsToMeters(node.y());

          node.scaleX(1);
          node.scaleY(1);

          onUpdateDecoration({
            ...decoration,
            x: snapToGrid ? snapMeters(nextX) : nextX,
            y: snapToGrid ? snapMeters(nextY) : nextY,
            width: Math.max(0.2, decoration.width * scale),
            height: Math.max(0.2, decoration.height * scale),
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
          <SelectionRect decoration={decoration} />
        )}
      </Group>

      {showEditorDecorations && isSelected && (
        <Transformer
          ref={transformerRef}
          rotateEnabled={false}
          keepRatio={true}
          flipEnabled={false}
          enabledAnchors={[
            "top-left",
            "top-right",
            "bottom-left",
            "bottom-right",
          ]}
          boundBoxFunc={(oldBox, newBox) => {
            if (newBox.width < 10 || newBox.height < 10) {
              return oldBox;
            }

            return newBox;
          }}
        />
      )}
    </>
  );
}
