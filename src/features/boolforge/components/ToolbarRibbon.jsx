import React, { useState, useEffect, useRef } from "react";
import {
  Undo2,
  Redo2,
  Trash2,
  FolderOpen,
  MousePointer2,
  Wand2,
  Sun,
  Moon,
  Magnet,
  Grid3x3,
  Bot,
  Menu,
  // Sparkles,
  // Lightbulb,
  // X,
  Zap,
  Activity,
  // Table2,
  MessageSquare,
  History,
  Settings2,
  HelpCircle,
  Info,
  Keyboard,
  Boxes,
  Cable,
  LogIn,
  LogOut,
  Check,
} from "lucide-react";
import { RibbonMenu, RibbonMenuSection, RibbonMenuItem, RibbonMenuDivider, SoonBadge } from "./RibbonMenu";
import { useToast } from "../../../shared/context/ToastContext";
import { layoutGeneratedCircuit } from "../utils/layoutGeneratedCircuit";
import { useSaveAndLoad, SaveLoadMenuItems, SaveLoadDialogs } from "./SaveAndLoad";

export const ToolbarRibbon = ({
  embedded,
  containerRef,
  // AI
  aiPrompt,
  setAiPrompt,
  handleRequestHint,
  hintLoading,
  handleGenerateCircuit,
  isGenLoading,
  hint,
  hintError,
  setHint,
  setHintError,
  // inputs/outputs
  inputGates,
  outputGates,
  wires,
  toggleInput,
  evaluateGate,
  // truth table
  truthTable,
  // history
  undo,
  redo,
  historyIndex,
  history,
  // save/load (multi-sheet project)
  gates,
  setGates,
  sheets,
  loadSheets,
  saveToHistory,
  clearCircuit,
  // view
  selectionToolActive,
  setSelectionToolActive,
  // theme 
  theme,
  toggleTheme,

  onToggleFullScreen,
  showSimulate,
  onToggleSimulate,
  showAI,
  onToggleAI,

  snapEnabled,
  setSnapEnabled,
  showGridOverlay,
  setShowGridOverlay,
  canCreateComponent,
  onOpenCreateComponent,
  customComponents = [],
  addGate,
  onDeleteComponent,
  
  // comments
  handleAddComment,

  // mobile sidebar drawer toggle (hamburger button, only visible <=900px)
  onToggleSidebar,
}) => {
  const toast = useToast();
  const [openMenu, setOpenMenu] = useState(null);
  const [showCustomLibrary, setShowCustomLibrary] = useState(false);
  const ribbonRef = useRef(null);
  const saveLoad = useSaveAndLoad({ sheets, loadSheets });

  const toggleMenu = (name) => setOpenMenu((m) => (m === name ? null : name));
  const closeMenu = () => setOpenMenu(null);

  useEffect(() => {
    if (!openMenu) return;
    const onDocMouseDown = (e) => {
      if (ribbonRef.current && !ribbonRef.current.contains(e.target)) closeMenu();
    };
    const onKeyDown = (e) => {
      if (e.key === "Escape") closeMenu();
    };
    document.addEventListener("mousedown", onDocMouseDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onDocMouseDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [openMenu]);

  const notReady = (feature) => {
    toast.warning(`${feature} is on the roadmap — not wired up yet.`);
  };

  const handleAutoArrange = () => {
    if (!gates.length) {
      toast.warning?.("Nothing to arrange yet — add some gates first.");
      return;
    }
    setGates((prev) => layoutGeneratedCircuit(prev, wires));
    setTimeout(() => saveToHistory(), 0);
    closeMenu();
  };

  const handleExportPNG = () => {
    const container = containerRef?.current;
    const gatesEl = container?.querySelector(".gates-container");
    if (!container || !gatesEl) return;

    const width = container.clientWidth;
    const height = container.clientHeight;
    const bg = getComputedStyle(container).backgroundColor || "#0a0e1a";

    const svgString = `
      <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
        <foreignObject width="100%" height="100%">
          <div xmlns="http://www.w3.org/1999/xhtml" style="width:${width}px;height:${height}px;background:${bg}">
            ${gatesEl.outerHTML}
          </div>
        </foreignObject>
      </svg>`;

    const url = URL.createObjectURL(new Blob([svgString], { type: "image/svg+xml;charset=utf-8" }));
    const img = new Image();
    img.onload = () => {
      const out = document.createElement("canvas");
      out.width = width * 2;
      out.height = height * 2;
      const ctx = out.getContext("2d");
      ctx.scale(2, 2);
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, width, height);
      ctx.drawImage(img, 0, 0, width, height);
      URL.revokeObjectURL(url);
      out.toBlob((blob) => {
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = `boolforge-circuit-${Date.now()}.png`;
        a.click();
      });
    };
    img.onerror = () => {
      toast.error("Couldn't export the image — try a smaller circuit.");
      URL.revokeObjectURL(url);
    };
    img.src = url;
  };

  return (
    <div className="toolbar-ribbon" ref={ribbonRef}>
      {/* ── Mobile-only: open the components (Sidebar) drawer ─────────── */}
      {onToggleSidebar && (
        <button
          type="button"
          className="ribbon-button ribbon-button--icon ribbon-mobile-menu-btn"
          onClick={onToggleSidebar}
          title="Toggle components panel"
          aria-label="Toggle components panel"
        >
          <Menu size={16} strokeWidth={2} />
        </button>
      )}

      {/* ── Edit: undo / redo / clear ───────────────────────────────── */}
      <div className="ribbon-group">
        <button className="ribbon-button ribbon-button--icon" onClick={undo} disabled={historyIndex <= 0} title="Undo (Ctrl+Z)">
          <Undo2 size={16} strokeWidth={2} />
        </button>
        <button
          className="ribbon-button ribbon-button--icon"
          onClick={redo}
          disabled={historyIndex >= history.length - 1}
          title="Redo (Ctrl+Shift+Z)"
        >
          <Redo2 size={16} strokeWidth={2} />
        </button>
        <button className="ribbon-button ribbon-button--icon ribbon-button--danger" onClick={clearCircuit} title="Clear All">
          <Trash2 size={16} strokeWidth={2} />
        </button>
      </div>

      <div className="ribbon-divider" />

      {/* ── File ─────────────────────────────────────────────────────── */}
      <RibbonMenu label="File" icon={FolderOpen} isOpen={openMenu === "file"} onToggle={() => toggleMenu("file")}>
        <RibbonMenuSection title="Project">
          <SaveLoadMenuItems 
            api={saveLoad} 
            onExportPNG={handleExportPNG} 
            closeMenu={closeMenu} 
          />
          <RibbonMenuItem
            icon={Boxes}
            label="Create Component"
            description={canCreateComponent ? "Save your selection as a reusable block" : "Select at least one INPUT and one OUTPUT first"}
            disabled={!canCreateComponent}
            onClick={() => {
              onOpenCreateComponent();
              closeMenu();
            }}
          />
        </RibbonMenuSection>
               <RibbonMenuDivider />
        <RibbonMenuSection title="History">
          <RibbonMenuItem
            icon={History}
            label="Version History"
            description="Browse past saves"
            trailing={<SoonBadge />}
            onClick={() => notReady("Version history")}
          />
        </RibbonMenuSection>
      </RibbonMenu>

      {/* ── View ─────────────────────────────────────────────────────── */}
      <RibbonMenu label="View" icon={Settings2} isOpen={openMenu === "view"} onToggle={() => toggleMenu("view")}>
        <RibbonMenuSection title="Canvas">
          <RibbonMenuItem
            icon={MousePointer2}
            label="Selection Tool"
            description="Box-select multiple components"
            active={selectionToolActive}
            trailing={selectionToolActive ? <Check size={14} /> : null}
            onClick={() => {
              setSelectionToolActive((v) => !v);
              closeMenu();
            }}
          />
          <RibbonMenuItem icon={Wand2} label="Auto-Arrange" description="Re-flow gates by signal flow" onClick={handleAutoArrange} />
          <RibbonMenuItem
            icon={theme === "light" ? Moon : Sun}
            label={theme === "light" ? "Dark Mode" : "Light Mode"}
            description="Switch the app color theme"
            onClick={() => {
              toggleTheme?.();
              closeMenu();
            }}
          />
        </RibbonMenuSection>
        <RibbonMenuDivider />
        <RibbonMenuSection title="Grid">
          <RibbonMenuItem
            icon={Magnet}
            label="Snap to Grid"
            description="Align dragged gates to the grid"
            active={snapEnabled}
            trailing={snapEnabled ? <Check size={14} /> : null}
            onClick={() => setSnapEnabled((v) => !v)}
          />
          <RibbonMenuItem
            icon={Grid3x3}
            label="Show Grid Overlay"
            description="Toggle the background grid lines"
            active={showGridOverlay}
            trailing={showGridOverlay ? <Check size={14} /> : null}
            onClick={() => setShowGridOverlay((v) => !v)}
          />
        </RibbonMenuSection>
      </RibbonMenu>

      <div className="ribbon-divider" />

      <button
        className={`ribbon-button${showSimulate ? " ribbon-button--active" : ""}`}
        onClick={onToggleSimulate}
        title="Toggle Simulate panel"
      >
        <Activity size={15} strokeWidth={2} className="ribbon-btn-icon" />
        <span>Simulate</span>
      </button>

      <div className="ribbon-divider" />

      {!embedded && (
        <button
          className={`ribbon-button${showAI ? " ribbon-button--active" : ""}`}
          onClick={onToggleAI}
          title="Toggle AI Assistant panel"
        >
          <Bot size={15} strokeWidth={2} className="ribbon-btn-icon" />
          <span>AI</span>
        </button>
      )}

      {/* ── Tools ───────── */}
            <RibbonMenu label="Tools" icon={Zap} isOpen={openMenu === "tools"} onToggle={() => toggleMenu("tools")} badge="1">
               <RibbonMenuSection title="Custom Library">
          <RibbonMenuItem
            icon={Boxes}
            label={showCustomLibrary ? "Hide my components" : "My Components"}
            description={`${customComponents.length} saved component${customComponents.length === 1 ? "" : "s"}`}
            onClick={() => setShowCustomLibrary((v) => !v)}
          />
          {showCustomLibrary && (
            customComponents.length === 0 ? (
              <p className="ribbon-help-text">
                No saved components yet — select a portion of your circuit with at least one INPUT and one OUTPUT, then use File → Create Component.
              </p>
            ) : (
              customComponents.map((c) => (
                <div key={c.id} style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                  <div style={{ flex: 1 }}>
                    <RibbonMenuItem
                      icon={Boxes}
                      label={c.name}
                      description={`${c.inputs.length} input(s), ${c.outputs.length} output(s)`}
                      onClick={() => {
                        addGate(`CUSTOM_${c.id}`);
                        closeMenu();
                      }}
                    />
                  </div>
                  <button
                    className="gate-btn"
                    style={{ width: "26px", height: "26px", padding: 0, flexShrink: 0 }}
                    title="Delete this component"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteComponent(c.id, c.name);
                    }}
                  >
                    🗑
                  </button>
                </div>
              ))
            )
          )}
        </RibbonMenuSection>
        <RibbonMenuDivider />
        <RibbonMenuSection title="Annotations">
          <RibbonMenuItem
            icon={MessageSquare}
            label="Add Comment"
            description="Leave notes on the circuit"
            onClick={() => {
              if (handleAddComment) handleAddComment();
              closeMenu();
            }}
          />
        </RibbonMenuSection>
      </RibbonMenu>

      {/* ── Help / About ─────────────────────────────────────────────── */}
      <RibbonMenu label="Help" icon={HelpCircle} isOpen={openMenu === "help"} onToggle={() => toggleMenu("help")} wide>
        <RibbonMenuSection title="About Boolforge">
          <p className="ribbon-help-text">
            <Info size={14} strokeWidth={2} style={{ marginRight: 6, verticalAlign: -2 }} />
            Boolforge is a visual digital-logic editor: place gates, wire them
            up, and see truth tables and outputs update live. Multiple sheets
            let you build several circuits in one project.
          </p>
        </RibbonMenuSection>
        <RibbonMenuDivider />
        <RibbonMenuSection title="Controls">
          <ul className="ribbon-help-list">
            <li>Click a palette button to add a component</li>
            <li>Drag gates to move them (group drag supported)</li>
            <li>Drag empty space to pan the canvas</li>
            <li>Enable Selection Tool to box-select components</li>
            <li>Hold Space or drag with the middle button to pan anytime</li>
            <li>Ctrl + Click to add/remove individual gates from selection</li>
            <li>Click an output dot then an input dot to wire them</li>
            <li>Right-click a wire to delete it</li>
            <li>Right-click a gate to delete it (deletes selection)</li>
            <li>Double-click a gate to rename it</li>
            <li>Scroll to zoom in or out</li>
            <li>Use + / − on a gate to resize its inputs</li>
          </ul>
        </RibbonMenuSection>
        <RibbonMenuDivider />
        <RibbonMenuSection title="Keyboard Shortcuts">
          <ul className="ribbon-help-list ribbon-help-list--shortcuts">
            <li>
              <Keyboard size={13} strokeWidth={2} /> <kbd>Ctrl</kbd>+<kbd>Z</kbd> Undo
            </li>
            <li>
              <Keyboard size={13} strokeWidth={2} /> <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>Z</kbd> Redo
            </li>
            <li>
              <Keyboard size={13} strokeWidth={2} /> <kbd>Ctrl</kbd>+<kbd>A</kbd> Select All
            </li>
            <li>
              <Keyboard size={13} strokeWidth={2} /> <kbd>Ctrl</kbd>+<kbd>D</kbd> Duplicate
            </li>
            <li>
              <Keyboard size={13} strokeWidth={2} /> <kbd>Ctrl</kbd>+<kbd>C</kbd> / <kbd>Ctrl</kbd>+<kbd>V</kbd> Copy / Paste
            </li>
            <li>
              <Keyboard size={13} strokeWidth={2} /> <kbd>Delete</kbd> / <kbd>Backspace</kbd> Remove selected
            </li>
            <li>
              <Keyboard size={13} strokeWidth={2} /> <kbd>Esc</kbd> Cancel wire / clear selection
            </li>
          </ul>
        </RibbonMenuSection>
      </RibbonMenu>

      {onToggleFullScreen && (
        <button
          onClick={onToggleFullScreen}
          className="home-navbar-toggle-btn"
          aria-label="Hide navbar"
          title="Hide navbar"
         >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <line x1="3" y1="9" x2="21" y2="9" />
          </svg>
        </button>
      )}

      {/* ── Stats ────────────────────────────────────────────────────── */}
      <div className="ribbon-stats">
        <span title="Gates">
          <Boxes size={13} strokeWidth={2} /> {gates.length}
        </span>
        <span title="Wires">
          <Cable size={13} strokeWidth={2} /> {wires.length}
        </span>
        <span title="Inputs">
          <LogIn size={13} strokeWidth={2} /> {inputGates.length}
        </span>
        <span title="Outputs">
          <LogOut size={13} strokeWidth={2} /> {outputGates.length}
        </span>
      </div>

      <SaveLoadDialogs api={saveLoad} />
      
    </div>
  );
};