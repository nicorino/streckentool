import { useEffect, useRef } from "react";
import Konva from "konva";
import { Circle, Group, Layer, Line, Rect, Text, Transformer } from "react-konva";
import type { FigureInstance, FigureTemplate } from "../types/Figure";
import type { Selection } from "../types/Selection";
import {
  getFigureLocalBounds,
  getResolvedFigureElements,
} from "../figures/figureConfig";
import {
  metersToPixels,
  pixelsToMeters,
  snapMeters,
  snapPixels,
} from "../utils/snap";

type FigureLayerProps = {
  figures: FigureInstance[];
  templates: FigureTemplate[];
  selection: Selection | null;
  figureWarningIds: string[];
  onSelect: (selection: Selection | null) => void;
  onUpdateFigure: (figure: FigureInstance) => void;
  snapToGrid: boolean;
  showHelperLines: boolean;
  showEditorDecorations: boolean;
};

export function FigureLayer({
  figures,
  templates,
  selection,
  figureWarningIds,
  onSelect,
  onUpdateFigure,
  snapToGrid,
  showHelperLines,
  showEditorDecorations,
}: FigureLayerProps) {
  return (
    <Layer>
      {figures.map((figure) => {
        const template = templates.find(
          (candidate) => candidate.id === figure.templateId
        );

        if (!template) {
          return null;
        }

        const isSelected =
          selection?.type === "figure" && selection.id === figure.id;

        const hasWarning =
          showEditorDecorations && figureWarningIds.includes(figure.id);

        return (
          <FigureNode
            key={figure.id}
            figure={figure}
            template={template}
            isSelected={isSelected}
            hasWarning={hasWarning}
            onSelect={() => onSelect({ type: "figure", id: figure.id })}
            onUpdateFigure={onUpdateFigure}
            snapToGrid={snapToGrid}
            showHelperLines={showHelperLines}
            showEditorDecorations={showEditorDecorations}
          />
        );
      })}
    </Layer>
  );
}

type FigureNodeProps = {
  figure: FigureInstance;
  template: FigureTemplate;
  isSelected: boolean;
  hasWarning: boolean;
  onSelect: () => void;
  onUpdateFigure: (figure: FigureInstance) => void;
  snapToGrid: boolean;
  showHelperLines: boolean;
  showEditorDecorations: boolean;
};

function FigureNode({
  figure,
  template,
  isSelected,
  hasWarning,
  onSelect,
  onUpdateFigure,
  snapToGrid,
  showHelperLines,
  showEditorDecorations,
}: FigureNodeProps) {
  const groupRef = useRef<Konva.Group>(null);
  const transformerRef = useRef<Konva.Transformer>(null);

  useEffect(() => {
    if (!showEditorDecorations) return;
    if (!isSelected) return;
    if (!groupRef.current) return;
    if (!transformerRef.current) return;

    transformerRef.current.nodes([groupRef.current]);
    transformerRef.current.getLayer()?.batchDraw();
  }, [
    isSelected,
    showEditorDecorations,
    figure.x,
    figure.y,
    figure.rotation,
    figure.mirrored,
  ]);

  const bounds = getFigureLocalBounds(template, figure);
  const resolvedElements = getResolvedFigureElements(template, figure);
  const hitboxPaddingMeters = 0.6;

  const hitboxBounds = {
    left: bounds.left - hitboxPaddingMeters,
    top: bounds.top - hitboxPaddingMeters,
    right: bounds.right + hitboxPaddingMeters,
    bottom: bounds.bottom + hitboxPaddingMeters,
  };

  return (
    <>
      <Group
        ref={groupRef}
        x={metersToPixels(figure.x)}
        y={metersToPixels(figure.y)}
        rotation={figure.rotation}
        scaleX={figure.mirrored ? -1 : 1}
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

          onUpdateFigure({
            ...figure,
            x: snapToGrid ? snapMeters(nextX) : nextX,
            y: snapToGrid ? snapMeters(nextY) : nextY,
          });
        }}
        onTransformEnd={() => {
          const node = groupRef.current;
          if (!node) return;

          const nextX = pixelsToMeters(node.x());
          const nextY = pixelsToMeters(node.y());

          onUpdateFigure({
            ...figure,
            x: snapToGrid ? snapMeters(nextX) : nextX,
            y: snapToGrid ? snapMeters(nextY) : nextY,
            rotation: normalizeRotation(node.rotation()),
          });
        }}
      >
        <Rect
          x={metersToPixels(hitboxBounds.left)}
          y={metersToPixels(hitboxBounds.top)}
          width={metersToPixels(hitboxBounds.right - hitboxBounds.left)}
          height={metersToPixels(hitboxBounds.bottom - hitboxBounds.top)}
          fill="rgba(0,0,0,0.001)"
          strokeWidth={0}
        />

        {showEditorDecorations && isSelected && (
          <Rect
            x={metersToPixels(bounds.left)}
            y={metersToPixels(bounds.top)}
            width={metersToPixels(bounds.right - bounds.left)}
            height={metersToPixels(bounds.bottom - bounds.top)}
            stroke="#1976d2"
            strokeWidth={2}
            dash={[6, 4]}
          />
        )}

        {showEditorDecorations && hasWarning && (
          <Rect
            x={metersToPixels(bounds.left)}
            y={metersToPixels(bounds.top)}
            width={metersToPixels(bounds.right - bounds.left)}
            height={metersToPixels(bounds.bottom - bounds.top)}
            stroke="#d32f2f"
            strokeWidth={2}
            dash={[8, 4]}
          />
        )}

        {resolvedElements.map((element, index) => {
          if (element.type === "cone") {
            if (
            element.orientation === "left" ||
            element.orientation === "right" ||
            element.orientation === "up" ||
            element.orientation === "down"
          ) {
            return (
              <Line
                key={index}
                points={getSidewaysConePoints(
                  element.x,
                  element.y,
                  element.radius,
                  element.orientation
                )}
                closed
                fill={figure.coneColor}
                stroke="#111827"
                strokeWidth={1.8}
                listening={false}
              />
            );
          }

          return (
              <Circle
                key={index}
                x={metersToPixels(element.x)}
                y={metersToPixels(element.y)}
                radius={metersToPixels(element.radius)}
                fill={figure.coneColor}
                stroke={hasWarning ? "#d32f2f" : "#222"}
                strokeWidth={hasWarning ? 2.5 : 1.5}
              />
            );
          }

          if (!showHelperLines) {
            return null;
          }

          return (
            <Line
              key={index}
              points={[
                metersToPixels(element.x1),
                metersToPixels(element.y1),
                metersToPixels(element.x2),
                metersToPixels(element.y2),
              ]}
              stroke={hasWarning ? "#d32f2f" : "#222"}
              strokeWidth={1}
              dash={[4, 4]}
            />
          );
        })}

        {showEditorDecorations && isSelected && (
          <Text
            x={metersToPixels(bounds.left)}
            y={metersToPixels(bounds.bottom + 0.4)}
            text={template.name}
            fontSize={12}
            fill="#1976d2"
          />
        )}

        {showEditorDecorations && hasWarning && (
          <Text
            x={metersToPixels(bounds.left)}
            y={metersToPixels(bounds.bottom + 1.1)}
            text="Outside course"
            fontSize={12}
            fill="#d32f2f"
          />
        )}
      </Group>

      {showEditorDecorations && isSelected && (
        <Transformer
          ref={transformerRef}
          rotateEnabled
          resizeEnabled={false}
          enabledAnchors={[]}
          borderStroke="#1976d2"
          anchorStroke="#1976d2"
          anchorFill="#ffffff"
          rotateAnchorOffset={28}
        />
      )}
    </>
  );
}

function normalizeRotation(rotation: number) {
  const normalized = rotation % 360;

  if (normalized > 180) {
    return normalized - 360;
  }

  if (normalized < -180) {
    return normalized + 360;
  }

  return normalized;
}

function getSidewaysConePoints(
  x: number,
  y: number,
  radius: number,
  orientation: "left" | "right" | "up" | "down"
) {
  const effectiveRadius = radius * 0.82;

  if (orientation === "up" || orientation === "down") {
    const direction = orientation === "down" ? 1 : -1;
    const tipX = metersToPixels(x);
    const tipY = metersToPixels(y + direction * effectiveRadius * 1.15);
    const leftX = metersToPixels(x - effectiveRadius * 0.78);
    const rightX = metersToPixels(x + effectiveRadius * 0.78);
    const baseY = metersToPixels(y - direction * effectiveRadius * 0.95);

    return [tipX, tipY, leftX, baseY, rightX, baseY];
  }

  const direction = orientation === "right" ? 1 : -1;
  const tipX = metersToPixels(x + direction * effectiveRadius * 1.15);
  const centerY = metersToPixels(y);
  const baseX = metersToPixels(x - direction * effectiveRadius * 0.95);
  const topY = metersToPixels(y - effectiveRadius * 0.78);
  const bottomY = metersToPixels(y + effectiveRadius * 0.78);

  return [tipX, centerY, baseX, topY, baseX, bottomY];
}

