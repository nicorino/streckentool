import { createId } from "../utils/createId";
import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import Konva from "konva";
import {
  Stage,
  Layer,
  Group,
  Rect,
  Line,
  Circle,
  Text,
} from "react-konva";
import {
  type AppLanguage,
  SUPPORTED_LANGUAGES,
  useAppLanguage,
} from "../i18n/i18n";
import { type AppTheme, useAppTheme } from "../theme/theme";
import {
  saveCustomFigureTemplate,
  useCustomFigureTemplates,
} from "../figures/customFigureStorage";
import type { FigureElement, FigureTemplate } from "../types/Figure";

type CreatorTool = "select" | "cone" | "line";

type CanvasPoint = {
  x: number;
  y: number;
};

type ViewPosition = {
  x: number;
  y: number;
};

type SaveStatus =
  | {
      type: "success" | "error" | "info";
      message: string;
    }
  | null;

const CREATOR_PIXELS_PER_METER = 80;
const CREATOR_GRID_SIZE_METERS = 0.10;
const CREATOR_GRID_RANGE_METERS = 10;
const MIN_ZOOM = 0.35;
const MAX_ZOOM = 5;
const DEFAULT_CONE_RADIUS_METERS = 0.18;

export function FigureCreatorPage() {
  const { language, setLanguage, t } = useAppLanguage();
  const { theme, setTheme } = useAppTheme();
  const { templates } = useCustomFigureTemplates();

  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<Konva.Stage>(null);
  const isPanningRef = useRef(false);
  const lastPanPointerRef = useRef<ViewPosition | null>(null);

  const [templateId, setTemplateId] = useState(() =>
    createCustomTemplateId()
  );
  const [name, setName] = useState("New custom figure");
  const [description, setDescription] = useState("");
  const [activeTool, setActiveTool] = useState<CreatorTool>("select");
  const [elements, setElements] = useState<FigureElement[]>([]);
  const [selectedElementIndex, setSelectedElementIndex] =
    useState<number | null>(null);
  const [pendingLineStart, setPendingLineStart] =
    useState<CanvasPoint | null>(null);
  const [snapToGrid, setSnapToGrid] = useState(true);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>(null);

  const [stageSize, setStageSize] = useState({
    width: 800,
    height: 600,
  });

  const [zoom, setZoom] = useState(1);
  const [viewPosition, setViewPosition] = useState<ViewPosition>({
    x: 0,
    y: 0,
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
      if (event.key === "Delete" || event.key === "Backspace") {
        deleteSelectedElement();
      }

      if (event.key === "Escape") {
        setPendingLineStart(null);
        setSelectedElementIndex(null);
        setActiveTool("select");
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  });

  function resetCreator() {
    const hasUnsavedContent =
      elements.length > 0 ||
      name.trim() !== "New custom figure" ||
      description.trim() !== "";

    if (
      hasUnsavedContent &&
      !window.confirm("Discard the current figure and start a new one?")
    ) {
      return;
    }

    setTemplateId(createCustomTemplateId());
    setName("New custom figure");
    setDescription("");
    setElements([]);
    setSelectedElementIndex(null);
    setPendingLineStart(null);
    setActiveTool("select");
    setSaveStatus({
      type: "info",
      message: "Started a new custom figure.",
    });
  }

  function createCurrentTemplate(): FigureTemplate {
    return {
      id: templateId,
      name: name.trim(),
      category: "Custom",
      description: description.trim() || undefined,
      elements,
    };
  }

  function saveCurrentFigure() {
    const trimmedName = name.trim();

    if (!trimmedName) {
      setSaveStatus({
        type: "error",
        message: "Please enter a figure name.",
      });
      return;
    }

    if (elements.length === 0) {
      setSaveStatus({
        type: "error",
        message: "Add at least one cone or helper line before saving.",
      });
      return;
    }

    const template = createCurrentTemplate();

    saveCustomFigureTemplate(template);

    setSaveStatus({
      type: "success",
      message: `Saved "${template.name}" locally.`,
    });
  }

  function exportCurrentFigureJson() {
    const template = createCurrentTemplate();

    const dataUrl = `data:application/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(template, null, 2)
    )}`;

    const safeName = (template.name || "custom-figure")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = `${safeName || "custom-figure"}.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  function handleWheel(event: Konva.KonvaEventObject<WheelEvent>) {
    event.evt.preventDefault();

    const stage = stageRef.current;
    const pointer = stage?.getPointerPosition();

    if (!stage || !pointer) return;

    const oldZoom = zoom;
    const zoomFactor = event.evt.deltaY < 0 ? 1.1 : 1 / 1.1;
    const nextZoom = clamp(oldZoom * zoomFactor, MIN_ZOOM, MAX_ZOOM);

    const pointerWorldPixels = {
      x: (pointer.x - stageSize.width / 2 - viewPosition.x) / oldZoom,
      y: (pointer.y - stageSize.height / 2 - viewPosition.y) / oldZoom,
    };

    setZoom(nextZoom);
    setViewPosition({
      x: pointer.x - stageSize.width / 2 - pointerWorldPixels.x * nextZoom,
      y: pointer.y - stageSize.height / 2 - pointerWorldPixels.y * nextZoom,
    });
  }

  function handleStageMouseDown(
    event: Konva.KonvaEventObject<MouseEvent>
  ) {
    const isRightMouseButton = event.evt.button === 2;
    const isMiddleMouseButton = event.evt.button === 1;
    const isLeftMouseButton = event.evt.button === 0;

    if (isRightMouseButton || isMiddleMouseButton) {
      startPanning(event);
      return;
    }

    if (!isLeftMouseButton) return;

    const isEmptyCanvas =
      event.target === event.target.getStage() ||
      event.target.name() === "creator-background";

    if (!isEmptyCanvas) return;

    if (activeTool === "cone") {
      const point = getWorldPointerPosition();
      if (!point) return;

      addCone(point);
      return;
    }

    if (activeTool === "line") {
      const point = getWorldPointerPosition();
      if (!point) return;

      addOrFinishHelperLine(point);
      return;
    }

    setSelectedElementIndex(null);
    startPanning(event);
  }

  function startPanning(event: Konva.KonvaEventObject<MouseEvent>) {
    event.evt.preventDefault();

    isPanningRef.current = true;
    lastPanPointerRef.current =
      stageRef.current?.getPointerPosition() ?? null;
  }

  function handleMouseMove() {
    if (!isPanningRef.current) return;

    const stage = stageRef.current;
    const pointer = stage?.getPointerPosition();
    const lastPointer = lastPanPointerRef.current;

    if (!stage || !pointer || !lastPointer) return;

    const dx = pointer.x - lastPointer.x;
    const dy = pointer.y - lastPointer.y;

    setViewPosition((currentPosition) => ({
      x: currentPosition.x + dx,
      y: currentPosition.y + dy,
    }));

    lastPanPointerRef.current = pointer;
  }

  function stopPanning() {
    isPanningRef.current = false;
    lastPanPointerRef.current = null;
  }

  function handleContextMenu(event: Konva.KonvaEventObject<MouseEvent>) {
    event.evt.preventDefault();
  }

  function getWorldPointerPosition(): CanvasPoint | null {
    const stage = stageRef.current;
    const pointer = stage?.getPointerPosition();

    if (!stage || !pointer) return null;

    const rawPoint = {
      x:
        (pointer.x - stageSize.width / 2 - viewPosition.x) /
        zoom /
        CREATOR_PIXELS_PER_METER,
      y:
        (pointer.y - stageSize.height / 2 - viewPosition.y) /
        zoom /
        CREATOR_PIXELS_PER_METER,
    };

    return snapToGrid ? snapCreatorPoint(rawPoint) : rawPoint;
  }

  function addCone(point: CanvasPoint) {
    setElements((currentElements) => [
      ...currentElements,
      {
        type: "cone",
        x: point.x,
        y: point.y,
        radius: DEFAULT_CONE_RADIUS_METERS,
      },
    ]);

    setSelectedElementIndex(elements.length);
    setSaveStatus(null);
  }

  function addOrFinishHelperLine(point: CanvasPoint) {
    if (!pendingLineStart) {
      setPendingLineStart(point);
      setSaveStatus({
        type: "info",
        message: "Click a second point to finish the helper line.",
      });
      return;
    }

    const lineLength = Math.hypot(
      point.x - pendingLineStart.x,
      point.y - pendingLineStart.y
    );

    if (lineLength < 0.05) {
      setSaveStatus({
        type: "error",
        message: "Helper line is too short.",
      });
      return;
    }

    setElements((currentElements) => [
      ...currentElements,
      {
        type: "line",
        x1: pendingLineStart.x,
        y1: pendingLineStart.y,
        x2: point.x,
        y2: point.y,
      },
    ]);

    setSelectedElementIndex(elements.length);
    setPendingLineStart(null);
    setSaveStatus(null);
  }

  function updateElement(
    index: number,
    updatedElement: FigureElement
  ) {
    setElements((currentElements) =>
      currentElements.map((element, elementIndex) =>
        elementIndex === index ? updatedElement : element
      )
    );
    setSaveStatus(null);
  }

  function deleteSelectedElement() {
    setElements((currentElements) => {
      if (
        selectedElementIndex === null ||
        selectedElementIndex < 0 ||
        selectedElementIndex >= currentElements.length
      ) {
        return currentElements;
      }

      return currentElements.filter(
        (_element, index) => index !== selectedElementIndex
      );
    });

    setSelectedElementIndex(null);
    setSaveStatus(null);
  }

  function clearElements() {
    if (
      elements.length > 0 &&
      !window.confirm("Delete all elements in this custom figure?")
    ) {
      return;
    }

    setElements([]);
    setSelectedElementIndex(null);
    setPendingLineStart(null);
    setSaveStatus(null);
  }

  const selectedElement =
    selectedElementIndex === null
      ? null
      : elements[selectedElementIndex] ?? null;

  return (
    <div style={pageStyle}>
      <header style={headerStyle}>
        <strong>Streckentool Creator</strong>

        <button type="button" onClick={resetCreator}>
          New
        </button>

        <button type="button" onClick={saveCurrentFigure}>
          Save
        </button>

        <button type="button" onClick={exportCurrentFigureJson}>
          Export JSON
        </button>

        <a href="/" style={linkButtonStyle}>
          Back to planner
        </a>

        <div style={{ flex: 1 }} />

        <label style={compactLabelStyle}>
          {t("theme")}
          <select
            value={theme}
            onChange={(event) => setTheme(event.target.value as AppTheme)}
          >
            <option value="light">{t("lightMode")}</option>
            <option value="dark">{t("darkMode")}</option>
          </select>
        </label>

        <label style={compactLabelStyle}>
          {t("language")}
          <select
            value={language}
            onChange={(event) =>
              setLanguage(event.target.value as AppLanguage)
            }
          >
            {SUPPORTED_LANGUAGES.map((supportedLanguage) => (
              <option
                key={supportedLanguage.code}
                value={supportedLanguage.code}
              >
                {supportedLanguage.label}
              </option>
            ))}
          </select>
        </label>
      </header>

      <div style={layoutStyle}>
        <aside style={leftPanelStyle}>
          <h3 style={{ marginTop: 0 }}>Figure data</h3>

          <label style={fieldLabelStyle}>
            Name
            <input
              value={name}
              onChange={(event) => {
                setName(event.target.value);
                setSaveStatus(null);
              }}
              style={inputStyle}
            />
          </label>

          <label style={fieldLabelStyle}>
            Description
            <textarea
              value={description}
              onChange={(event) => {
                setDescription(event.target.value);
                setSaveStatus(null);
              }}
              rows={4}
              style={textareaStyle}
            />
          </label>

          <div style={infoBoxStyle}>
            <div>Category: Custom</div>
            <div>Elements: {elements.length}</div>
            <div>Local custom figures saved: {templates.length}</div>
          </div>

          {selectedElement && (
            <div style={infoBoxStyle}>
              <strong>Selected element</strong>
              <div>{getElementLabel(selectedElement)}</div>
            </div>
          )}

          {saveStatus && (
            <div
              style={{
                ...statusBoxStyle,
                borderColor:
                  saveStatus.type === "success"
                    ? "var(--st-success-border)"
                    : saveStatus.type === "error"
                      ? "var(--st-error-border)"
                      : "var(--st-info-border)",
                background:
                  saveStatus.type === "success"
                    ? "var(--st-success-bg)"
                    : saveStatus.type === "error"
                      ? "var(--st-error-bg)"
                      : "var(--st-info-bg)",
              }}
            >
              {saveStatus.message}
            </div>
          )}
        </aside>

        <main
          ref={containerRef}
          onContextMenu={(event) => event.preventDefault()}
          style={{
            position: "relative",
            overflow: "hidden",
            background: "#ffffff",
            cursor:
              activeTool === "cone" || activeTool === "line"
                ? "crosshair"
                : "grab",
          }}
        >
          <Stage
            ref={stageRef}
            width={stageSize.width}
            height={stageSize.height}
            onWheel={handleWheel}
            onMouseDown={handleStageMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={stopPanning}
            onMouseLeave={stopPanning}
            onContextMenu={handleContextMenu}
          >
            <Layer>
              <Rect
                name="creator-background"
                x={0}
                y={0}
                width={stageSize.width}
                height={stageSize.height}
                fill="#ffffff"
              />

              <Group
                x={stageSize.width / 2 + viewPosition.x}
                y={stageSize.height / 2 + viewPosition.y}
                scaleX={zoom}
                scaleY={zoom}
              >
                <CreatorGrid />

                {pendingLineStart && (
                  <Circle
                    x={metersToCreatorPixels(pendingLineStart.x)}
                    y={metersToCreatorPixels(pendingLineStart.y)}
                    radius={6}
                    fill="#7b1fa2"
                    listening={false}
                  />
                )}

                {elements.map((element, index) => {
                  if (element.type === "cone") {
                    return (
                      <Circle
                        key={`${index}-cone`}
                        x={metersToCreatorPixels(element.x)}
                        y={metersToCreatorPixels(element.y)}
                        radius={metersToCreatorPixels(element.radius)}
                        fill="#ff7a00"
                        stroke={
                          selectedElementIndex === index
                            ? "#1565c0"
                            : "#8a3f00"
                        }
                        strokeWidth={
                          selectedElementIndex === index ? 4 : 2
                        }
                        draggable={activeTool === "select"}
                        onMouseDown={(event) => {
                          if (event.evt.button !== 0) return;
                          event.cancelBubble = true;
                          setSelectedElementIndex(index);
                        }}
                        onClick={(event) => {
                          event.cancelBubble = true;
                          setSelectedElementIndex(index);
                        }}
                        onDragMove={(event) => {
                          if (!snapToGrid) return;

                          const snappedPoint = snapCreatorPoint({
                            x: creatorPixelsToMeters(event.target.x()),
                            y: creatorPixelsToMeters(event.target.y()),
                          });

                          event.target.x(
                            metersToCreatorPixels(snappedPoint.x)
                          );
                          event.target.y(
                            metersToCreatorPixels(snappedPoint.y)
                          );
                        }}
                        onDragEnd={(event) => {
                          const point = {
                            x: creatorPixelsToMeters(event.target.x()),
                            y: creatorPixelsToMeters(event.target.y()),
                          };

                          const nextPoint = snapToGrid
                            ? snapCreatorPoint(point)
                            : point;

                          updateElement(index, {
                            ...element,
                            x: nextPoint.x,
                            y: nextPoint.y,
                          });
                        }}
                      />
                    );
                  }

                  return (
                    <Line
                      key={`${index}-line`}
                      points={[
                        metersToCreatorPixels(element.x1),
                        metersToCreatorPixels(element.y1),
                        metersToCreatorPixels(element.x2),
                        metersToCreatorPixels(element.y2),
                      ]}
                      stroke={
                        selectedElementIndex === index
                          ? "#1565c0"
                          : "#555555"
                      }
                      strokeWidth={
                        selectedElementIndex === index ? 4 : 2
                      }
                      dash={[8, 5]}
                      hitStrokeWidth={14}
                      draggable={activeTool === "select"}
                      onMouseDown={(event) => {
                        if (event.evt.button !== 0) return;
                        event.cancelBubble = true;
                        setSelectedElementIndex(index);
                      }}
                      onClick={(event) => {
                        event.cancelBubble = true;
                        setSelectedElementIndex(index);
                      }}
                      onDragEnd={(event) => {
                        const dx = creatorPixelsToMeters(event.target.x());
                        const dy = creatorPixelsToMeters(event.target.y());

                        event.target.position({ x: 0, y: 0 });

                        const movedLine = {
                          type: "line" as const,
                          x1: element.x1 + dx,
                          y1: element.y1 + dy,
                          x2: element.x2 + dx,
                          y2: element.y2 + dy,
                        };

                        updateElement(
                          index,
                          snapToGrid
                            ? {
                                type: "line",
                                x1: snapCreatorMeters(movedLine.x1),
                                y1: snapCreatorMeters(movedLine.y1),
                                x2: snapCreatorMeters(movedLine.x2),
                                y2: snapCreatorMeters(movedLine.y2),
                              }
                            : movedLine
                        );
                      }}
                    />
                  );
                })}

                <Text
                  x={8}
                  y={8}
                  text="origin"
                  fontSize={12}
                  fill="#555"
                  listening={false}
                />
              </Group>
            </Layer>
          </Stage>
        </main>

        <aside style={rightPanelStyle}>
          <h3 style={{ marginTop: 0 }}>Tools</h3>

          <div style={{ display: "grid", gap: 8 }}>
            <button
              type="button"
              onClick={() => {
                setActiveTool("select");
                setPendingLineStart(null);
              }}
              style={toolButtonStyle(activeTool === "select")}
            >
              Select / move
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTool("cone");
                setPendingLineStart(null);
              }}
              style={toolButtonStyle(activeTool === "cone")}
            >
              Add cone
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTool("line");
                setSelectedElementIndex(null);
              }}
              style={toolButtonStyle(activeTool === "line")}
            >
              Add helper line
            </button>

            <button
              type="button"
              onClick={deleteSelectedElement}
              disabled={selectedElementIndex === null}
            >
              Delete selected
            </button>

            <button
              type="button"
              onClick={clearElements}
              disabled={elements.length === 0}
            >
              Clear figure
            </button>
          </div>

          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginTop: 14,
              fontSize: 13,
            }}
          >
            <input
              type="checkbox"
              checked={snapToGrid}
              onChange={(event) => setSnapToGrid(event.target.checked)}
            />
            Snap to 0.1 m grid
          </label>

          <div style={helpBoxStyle}>
            <strong>How to use</strong>
            <p>
              Mouse wheel zooms. Drag empty canvas to pan. Right-click drag
              also pans.
            </p>
            <p>
              Add cone: click once. Helper line: click start point, then end
              point.
            </p>
            <p>Delete or Backspace removes the selected element.</p>
          </div>
        </aside>
      </div>
    </div>
  );
}

function CreatorGrid() {
  const lines = [];
  const range = CREATOR_GRID_RANGE_METERS;
  const step = CREATOR_GRID_SIZE_METERS;

  for (let value = -range; value <= range + 0.0001; value += step) {
    const roundedValue = Math.round(value * 1000) / 1000;
    const position = metersToCreatorPixels(roundedValue);
    const isMajor = Math.abs(roundedValue % 1) < 0.0001;

    lines.push(
      <Line
        key={`v-${roundedValue}`}
        points={[
          position,
          metersToCreatorPixels(-range),
          position,
          metersToCreatorPixels(range),
        ]}
        stroke={isMajor ? "#d0d0d0" : "#eeeeee"}
        strokeWidth={isMajor ? 1.2 : 0.8}
        listening={false}
      />
    );

    lines.push(
      <Line
        key={`h-${roundedValue}`}
        points={[
          metersToCreatorPixels(-range),
          position,
          metersToCreatorPixels(range),
          position,
        ]}
        stroke={isMajor ? "#d0d0d0" : "#eeeeee"}
        strokeWidth={isMajor ? 1.2 : 0.8}
        listening={false}
      />
    );
  }

  return (
    <>
      {lines}

      <Line
        points={[
          metersToCreatorPixels(-range),
          0,
          metersToCreatorPixels(range),
          0,
        ]}
        stroke="#c62828"
        strokeWidth={2}
        listening={false}
      />

      <Line
        points={[
          0,
          metersToCreatorPixels(-range),
          0,
          metersToCreatorPixels(range),
        ]}
        stroke="#1565c0"
        strokeWidth={2}
        listening={false}
      />

      <Circle
        x={0}
        y={0}
        radius={4}
        fill="#222"
        listening={false}
      />
    </>
  );
}

function createCustomTemplateId() {
  if (crypto.randomUUID) {
    return `custom:${createId()}`;
  }

  return `custom:${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function metersToCreatorPixels(value: number) {
  return value * CREATOR_PIXELS_PER_METER;
}

function creatorPixelsToMeters(value: number) {
  return value / CREATOR_PIXELS_PER_METER;
}

function snapCreatorMeters(value: number) {
  return (
    Math.round(value / CREATOR_GRID_SIZE_METERS) *
    CREATOR_GRID_SIZE_METERS
  );
}

function snapCreatorPoint(point: CanvasPoint): CanvasPoint {
  return {
    x: snapCreatorMeters(point.x),
    y: snapCreatorMeters(point.y),
  };
}

function getElementLabel(element: FigureElement) {
  if (element.type === "cone") {
    return `Cone at ${formatMeters(element.x)} m, ${formatMeters(
      element.y
    )} m`;
  }

  return `Helper line from ${formatMeters(element.x1)} m, ${formatMeters(
    element.y1
  )} m to ${formatMeters(element.x2)} m, ${formatMeters(element.y2)} m`;
}

function formatMeters(value: number) {
  return Number(value.toFixed(2)).toString();
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function toolButtonStyle(active: boolean): CSSProperties {
  return {
    background: active ? "var(--st-primary)" : "var(--st-button-bg)",
    color: active ? "var(--st-primary-text)" : "var(--st-button-text)",
    border: active
      ? "1px solid var(--st-primary)"
      : "1px solid var(--st-button-border)",
    fontWeight: active ? 700 : 400,
  };
}

const pageStyle = {
  minHeight: "100vh",
  display: "flex",
  flexDirection: "column",
  background: "var(--st-bg)",
  color: "var(--st-text)",
  fontFamily: "sans-serif",
} satisfies CSSProperties;

const headerStyle = {
  height: 56,
  display: "flex",
  alignItems: "center",
  gap: 10,
  padding: "0 14px",
  borderBottom: "1px solid var(--st-border)",
  background: "var(--st-surface)",
  boxSizing: "border-box",
} satisfies CSSProperties;

const layoutStyle = {
  flex: 1,
  minHeight: 0,
  display: "grid",
  gridTemplateColumns: "280px 1fr 280px",
} satisfies CSSProperties;

const leftPanelStyle = {
  padding: 16,
  borderRight: "1px solid var(--st-border)",
  background: "var(--st-panel)",
  color: "var(--st-text)",
  boxSizing: "border-box",
  overflowY: "auto",
} satisfies CSSProperties;

const rightPanelStyle = {
  padding: 16,
  borderLeft: "1px solid var(--st-border)",
  background: "var(--st-panel)",
  color: "var(--st-text)",
  boxSizing: "border-box",
  overflowY: "auto",
} satisfies CSSProperties;

const fieldLabelStyle = {
  display: "block",
  marginBottom: 12,
  fontSize: 14,
} satisfies CSSProperties;

const inputStyle = {
  display: "block",
  width: "100%",
  boxSizing: "border-box",
  marginTop: 4,
  padding: "6px 8px",
  background: "var(--st-card)",
  color: "var(--st-text)",
  border: "1px solid var(--st-border)",
  borderRadius: 6,
} satisfies CSSProperties;

const textareaStyle = {
  ...inputStyle,
  resize: "vertical",
} satisfies CSSProperties;

const compactLabelStyle = {
  display: "flex",
  alignItems: "center",
  gap: 4,
  fontSize: 12,
  flexShrink: 0,
} satisfies CSSProperties;

const linkButtonStyle = {
  display: "inline-block",
  padding: "5px 10px",
  border: "1px solid var(--st-border)",
  borderRadius: 6,
  background: "var(--st-card)",
  color: "var(--st-text)",
  textDecoration: "none",
  fontSize: 13,
} satisfies CSSProperties;

const infoBoxStyle = {
  padding: 10,
  border: "1px solid var(--st-border-soft)",
  borderRadius: 8,
  background: "var(--st-card)",
  fontSize: 13,
  lineHeight: 1.5,
  marginBottom: 12,
} satisfies CSSProperties;

const statusBoxStyle = {
  padding: 10,
  border: "1px solid",
  borderRadius: 8,
  fontSize: 13,
  lineHeight: 1.4,
} satisfies CSSProperties;

const helpBoxStyle = {
  marginTop: 16,
  padding: 10,
  border: "1px solid var(--st-border-soft)",
  borderRadius: 8,
  background: "var(--st-card)",
  color: "var(--st-text-muted)",
  fontSize: 13,
  lineHeight: 1.4,
} satisfies CSSProperties;