import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
} from "react";
import { TopToolbar } from "../components/TopToolbar";
import type { EditorTool } from "../components/TopToolbar";
import { LeftInspector } from "../components/LeftInspector";
import { RightFigureLibrary } from "../components/RightFigureLibrary";
import { ProjectMetadataPanel } from "../components/ProjectMetadataPanel";
import { CalibrationDialog } from "../components/CalibrationDialog";
import { NewProjectDialog } from "../components/NewProjectDialog";
import {
  EditorCanvas,
  type EditorCanvasHandle,
} from "../canvas/EditorCanvas";
import type { CourseRect } from "../types/CourseRect";
import type { FigureInstance } from "../types/Figure";
import { DEFAULT_CONE_COLOR } from "../types/Figure";
import type { ArrowKind, Decoration } from "../types/Decoration";
import type { Measurement } from "../types/Measurement";
import type { CourseBackgroundImage } from "../types/CourseBackgroundImage";
import type { ProjectMetadata } from "../types/ProjectMetadata";
import type { Selection } from "../types/Selection";
import { validateConnectedCourse } from "../course/validateConnectedCourse";
import { getFigureBoundsWarnings } from "../course/checkFigureBounds";
import {
  createEmptyEditorState,
  createStreckentoolProject,
  parseStreckentoolProject,
  type EditorState,
} from "../projects/StreckentoolProject";
import { useUndoRedo } from "../state/useUndoRedo";
import { FIGURE_TEMPLATES } from "../figures/figureTemplates";
import {
  importCustomFigureTemplatesFromJsonText,
  useCustomFigureTemplates,
} from "../figures/customFigureStorage";
import {
  getExportBounds,
  getExportFormatLabel,
  type ExportFormat,
} from "../export/getProjectBounds";

type ViewPosition = {
  x: number;
  y: number;
};

type CanvasPoint = {
  x: number;
  y: number;
};

type CalibrationDraft = {
  start: CanvasPoint;
  end: CanvasPoint;
  measuredDistanceMeters: number;
};

const MIN_ZOOM = 0.25;
const MAX_ZOOM = 4;

export function EditorPage() {
  const editorCanvasRef = useRef<EditorCanvasHandle>(null);
  const editorHistory = useUndoRedo<EditorState>(createEmptyEditorState());

  const { templates: customFigureTemplates } = useCustomFigureTemplates();

  const figureTemplates = useMemo(
    () => [...FIGURE_TEMPLATES, ...customFigureTemplates],
    [customFigureTemplates]
  );

  const editorState = editorHistory.value;
  const rects = editorState.rects;
  const figures = editorState.figures;
  const decorations = editorState.decorations;
  const measurements = editorState.measurements;
  const backgroundImage = editorState.backgroundImage;
  const metadata = editorState.metadata;

  const [selection, setSelection] = useState<Selection | null>(null);
  const [printPreview, setPrintPreview] = useState(false);
  const [showHelperLines, setShowHelperLines] = useState(true);
  const [snapToGrid, setSnapToGrid] = useState(true);
  const [exportFormat, setExportFormat] =
    useState<ExportFormat>("a4-landscape");

  const [activeTool, setActiveTool] = useState<EditorTool>("select");
  const [pendingMeasurementStart, setPendingMeasurementStart] =
    useState<CanvasPoint | null>(null);
  const [pendingCalibrationStart, setPendingCalibrationStart] =
    useState<CanvasPoint | null>(null);
  const [calibrationDraft, setCalibrationDraft] =
    useState<CalibrationDraft | null>(null);
  const [showNewProjectDialog, setShowNewProjectDialog] = useState(false);

  const [zoom, setZoom] = useState(1);
  const [viewPosition, setViewPosition] = useState<ViewPosition>({
    x: 0,
    y: 0,
  });

  const selectedRect =
    selection?.type === "rect"
      ? rects.find((rect) => rect.id === selection.id) ?? null
      : null;

  const selectedFigure =
    selection?.type === "figure"
      ? figures.find((figure) => figure.id === selection.id) ?? null
      : null;

  const selectedDecoration =
    selection?.type === "decoration"
      ? decorations.find((decoration) => decoration.id === selection.id) ?? null
      : null;

  const selectedFigureTemplate = selectedFigure
    ? figureTemplates.find(
        (template) => template.id === selectedFigure.templateId
      ) ?? null
    : null;

  const courseValidation = validateConnectedCourse(rects);

  const figureBoundsWarnings = getFigureBoundsWarnings(
    rects,
    figures,
    figureTemplates
  );

  const figureWarningIds = figureBoundsWarnings.map(
    (warning) => warning.figureId
  );

  const selectedFigureWarning =
    selectedFigure === null
      ? null
      : figureBoundsWarnings.find(
          (warning) => warning.figureId === selectedFigure.id
        ) ?? null;

  const exportBounds = getExportBounds(
    rects,
    figures,
    figureTemplates,
    decorations,
    measurements,
    exportFormat
  );

  const exportFrameLabel = getExportFormatLabel(exportFormat);
  const zoomPercent = Math.round(zoom * 100);

  function addRectangle() {
    const id = crypto.randomUUID();

    editorHistory.set((currentState) => ({
      ...currentState,
      rects: [
        ...currentState.rects,
        {
          id,
          x: 5,
          y: 5,
          width: 8,
          height: 4,
          rotation: 0,
          locked: false,
        },
      ],
    }));

    setSelection({
      type: "rect",
      id,
    });
  }

  function addFigure(templateId: string) {
    const id = crypto.randomUUID();

    editorHistory.set((currentState) => ({
      ...currentState,
      figures: [
        ...currentState.figures,
        {
          id,
          templateId,
          x: 10,
          y: 10,
          rotation: 0,
          mirrored: false,
          coneColor: DEFAULT_CONE_COLOR,
        },
      ],
    }));

    setSelection({
      type: "figure",
      id,
    });
  }

  function addText() {
    const id = crypto.randomUUID();

    const textDecoration: Decoration = {
      id,
      type: "text",
      x: exportBounds.left + 1,
      y: exportBounds.top + 1,
      width: 12,
      height: 3,
      rotation: 0,
      text: "Vereinsname / Veranstaltung",
      fontSize: 22,
      color: "#000000",
    };

    editorHistory.set((currentState) => ({
      ...currentState,
      decorations: [...currentState.decorations, textDecoration],
    }));

    setSelection({
      type: "decoration",
      id,
    });
  }


  function addArrow(arrowKind: ArrowKind) {
    const id = crypto.randomUUID();

    const isLongArrow = arrowKind === "straight-long";
    const isCurveArrow =
      arrowKind === "curve-right" || arrowKind === "curve-left";

    const arrowDecoration: Decoration = {
      id,
      type: "arrow",
      x: exportBounds.left + 2,
      y: exportBounds.top + 2,
      width: isLongArrow ? 9 : isCurveArrow ? 5 : 5,
      height: isCurveArrow ? 4 : 1.2,
      rotation: 0,
      arrowKind,
      color: "#000000",
    };

    editorHistory.set((currentState) => ({
      ...currentState,
      decorations: [...currentState.decorations, arrowDecoration],
    }));

    setSelection({
      type: "decoration",
      id,
    });
  }

  async function importImageFile(file: File) {
    const src = await readFileAsDataUrl(file);
    const imageSize = await getImageSize(src);

    const defaultWidth = 8;
    const defaultHeight =
      imageSize.width > 0
        ? defaultWidth * (imageSize.height / imageSize.width)
        : 4;

    const id = crypto.randomUUID();

    const imageDecoration: Decoration = {
      id,
      type: "image",
      x: Math.max(exportBounds.left + 1, exportBounds.right - defaultWidth - 1),
      y: exportBounds.top + 1,
      width: defaultWidth,
      height: defaultHeight,
      rotation: 0,
      src,
      name: file.name,
    };

    editorHistory.set((currentState) => ({
      ...currentState,
      decorations: [...currentState.decorations, imageDecoration],
    }));

    setSelection({
      type: "decoration",
      id,
    });
  }

  async function importBackgroundImageFile(file: File) {
    const src = await readFileAsDataUrl(file);
    const imageSize = await getImageSize(src);

    const defaultWidth = 40;
    const defaultHeight =
      imageSize.width > 0
        ? defaultWidth * (imageSize.height / imageSize.width)
        : 25;

    const nextBackgroundImage: CourseBackgroundImage = {
      id: crypto.randomUUID(),
      src,
      name: file.name,
      x: 0,
      y: 0,
      width: defaultWidth,
      height: defaultHeight,
      opacity: 0.45,
      locked: false,
    };

    editorHistory.set((currentState) => ({
      ...currentState,
      backgroundImage: nextBackgroundImage,
    }));

    setSelection(null);
  }

  async function handleImportCreatorJson(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    try {
      const jsonText = await file.text();
      const importedTemplates =
        importCustomFigureTemplatesFromJsonText(jsonText);

      window.alert(
        importedTemplates.length === 1
          ? `Imported custom figure: ${importedTemplates[0].name}`
          : `Imported ${importedTemplates.length} custom figures.`
      );
    } catch (error) {
      console.error(error);
      window.alert(
        "Could not import this JSON file. Make sure it was exported from the Streckentool Creator."
      );
    } finally {
      event.target.value = "";
    }
  }

  function clearBackgroundImage() {
    editorHistory.set((currentState) => ({
      ...currentState,
      backgroundImage: null,
    }));

    setPendingCalibrationStart(null);
    setCalibrationDraft(null);
  }

  function updateBackgroundImage(
    updatedBackgroundImage: CourseBackgroundImage
  ) {
    editorHistory.set((currentState) => ({
      ...currentState,
      backgroundImage: updatedBackgroundImage,
    }));
  }

  function updateBackgroundImagePatch(patch: Partial<CourseBackgroundImage>) {
    editorHistory.set((currentState) => {
      if (!currentState.backgroundImage) {
        return currentState;
      }

      return {
        ...currentState,
        backgroundImage: {
          ...currentState.backgroundImage,
          ...patch,
        },
      };
    });
  }

  function updateMetadata(patch: Partial<ProjectMetadata>) {
    editorHistory.set((currentState) => ({
      ...currentState,
      metadata: {
        ...currentState.metadata,
        ...patch,
      },
    }));
  }

  function openNewProjectDialog() {
    setShowNewProjectDialog(true);
  }

  function confirmNewProject() {
    editorHistory.reset(createEmptyEditorState());

    setSelection(null);
    setPrintPreview(false);
    setShowHelperLines(true);
    setSnapToGrid(true);
    setExportFormat("a4-landscape");

    setActiveTool("select");
    setPendingMeasurementStart(null);
    setPendingCalibrationStart(null);
    setCalibrationDraft(null);

    setZoom(1);
    setViewPosition({
      x: 0,
      y: 0,
    });

    setShowNewProjectDialog(false);
  }

  function handleCanvasPointClick(point: CanvasPoint) {
    if (activeTool === "measure") {
      handleMeasurementPointClick(point);
      return;
    }

    if (activeTool === "calibrate") {
      handleCalibrationPointClick(point);
      return;
    }
  }

  function handleMeasurementPointClick(point: CanvasPoint) {
    if (!pendingMeasurementStart) {
      setPendingMeasurementStart(point);
      return;
    }

    const id = crypto.randomUUID();

    const measurement: Measurement = {
      id,
      x1: pendingMeasurementStart.x,
      y1: pendingMeasurementStart.y,
      x2: point.x,
      y2: point.y,
    };

    editorHistory.set((currentState) => ({
      ...currentState,
      measurements: [...currentState.measurements, measurement],
    }));

    setPendingMeasurementStart(null);
  }

  function handleCalibrationPointClick(point: CanvasPoint) {
    if (!backgroundImage) {
      alert("Please import a background image before calibrating.");
      setActiveTool("select");
      setPendingCalibrationStart(null);
      setCalibrationDraft(null);
      return;
    }

    if (!pendingCalibrationStart) {
      setPendingCalibrationStart(point);
      return;
    }

    const measuredDistanceMeters = Math.hypot(
      point.x - pendingCalibrationStart.x,
      point.y - pendingCalibrationStart.y
    );

    if (measuredDistanceMeters <= 0) {
      alert("Calibration points must be different.");
      setPendingCalibrationStart(null);
      setCalibrationDraft(null);
      return;
    }

    setCalibrationDraft({
      start: pendingCalibrationStart,
      end: point,
      measuredDistanceMeters,
    });

    setPendingCalibrationStart(null);
  }

  function applyCalibration(realDistanceMeters: number) {
    if (!calibrationDraft) {
      return;
    }

    const scaleFactor =
      realDistanceMeters / calibrationDraft.measuredDistanceMeters;

    editorHistory.set((currentState) => {
      if (!currentState.backgroundImage) {
        return currentState;
      }

      const image = currentState.backgroundImage;
      const anchor = calibrationDraft.start;

      return {
        ...currentState,
        backgroundImage: {
          ...image,
          x: anchor.x - (anchor.x - image.x) * scaleFactor,
          y: anchor.y - (anchor.y - image.y) * scaleFactor,
          width: image.width * scaleFactor,
          height: image.height * scaleFactor,
        },
      };
    });

    setCalibrationDraft(null);
    setPendingCalibrationStart(null);
    setActiveTool("select");
  }

  function cancelCalibration() {
    setCalibrationDraft(null);
    setPendingCalibrationStart(null);
  }

  function clearMeasurements() {
    editorHistory.set((currentState) => ({
      ...currentState,
      measurements: [],
    }));

    setPendingMeasurementStart(null);
  }

  function deleteSelected() {
    if (!selection) return;

    if (selection.type === "rect") {
      editorHistory.set((currentState) => ({
        ...currentState,
        rects: currentState.rects.filter((rect) => rect.id !== selection.id),
      }));
    }

    if (selection.type === "figure") {
      editorHistory.set((currentState) => ({
        ...currentState,
        figures: currentState.figures.filter(
          (figure) => figure.id !== selection.id
        ),
      }));
    }

    if (selection.type === "decoration") {
      editorHistory.set((currentState) => ({
        ...currentState,
        decorations: currentState.decorations.filter(
          (decoration) => decoration.id !== selection.id
        ),
      }));
    }

    setSelection(null);
  }

  function updateSelectedRect(patch: Partial<CourseRect>) {
    if (selection?.type !== "rect") return;

    editorHistory.set((currentState) => ({
      ...currentState,
      rects: currentState.rects.map((rect) =>
        rect.id === selection.id
          ? {
              ...rect,
              ...patch,
            }
          : rect
      ),
    }));
  }

  function updateSelectedFigure(patch: Partial<FigureInstance>) {
    if (selection?.type !== "figure") return;

    editorHistory.set((currentState) => ({
      ...currentState,
      figures: currentState.figures.map((figure) =>
        figure.id === selection.id
          ? {
              ...figure,
              ...patch,
            }
          : figure
      ),
    }));
  }

  function updateSelectedDecoration(patch: Partial<Decoration>) {
    if (selection?.type !== "decoration") return;

    editorHistory.set((currentState) => ({
      ...currentState,
      decorations: currentState.decorations.map((decoration) =>
        decoration.id === selection.id
          ? ({
              ...decoration,
              ...patch,
            } as Decoration)
          : decoration
      ),
    }));
  }

  function updateFigure(updatedFigure: FigureInstance) {
    editorHistory.set((currentState) => ({
      ...currentState,
      figures: currentState.figures.map((figure) =>
        figure.id === updatedFigure.id ? updatedFigure : figure
      ),
    }));
  }

  function updateDecoration(updatedDecoration: Decoration) {
    editorHistory.set((currentState) => ({
      ...currentState,
      decorations: currentState.decorations.map((decoration) =>
        decoration.id === updatedDecoration.id ? updatedDecoration : decoration
      ),
    }));
  }

  function duplicateSelectedFigure() {
    if (!selectedFigure) return;

    const id = crypto.randomUUID();

    editorHistory.set((currentState) => ({
      ...currentState,
      figures: [
        ...currentState.figures,
        {
          ...selectedFigure,
          id,
          x: selectedFigure.x + 1,
          y: selectedFigure.y + 1,
        },
      ],
    }));

    setSelection({
      type: "figure",
      id,
    });
  }

  function mirrorSelectedFigure() {
    if (!selectedFigure) return;

    updateSelectedFigure({
      mirrored: !selectedFigure.mirrored,
    });
  }

  function changeRects(nextRects: CourseRect[]) {
    editorHistory.set((currentState) => ({
      ...currentState,
      rects: nextRects,
    }));
  }

  function zoomIn() {
    setZoom((current) => clamp(current * 1.2, MIN_ZOOM, MAX_ZOOM));
  }

  function zoomOut() {
    setZoom((current) => clamp(current / 1.2, MIN_ZOOM, MAX_ZOOM));
  }

  function resetZoom() {
    setZoom(1);
    setViewPosition({
      x: 0,
      y: 0,
    });
  }

  function changeActiveTool(tool: EditorTool) {
    setActiveTool(tool);
    setPendingMeasurementStart(null);
    setPendingCalibrationStart(null);
    setCalibrationDraft(null);
  }

  function undo() {
    editorHistory.undo();
    setSelection(null);
    setPendingMeasurementStart(null);
    setPendingCalibrationStart(null);
    setCalibrationDraft(null);
  }

  function redo() {
    editorHistory.redo();
    setSelection(null);
    setPendingMeasurementStart(null);
    setPendingCalibrationStart(null);
    setCalibrationDraft(null);
  }

  function saveProject() {
    const project = createStreckentoolProject(editorState);
    const json = JSON.stringify(project, null, 2);

    const blob = new Blob([json], {
      type: "application/json",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    const date = new Date().toISOString().slice(0, 10);

    link.href = url;
    link.download = `streckentool-${date}.json`;
    link.click();

    URL.revokeObjectURL(url);
  }

  function exportPng() {
    const date = new Date().toISOString().slice(0, 10);

    void editorCanvasRef.current?.exportPng({
      fileName: `streckentool-${date}.png`,
      boundsMeters: exportBounds,
      pixelRatio: 3,
    });
  }

  async function loadProjectFile(file: File) {
    try {
      const nextState = parseStreckentoolProject(await file.text());

      editorHistory.reset(nextState);
      setSelection(null);
      setPendingMeasurementStart(null);
      setPendingCalibrationStart(null);
      setCalibrationDraft(null);
      setShowNewProjectDialog(false);
    } catch (error) {
      console.error(error);
      alert(
        "Could not load project file. Make sure it is a valid Streckentool JSON file."
      );
    }
  }

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;

      const isTyping =
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target instanceof HTMLSelectElement ||
        target?.isContentEditable;

      if (isTyping) {
        return;
      }

      const key = event.key.toLowerCase();
      const isModifierPressed = event.ctrlKey || event.metaKey;

      if (isModifierPressed && key === "z" && event.shiftKey) {
        event.preventDefault();
        redo();
        return;
      }

      if (isModifierPressed && key === "z") {
        event.preventDefault();
        undo();
        return;
      }

      if (isModifierPressed && key === "y") {
        event.preventDefault();
        redo();
        return;
      }

      if (key === "delete" || key === "backspace") {
        event.preventDefault();
        deleteSelected();
      }

      if (key === "escape") {
        setPendingMeasurementStart(null);
        setPendingCalibrationStart(null);
        setCalibrationDraft(null);
        setShowNewProjectDialog(false);
        setActiveTool("select");
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [editorHistory, selection, selectedFigure, calibrationDraft]);

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <TopToolbar
        onAddRectangle={addRectangle}
        onAddText={addText}
        onAddArrow={addArrow}
        onImportImageFile={importImageFile}
        onImportBackgroundImageFile={importBackgroundImageFile}
        onClearBackgroundImage={clearBackgroundImage}
        hasBackgroundImage={backgroundImage !== null}
        onDeleteSelected={deleteSelected}
        hasSelection={selection !== null}
        activeTool={activeTool}
        onChangeActiveTool={changeActiveTool}
        onClearMeasurements={clearMeasurements}
        hasMeasurements={measurements.length > 0}
        snapToGrid={snapToGrid}
        onToggleSnapToGrid={() => setSnapToGrid((current) => !current)}
        onNewProject={openNewProjectDialog}
        onSaveProject={saveProject}
        onLoadProjectFile={loadProjectFile}
        onImportCreatorJson={handleImportCreatorJson}
        onExportPng={exportPng}
        exportFormat={exportFormat}
        onChangeExportFormat={setExportFormat}
        zoomPercent={zoomPercent}
        onZoomIn={zoomIn}
        onZoomOut={zoomOut}
        onResetZoom={resetZoom}
        onUndo={undo}
        onRedo={redo}
        canUndo={editorHistory.canUndo}
        canRedo={editorHistory.canRedo}
        printPreview={printPreview}
        onTogglePrintPreview={() => setPrintPreview((current) => !current)}
        showHelperLines={showHelperLines}
        onToggleShowHelperLines={() =>
          setShowHelperLines((current) => !current)
        }
      />

      <div
        style={{
          flex: 1,
          minHeight: 0,
          display: "flex",
        }}
      >
        <LeftInspector
          selectedRect={selectedRect}
          selectedFigure={selectedFigure}
          selectedFigureTemplate={selectedFigureTemplate}
          selectedDecoration={selectedDecoration}
          selectedFigureWarning={selectedFigureWarning}
          figureWarningCount={figureBoundsWarnings.length}
          backgroundImage={backgroundImage}
          onUpdateSelectedRect={updateSelectedRect}
          onUpdateSelectedFigure={updateSelectedFigure}
          onUpdateSelectedDecoration={updateSelectedDecoration}
          onUpdateBackgroundImage={updateBackgroundImagePatch}
          onDuplicateSelectedFigure={duplicateSelectedFigure}
          onMirrorSelectedFigure={mirrorSelectedFigure}
          courseValidation={courseValidation}
        />

        <div
          style={{
            flex: 1,
            minWidth: 0,
            position: "relative",
            display: "flex",
          }}
        >
          <EditorCanvas
            ref={editorCanvasRef}
            rects={rects}
            figures={figures}
            decorations={decorations}
            measurements={measurements}
            backgroundImage={backgroundImage}
            metadata={metadata}
            pendingMeasurementStart={pendingMeasurementStart}
            pendingCalibrationStart={pendingCalibrationStart}
            activeTool={activeTool}
            figureTemplates={figureTemplates}
            selection={selection}
            disconnectedRectIds={courseValidation.disconnectedRectIds}
            figureWarningIds={figureWarningIds}
            onSelect={setSelection}
            onCanvasPointClick={handleCanvasPointClick}
            onChangeRects={changeRects}
            onUpdateFigure={updateFigure}
            onUpdateDecoration={updateDecoration}
            onUpdateBackgroundImage={updateBackgroundImage}
            snapToGrid={snapToGrid}
            showGrid={!printPreview}
            showCourseFill={!printPreview}
            showHelperLines={!printPreview && showHelperLines}
            showEditorDecorations={!printPreview}
            exportBoundsMeters={exportBounds}
            exportFrameLabel={exportFrameLabel}
            zoom={zoom}
            viewPosition={viewPosition}
            onChangeZoom={setZoom}
            onChangeViewPosition={setViewPosition}
          />

          {!printPreview && (
            <ProjectMetadataPanel
              metadata={metadata}
              onUpdateMetadata={updateMetadata}
            />
          )}
        </div>

        <RightFigureLibrary
          figureTemplates={figureTemplates}
          onAddFigure={addFigure}
        />
      </div>

      {calibrationDraft && (
        <CalibrationDialog
          measuredDistanceMeters={calibrationDraft.measuredDistanceMeters}
          onApply={applyCalibration}
          onCancel={cancelCalibration}
        />
      )}

      {showNewProjectDialog && (
        <NewProjectDialog
          onConfirm={confirmNewProject}
          onCancel={() => setShowNewProjectDialog(false)}
        />
      )}
    </div>
  );
}

function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
      } else {
        reject(new Error("Could not read image file."));
      }
    };

    reader.onerror = () => {
      reject(new Error("Could not read image file."));
    };

    reader.readAsDataURL(file);
  });
}

function getImageSize(src: string) {
  return new Promise<{ width: number; height: number }>((resolve) => {
    const image = new Image();

    image.onload = () => {
      resolve({
        width: image.naturalWidth,
        height: image.naturalHeight,
      });
    };

    image.onerror = () => {
      resolve({
        width: 1,
        height: 1,
      });
    };

    image.src = src;
  });
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}