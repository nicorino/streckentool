import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import Konva from "konva";
import { Stage, Layer, Rect, Transformer, Text } from "react-konva";
import type { CourseRect } from "../types/CourseRect";
import type { FigureInstance, FigureTemplate } from "../types/Figure";
import type { Decoration } from "../types/Decoration";
import type { Measurement } from "../types/Measurement";
import type { CourseBackgroundImage } from "../types/CourseBackgroundImage";
import type { ProjectMetadata } from "../types/ProjectMetadata";
import type { Selection } from "../types/Selection";
import type { ProjectBoundsMeters } from "../export/getProjectBounds";
import type { EditorTool } from "../components/TopToolbar";
import {
  metersToPixels,
  pixelsToMeters,
  snapMeters,
  MIN_RECT_SIZE_METERS,
  PIXELS_PER_METER,
  WORLD_SIZE_METERS,
} from "../utils/snap";
import { GridLayer } from "./GridLayer";
import { CourseBoundaryLayer } from "./CourseBoundaryLayer";
import { FigureLayer } from "./FigureLayer";
import { DecorationLayer } from "./DecorationLayer";
import { MeasurementLayer } from "./MeasurementLayer";
import { CalibrationLayer } from "./CalibrationLayer";
import { BackgroundImageLayer } from "./BackgroundImageLayer";
import { ExportFrameLayer } from "./ExportFrameLayer";
import { TitleBlockLayer } from "./TitleBlockLayer";

export type EditorCanvasHandle = {
  exportPng: (options: ExportPngOptions) => Promise<void>;
};

type ExportPngOptions = {
  fileName: string;
  boundsMeters: ProjectBoundsMeters;
  pixelRatio?: number;
};

type ViewPosition = {
  x: number;
  y: number;
};

type CanvasPoint = {
  x: number;
  y: number;
};

type EditorCanvasProps = {
  rects: CourseRect[];
  figures: FigureInstance[];
  decorations: Decoration[];
  measurements: Measurement[];
  backgroundImage: CourseBackgroundImage | null;
  metadata: ProjectMetadata;
  pendingMeasurementStart: CanvasPoint | null;
  pendingCalibrationStart: CanvasPoint | null;
  activeTool: EditorTool;
  figureTemplates: FigureTemplate[];
  selection: Selection | null;
  disconnectedRectIds: string[];
  figureWarningIds: string[];
  onSelect: (selection: Selection | null) => void;
  onCanvasPointClick: (point: CanvasPoint) => void;
  onChangeRects: (rects: CourseRect[]) => void;
  onUpdateFigure: (figure: FigureInstance) => void;
  onUpdateDecoration: (decoration: Decoration) => void;
  onUpdateBackgroundImage: (backgroundImage: CourseBackgroundImage) => void;
  snapToGrid: boolean;
  showGrid: boolean;
  showCourseFill: boolean;
  showHelperLines: boolean;
  showEditorDecorations: boolean;
  exportBoundsMeters: ProjectBoundsMeters;
  exportFrameLabel: string;
  zoom: number;
  viewPosition: ViewPosition;
  onChangeZoom: (zoom: number) => void;
  onChangeViewPosition: (position: ViewPosition) => void;
};

const MIN_ZOOM = 0.25;
const MAX_ZOOM = 4;

export const EditorCanvas = forwardRef<EditorCanvasHandle, EditorCanvasProps>(
  function EditorCanvas(
    {
      rects,
      figures,
      decorations,
      measurements,
      backgroundImage,
      metadata,
      pendingMeasurementStart,
      pendingCalibrationStart,
      activeTool,
      figureTemplates,
      selection,
      disconnectedRectIds,
      figureWarningIds,
      onSelect,
      onCanvasPointClick,
      onChangeRects,
      onUpdateFigure,
      onUpdateDecoration,
      onUpdateBackgroundImage,
      snapToGrid,
      showGrid,
      showCourseFill,
      showHelperLines,
      showEditorDecorations,
      exportBoundsMeters,
      exportFrameLabel,
      zoom,
      viewPosition,
      onChangeZoom,
      onChangeViewPosition,
    },
    ref
  ) {
    const containerRef = useRef<HTMLDivElement>(null);
    const stageRef = useRef<Konva.Stage>(null);
    const isPanningRef = useRef(false);
    const lastPanPointerRef = useRef<ViewPosition | null>(null);

    const [isExporting, setIsExporting] = useState(false);
    const [activeExportBounds, setActiveExportBounds] =
      useState<ProjectBoundsMeters | null>(null);
    const [isSpacePressed, setIsSpacePressed] = useState(false);

    const [stageSize, setStageSize] = useState({
      width: 800,
      height: 600,
    });

    useEffect(() => {
      function updateSize() {
        const element = containerRef.current;
        if (!element) return;

        const bounds = element.getBoundingClientRect();

        setStageSize({
          width: Math.max(100, bounds.width),
          height: Math.max(100, bounds.height),
        });
      }

      updateSize();

      const element = containerRef.current;
      if (!element) return;

      const resizeObserver = new ResizeObserver(updateSize);
      resizeObserver.observe(element);

      return () => resizeObserver.disconnect();
    }, []);

    useEffect(() => {
      function handleKeyDown(event: KeyboardEvent) {
        if (event.code === "Space") {
          setIsSpacePressed(true);
        }
      }

      function handleKeyUp(event: KeyboardEvent) {
        if (event.code === "Space") {
          setIsSpacePressed(false);
          isPanningRef.current = false;
          lastPanPointerRef.current = null;
        }
      }

      window.addEventListener("keydown", handleKeyDown);
      window.addEventListener("keyup", handleKeyUp);

      return () => {
        window.removeEventListener("keydown", handleKeyDown);
        window.removeEventListener("keyup", handleKeyUp);
      };
    }, []);

    useImperativeHandle(ref, () => ({
      async exportPng({ fileName, boundsMeters, pixelRatio = 3 }) {
        const stage = stageRef.current;
        if (!stage) return;

        setActiveExportBounds(boundsMeters);
        setIsExporting(true);

        await waitForNextFrame();
        await waitForNextFrame();

        try {
          const x = Math.max(0, metersToPixels(boundsMeters.left));
          const y = Math.max(0, metersToPixels(boundsMeters.top));

          const requestedWidth = metersToPixels(
            boundsMeters.right - boundsMeters.left
          );
          const requestedHeight = metersToPixels(
            boundsMeters.bottom - boundsMeters.top
          );

          const width = Math.max(1, Math.min(requestedWidth, stage.width() - x));
          const height = Math.max(
            1,
            Math.min(requestedHeight, stage.height() - y)
          );

          const dataUrl = stage.toDataURL({
            x,
            y,
            width,
            height,
            pixelRatio,
            mimeType: "image/png",
          });

          const link = document.createElement("a");
          link.href = dataUrl;
          link.download = fileName;
          document.body.appendChild(link);
          link.click();
          link.remove();
        } finally {
          setIsExporting(false);
          setActiveExportBounds(null);
        }
      },
    }));

    function updateRect(updatedRect: CourseRect) {
      onChangeRects(
        rects.map((rect) => (rect.id === updatedRect.id ? updatedRect : rect))
      );
    }

    function getWorldPointerPosition(): CanvasPoint | null {
      const stage = stageRef.current;
      const pointer = stage?.getPointerPosition();

      if (!stage || !pointer) {
        return null;
      }

      const x = pixelsToMeters((pointer.x - viewPosition.x) / zoom);
      const y = pixelsToMeters((pointer.y - viewPosition.y) / zoom);

      return {
        x: snapToGrid ? snapMeters(x) : x,
        y: snapToGrid ? snapMeters(y) : y,
      };
    }

    function handleWheel(event: Konva.KonvaEventObject<WheelEvent>) {
      const nativeEvent = event.evt;

      if (!nativeEvent.ctrlKey && !nativeEvent.metaKey) {
        return;
      }

      nativeEvent.preventDefault();

      const stage = stageRef.current;
      const pointer = stage?.getPointerPosition();

      if (!stage || !pointer) return;

      const oldZoom = zoom;
      const zoomFactor = nativeEvent.deltaY < 0 ? 1.1 : 1 / 1.1;
      const nextZoom = clamp(oldZoom * zoomFactor, MIN_ZOOM, MAX_ZOOM);

      const mousePointTo = {
        x: (pointer.x - viewPosition.x) / oldZoom,
        y: (pointer.y - viewPosition.y) / oldZoom,
      };

      const nextPosition = {
        x: pointer.x - mousePointTo.x * nextZoom,
        y: pointer.y - mousePointTo.y * nextZoom,
      };

      onChangeZoom(nextZoom);
      onChangeViewPosition(nextPosition);
    }

    function handleMouseDown(event: Konva.KonvaEventObject<MouseEvent>) {
      if (
        (activeTool === "measure" || activeTool === "calibrate") &&
        event.evt.button === 0
      ) {
        const point = getWorldPointerPosition();

        if (point) {
          onCanvasPointClick(point);
        }

        return;
      }

      const isStageClick = event.target === event.target.getStage();

      const shouldStartPanning =
        event.evt.button === 1 || (isStageClick && isSpacePressed);

      if (shouldStartPanning) {
        event.evt.preventDefault();
        isPanningRef.current = true;
        lastPanPointerRef.current =
          stageRef.current?.getPointerPosition() ?? null;
        return;
      }

      if (isStageClick) {
        onSelect(null);
      }
    }

    function handleMouseMove() {
      if (!isPanningRef.current) return;

      const stage = stageRef.current;
      const pointer = stage?.getPointerPosition();
      const lastPointer = lastPanPointerRef.current;

      if (!stage || !pointer || !lastPointer) return;

      const dx = pointer.x - lastPointer.x;
      const dy = pointer.y - lastPointer.y;

      onChangeViewPosition({
        x: viewPosition.x + dx,
        y: viewPosition.y + dy,
      });

      lastPanPointerRef.current = pointer;
    }

    function stopPanning() {
      isPanningRef.current = false;
      lastPanPointerRef.current = null;
    }

    const effectiveShowGrid = showGrid && !isExporting;
    const effectiveShowCourseFill = showCourseFill && !isExporting;
    const effectiveShowHelperLines = showHelperLines && !isExporting;
    const effectiveShowEditorDecorations =
      showEditorDecorations && !isExporting;

    const effectiveZoom = isExporting ? 1 : zoom;
    const effectiveViewPosition = isExporting ? { x: 0, y: 0 } : viewPosition;

    return (
      <main
        ref={containerRef}
        style={{
          flex: 1,
          overflow: "hidden",
          background: "#fff",
          cursor:
            activeTool === "measure" || activeTool === "calibrate"
              ? "crosshair"
              : isSpacePressed
                ? "grab"
                : "default",
        }}
      >
        <Stage
          ref={stageRef}
          width={stageSize.width}
          height={stageSize.height}
          x={effectiveViewPosition.x}
          y={effectiveViewPosition.y}
          scaleX={effectiveZoom}
          scaleY={effectiveZoom}
          onWheel={handleWheel}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={stopPanning}
          onMouseLeave={stopPanning}
        >
          <Layer listening={false}>
            <Rect
              x={0}
              y={0}
              width={metersToPixels(WORLD_SIZE_METERS)}
              height={metersToPixels(WORLD_SIZE_METERS)}
              fill="#ffffff"
            />
          </Layer>

          <BackgroundImageLayer
            backgroundImage={backgroundImage}
            onUpdateBackgroundImage={onUpdateBackgroundImage}
            showEditorDecorations={effectiveShowEditorDecorations}
            isInteractive={activeTool === "select"}
            snapToGrid={snapToGrid}
          />

          {effectiveShowGrid && <GridLayer />}

          <Layer>
            {rects.map((rect) => (
              <CourseRectNode
                key={rect.id}
                rect={rect}
                isSelected={
                  selection?.type === "rect" && selection.id === rect.id
                }
                isDisconnected={disconnectedRectIds.includes(rect.id)}
                onSelect={() =>
                  onSelect({
                    type: "rect",
                    id: rect.id,
                  })
                }
                onUpdate={updateRect}
                snapToGrid={snapToGrid}
                showCourseFill={effectiveShowCourseFill}
                showEditorDecorations={effectiveShowEditorDecorations}
              />
            ))}
          </Layer>

          <CourseBoundaryLayer
            rects={rects}
            isValid={disconnectedRectIds.length === 0}
          />

          <FigureLayer
            figures={figures}
            templates={figureTemplates}
            selection={selection}
            figureWarningIds={figureWarningIds}
            onSelect={onSelect}
            onUpdateFigure={onUpdateFigure}
            snapToGrid={snapToGrid}
            showHelperLines={effectiveShowHelperLines}
            showEditorDecorations={effectiveShowEditorDecorations}
          />

          <DecorationLayer
            decorations={decorations}
            selection={selection}
            onSelect={onSelect}
            onUpdateDecoration={onUpdateDecoration}
            snapToGrid={snapToGrid}
            showEditorDecorations={effectiveShowEditorDecorations}
          />

          <MeasurementLayer
            measurements={measurements}
            pendingMeasurementStart={pendingMeasurementStart}
          />

          <CalibrationLayer
            pendingCalibrationStart={pendingCalibrationStart}
          />

          <TitleBlockLayer
            metadata={metadata}
            boundsMeters={activeExportBounds ?? exportBoundsMeters}
          />

          {isExporting && activeExportBounds && (
            <ExportWatermarkLayer boundsMeters={activeExportBounds} />
          )}

          {!isExporting && (
            <ExportFrameLayer
              boundsMeters={exportBoundsMeters}
              label={exportFrameLabel}
            />
          )}
        </Stage>
      </main>
    );
  }
);

function ExportWatermarkLayer({
  boundsMeters,
}: {
  boundsMeters: ProjectBoundsMeters;
}) {
  const paddingPx = 10;
  const text = "Created with Streckentool.com";
  const fontSize = 12;
  const widthPx = 190;

  const x = metersToPixels(boundsMeters.right) - widthPx - paddingPx;
  const y = metersToPixels(boundsMeters.bottom) - fontSize - paddingPx;

  return (
    <Layer listening={false}>
      <Text
        x={x}
        y={y}
        width={widthPx}
        text={text}
        fontSize={fontSize}
        fill="rgba(0,0,0,0.45)"
        align="right"
      />
    </Layer>
  );
}

function waitForNextFrame() {
  return new Promise<void>((resolve) => {
    requestAnimationFrame(() => resolve());
  });
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

type CourseRectNodeProps = {
  rect: CourseRect;
  isSelected: boolean;
  isDisconnected: boolean;
  onSelect: () => void;
  onUpdate: (rect: CourseRect) => void;
  snapToGrid: boolean;
  showCourseFill: boolean;
  showEditorDecorations: boolean;
};

function CourseRectNode({
  rect,
  isSelected,
  isDisconnected,
  onSelect,
  onUpdate,
  snapToGrid,
  showCourseFill,
  showEditorDecorations,
}: CourseRectNodeProps) {
  const shapeRef = useRef<Konva.Rect>(null);
  const transformerRef = useRef<Konva.Transformer>(null);

  useEffect(() => {
    if (!showEditorDecorations) return;
    if (!isSelected) return;
    if (rect.locked) return;
    if (!shapeRef.current) return;
    if (!transformerRef.current) return;

    transformerRef.current.nodes([shapeRef.current]);
    transformerRef.current.getLayer()?.batchDraw();
  }, [isSelected, rect.locked, showEditorDecorations]);

  const centerX = rect.x + rect.width / 2;
  const centerY = rect.y + rect.height / 2;

  const stroke =
    showEditorDecorations && isSelected
      ? rect.locked
        ? "#607d8b"
        : "blue"
      : isDisconnected
        ? "#d32f2f"
        : "rgba(0, 0, 0, 0)";

  const fill = showCourseFill
    ? isDisconnected
      ? "rgba(255, 100, 100, 0.22)"
      : "rgba(100, 150, 255, 0.25)"
    : "rgba(0, 0, 0, 0)";

  return (
    <>
      <Rect
        ref={shapeRef}
        x={metersToPixels(centerX)}
        y={metersToPixels(centerY)}
        width={metersToPixels(rect.width)}
        height={metersToPixels(rect.height)}
        offsetX={metersToPixels(rect.width / 2)}
        offsetY={metersToPixels(rect.height / 2)}
        rotation={rect.rotation}
        fill={fill}
        stroke={stroke}
        strokeWidth={
          showEditorDecorations && isSelected ? 3 : isDisconnected ? 2 : 0
        }
        dash={showEditorDecorations && isSelected && rect.locked ? [8, 4] : []}
        draggable={!rect.locked}
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

          event.target.x(getSnappedCenterPixels(event.target.x(), rect.width));
          event.target.y(getSnappedCenterPixels(event.target.y(), rect.height));
        }}
        onDragEnd={(event) => {
          const nextCenterX = pixelsToMeters(event.target.x());
          const nextCenterY = pixelsToMeters(event.target.y());

          const rawX = nextCenterX - rect.width / 2;
          const rawY = nextCenterY - rect.height / 2;

          onUpdate({
            ...rect,
            x: snapToGrid ? snapMeters(rawX) : rawX,
            y: snapToGrid ? snapMeters(rawY) : rawY,
          });
        }}
        onTransformEnd={() => {
          const node = shapeRef.current;
          if (!node) return;

          const scaleX = Math.abs(node.scaleX());
          const scaleY = Math.abs(node.scaleY());

          const rawWidth = pixelsToMeters(node.width() * scaleX);
          const rawHeight = pixelsToMeters(node.height() * scaleY);

          const nextWidth = Math.max(
            MIN_RECT_SIZE_METERS,
            snapToGrid ? snapMeters(rawWidth) : rawWidth
          );

          const nextHeight = Math.max(
            MIN_RECT_SIZE_METERS,
            snapToGrid ? snapMeters(rawHeight) : rawHeight
          );

          const centerMetersX = pixelsToMeters(node.x());
          const centerMetersY = pixelsToMeters(node.y());

          const rawX = centerMetersX - nextWidth / 2;
          const rawY = centerMetersY - nextHeight / 2;

          const nextX = snapToGrid ? snapMeters(rawX) : rawX;
          const nextY = snapToGrid ? snapMeters(rawY) : rawY;

          node.scaleX(1);
          node.scaleY(1);

          onUpdate({
            ...rect,
            x: nextX,
            y: nextY,
            width: nextWidth,
            height: nextHeight,
            rotation: normalizeRotation(node.rotation()),
          });
        }}
      />

      {showEditorDecorations && isSelected && !rect.locked && (
        <Transformer
          ref={transformerRef}
          rotateEnabled
          keepRatio={false}
          enabledAnchors={[
            "top-left",
            "top-center",
            "top-right",
            "middle-left",
            "middle-right",
            "bottom-left",
            "bottom-center",
            "bottom-right",
          ]}
          boundBoxFunc={(oldBox, newBox) => {
            if (
              newBox.width < PIXELS_PER_METER ||
              newBox.height < PIXELS_PER_METER
            ) {
              return oldBox;
            }

            return newBox;
          }}
        />
      )}
    </>
  );
}

function getSnappedCenterPixels(centerPixels: number, sizeMeters: number) {
  const centerMeters = pixelsToMeters(centerPixels);
  const topLeftMeters = centerMeters - sizeMeters / 2;
  const snappedTopLeftMeters = snapMeters(topLeftMeters);

  return metersToPixels(snappedTopLeftMeters + sizeMeters / 2);
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