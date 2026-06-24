import type { ChangeEvent } from "react";
import type { CourseRect } from "../types/CourseRect";
import type { CourseValidation } from "../course/validateConnectedCourse";
import type { FigureInstance, FigureTemplate } from "../types/Figure";
import type { Selection } from "../types/Selection";

type SidebarProps = {
  onAddRectangle: () => void;
  onDeleteSelected: () => void;
  onSaveProject: () => void;
  onLoadProjectFile: (file: File) => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  selection: Selection | null;
  selectedRect: CourseRect | null;
  selectedFigure: FigureInstance | null;
  selectedFigureTemplate: FigureTemplate | null;
  onUpdateSelectedRect: (patch: Partial<CourseRect>) => void;
  onUpdateSelectedFigure: (patch: Partial<FigureInstance>) => void;
  onDuplicateSelectedFigure: () => void;
  onMirrorSelectedFigure: () => void;
  onAddFigure: (templateId: string) => void;
  figureTemplates: FigureTemplate[];
  courseValidation: CourseValidation;
  printPreview: boolean;
  onTogglePrintPreview: () => void;
  showHelperLines: boolean;
  onToggleShowHelperLines: () => void;
};

export function Sidebar({
  onAddRectangle,
  onDeleteSelected,
  onSaveProject,
  onLoadProjectFile,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  selection,
  selectedRect,
  selectedFigure,
  selectedFigureTemplate,
  onUpdateSelectedRect,
  onUpdateSelectedFigure,
  onDuplicateSelectedFigure,
  onMirrorSelectedFigure,
  onAddFigure,
  figureTemplates,
  courseValidation,
  printPreview,
  onTogglePrintPreview,
  showHelperLines,
  onToggleShowHelperLines,
}: SidebarProps) {
  const hasSelection = selection !== null;

  function handleLoadFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (file) {
      onLoadProjectFile(file);
    }

    event.target.value = "";
  }

  return (
    <aside
      style={{
        width: 280,
        padding: 16,
        borderRight: "1px solid #ccc",
        boxSizing: "border-box",
        fontFamily: "sans-serif",
        overflowY: "auto",
      }}
    >
      <h2>Streckentool</h2>

      <button onClick={onAddRectangle}>Add rectangle</button>

      <br />
      <br />

      <button onClick={onDeleteSelected} disabled={!hasSelection}>
        Delete selected
      </button>

      <hr style={{ margin: "18px 0" }} />

      <button onClick={onUndo} disabled={!canUndo}>
        Undo
      </button>

      <br />
      <br />

      <button onClick={onRedo} disabled={!canRedo}>
        Redo
      </button>

      <p style={{ marginTop: 8, fontSize: 12, color: "#555" }}>
        Shortcuts: Ctrl+Z / Ctrl+Y
      </p>

      <hr style={{ margin: "18px 0" }} />

      <button onClick={onSaveProject}>Save project</button>

      <br />
      <br />

      <label>
        <span
          style={{
            display: "inline-block",
            padding: "3px 8px",
            border: "1px solid #999",
            borderRadius: 2,
            background: "#eee",
            cursor: "pointer",
            fontSize: 13,
          }}
        >
          Load project
        </span>

        <input
          type="file"
          accept="application/json,.json"
          onChange={handleLoadFile}
          style={{ display: "none" }}
        />
      </label>

      <hr style={{ margin: "18px 0" }} />

      <section>
        <h3>Display</h3>

        <label style={{ display: "block", marginBottom: 8, fontSize: 14 }}>
          <input
            type="checkbox"
            checked={printPreview}
            onChange={onTogglePrintPreview}
            style={{ marginRight: 8 }}
          />
          Print preview
        </label>

        <label style={{ display: "block", marginBottom: 8, fontSize: 14 }}>
          <input
            type="checkbox"
            checked={showHelperLines}
            onChange={onToggleShowHelperLines}
            disabled={printPreview}
            style={{ marginRight: 8 }}
          />
          Show helper lines
        </label>

        <p style={{ margin: 0, fontSize: 12, color: "#555" }}>
          Print preview hides course fill, helper lines, and selection guides.
        </p>
      </section>

      <section
        style={{
          marginTop: 24,
          padding: 10,
          borderRadius: 6,
          background: courseValidation.isValid ? "#e8f5e9" : "#ffebee",
          border: courseValidation.isValid
            ? "1px solid #81c784"
            : "1px solid #e57373",
          fontSize: 14,
        }}
      >
        <strong>
          {courseValidation.isValid ? "Valid course" : "Invalid course"}
        </strong>

        {courseValidation.messages.map((message) => (
          <p key={message} style={{ margin: "6px 0 0" }}>
            {message}
          </p>
        ))}
      </section>

      <p style={{ marginTop: 24, fontSize: 14 }}>
        Drag and resize rectangles. One grid square is currently one meter.
      </p>

      <hr style={{ margin: "18px 0" }} />

      <section>
        <h3>Figure library</h3>

        {figureTemplates.map((template) => (
          <button
            key={template.id}
            onClick={() => onAddFigure(template.id)}
            style={{
              display: "block",
              width: "100%",
              marginBottom: 8,
              textAlign: "left",
            }}
            title={template.description}
          >
            {template.name}
          </button>
        ))}
      </section>

      {selectedRect && (
        <section style={{ marginTop: 24 }}>
          <h3>Selected rectangle</h3>

          <NumberInput
            label="X position (m)"
            value={selectedRect.x}
            onChange={(value) => onUpdateSelectedRect({ x: value })}
          />

          <NumberInput
            label="Y position (m)"
            value={selectedRect.y}
            onChange={(value) => onUpdateSelectedRect({ y: value })}
          />

          <NumberInput
            label="Width (m)"
            value={selectedRect.width}
            min={1}
            onChange={(value) => onUpdateSelectedRect({ width: value })}
          />

          <NumberInput
            label="Height (m)"
            value={selectedRect.height}
            min={1}
            onChange={(value) => onUpdateSelectedRect({ height: value })}
          />
        </section>
      )}

      {selectedFigure && selectedFigureTemplate && (
        <section style={{ marginTop: 24 }}>
          <h3>Selected figure</h3>

          <p style={{ fontSize: 14 }}>
            <strong>{selectedFigureTemplate.name}</strong>
          </p>

          <NumberInput
            label="X position (m)"
            value={selectedFigure.x}
            onChange={(value) => onUpdateSelectedFigure({ x: value })}
          />

          <NumberInput
            label="Y position (m)"
            value={selectedFigure.y}
            onChange={(value) => onUpdateSelectedFigure({ y: value })}
          />

          <NumberInput
            label="Rotation (°)"
            value={selectedFigure.rotation}
            min={-360}
            onChange={(value) => onUpdateSelectedFigure({ rotation: value })}
          />

          <ColorInput
            label="Cone color"
            value={selectedFigure.coneColor}
            onChange={(value) => onUpdateSelectedFigure({ coneColor: value })}
          />

          <button
            onClick={() =>
              onUpdateSelectedFigure({
                rotation: selectedFigure.rotation - 15,
              })
            }
          >
            Rotate -15°
          </button>

          <br />
          <br />

          <button
            onClick={() =>
              onUpdateSelectedFigure({
                rotation: selectedFigure.rotation + 15,
              })
            }
          >
            Rotate +15°
          </button>

          <br />
          <br />

          <button onClick={onMirrorSelectedFigure}>Mirror figure</button>

          <br />
          <br />

          <button onClick={onDuplicateSelectedFigure}>Duplicate figure</button>
        </section>
      )}
    </aside>
  );
}

type NumberInputProps = {
  label: string;
  value: number;
  min?: number;
  onChange: (value: number) => void;
};

function NumberInput({ label, value, min = 0, onChange }: NumberInputProps) {
  return (
    <label
      style={{
        display: "block",
        marginBottom: 12,
        fontSize: 14,
      }}
    >
      {label}
      <input
        type="number"
        value={value}
        min={min}
        step={0.5}
        onChange={(event) => {
          const nextValue = Number(event.target.value);

          if (Number.isFinite(nextValue)) {
            onChange(Math.max(min, nextValue));
          }
        }}
        style={{
          display: "block",
          width: "100%",
          marginTop: 4,
          boxSizing: "border-box",
        }}
      />
    </label>
  );
}

type ColorInputProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
};

function ColorInput({ label, value, onChange }: ColorInputProps) {
  return (
    <label
      style={{
        display: "block",
        marginBottom: 12,
        fontSize: 14,
      }}
    >
      {label}
      <input
        type="color"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        style={{
          display: "block",
          width: "100%",
          marginTop: 4,
          height: 36,
          boxSizing: "border-box",
        }}
      />
    </label>
  );
}