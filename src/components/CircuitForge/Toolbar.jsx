import React from "react";
import {
  Undo2,
  Redo2,
  Trash2,
  MousePointer2,
  Play,
  Save,
  FolderOpen,
  ZoomIn,
  ZoomOut,
  Grid3x3,
  Download,
  Sparkles,
} from "lucide-react";
import IconButton from "../../elements/IconButton";
import ToolbarDivider from "../../elements/ToolbarDivider";
import "./Toolbar.css";

export default function Toolbar({
  selectionMode,
  onToggleSelection,
  onUndo,
  onRedo,
  onClear,
  onRun,
  onSave,
  onLoad,
  onZoomIn,
  onZoomOut,
  onToggleGrid,
  gridOn,
  onExport,
  onOpenAssistant,
  canUndo,
  canRedo,
}) {
  return (
    <header className="cf-toolbar">
      <div className="cf-toolbar__group">
        <span className="cf-toolbar__title">CIRCUIT FORGE</span>
      </div>

      <ToolbarDivider />

      <div className="cf-toolbar__group">
        <IconButton
          icon={MousePointer2}
          label="Selection tool"
          active={selectionMode}
          onClick={onToggleSelection}
        />
        <IconButton icon={Undo2} label="Undo" onClick={onUndo} disabled={!canUndo} />
        <IconButton icon={Redo2} label="Redo" onClick={onRedo} disabled={!canRedo} />
        <IconButton icon={Trash2} label="Clear canvas" variant="danger" onClick={onClear} />
      </div>

      <ToolbarDivider />

      <div className="cf-toolbar__group">
        <IconButton icon={ZoomOut} label="Zoom out" onClick={onZoomOut} />
        <IconButton icon={ZoomIn} label="Zoom in" onClick={onZoomIn} />
        <IconButton icon={Grid3x3} label="Toggle grid" active={gridOn} onClick={onToggleGrid} />
      </div>

      <div className="cf-toolbar__spacer" />

      <div className="cf-toolbar__group">
        <IconButton icon={FolderOpen} label="Load project" onClick={onLoad} />
        <IconButton icon={Save} label="Save project" onClick={onSave} />
        <IconButton icon={Download} label="Export" onClick={onExport} />
      </div>

      <ToolbarDivider />

      <button type="button" className="cf-toolbar__run" onClick={onRun}>
        <Play size={15} strokeWidth={2.2} />
        Simulate
      </button>

      <button type="button" className="cf-toolbar__assistant" onClick={onOpenAssistant}>
        <Sparkles size={15} strokeWidth={2.2} />
        BoolMentor AI
      </button>
    </header>
  );
}
