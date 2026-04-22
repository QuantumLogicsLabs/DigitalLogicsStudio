# Boolforge -- Logic Gate Simulator (React)

A professional logic gate simulator built with **React**, featuring
drag-and-drop gates, wire connections, real-time evaluation, truth table
generation, and circuit save/load.

------------------------------------------------------------------------

## ✨ Features

-   🎨 **Interactive Canvas** -- Drag and drop logic gates on a
    grid-based canvas\
-   🔌 **Wire Connections** -- Connect gates by clicking output → input
    points\
-   🗑️ **Click to Delete Wires** -- Remove any wire with a single click\
-   ↶ **Undo / Redo** -- Full history system (up to 50 states)\
-   ⌨️ **Keyboard Shortcuts** -- Fast editing with familiar hotkeys\
-   📊 **Truth Table Generator** -- Automatically generate circuit truth
    tables\
-   💾 **Save / Load Circuits** -- Export and import designs as JSON\
-   ⚡ **Live Evaluation** -- Real-time logic updates with visual
    feedback\
-   🎯 **10 Logic Gate Types** -- INPUT, OUTPUT, AND, OR, NOT, NAND,
    NOR, XOR, XNOR, BUFFER\
-   🎮 **Smooth Interactions** -- Snap-to-grid, animations, glowing
    active wires

------------------------------------------------------------------------

## ⌨️ Keyboard Shortcuts
```

  Shortcut                     Action
  ---------------------------- -----------------------------
  Ctrl+Z / Cmd+Z               Undo last action
  Ctrl+Shift+Z / Cmd+Shift+Z   Redo action
  Ctrl+Y / Cmd+Y               Redo action (alternative)
  Delete / Backspace           Delete selected gate
  Escape                       Cancel wire connection mode

```
## 🚀 Setup

### Option 1: Quick Start (No Build Tools)

1.  Open `index-react.html` directly in your browser\
2.  Uses React via CDN and Babel standalone for JSX\
3.  Ideal for quick testing

### Option 2: Modern Development Setup (Recommended)

``` bash
npm install
npm run dev
npm run build
npm run preview
```

------------------------------------------------------------------------

## 🧠 Usage Guide

1.  **Add Gates** -- Use sidebar buttons\
2.  **Move Gates** -- Drag them around the canvas\
3.  **Connect Wires** -- Output → Input\
4.  **Delete Wires** -- Click directly on a wire\
5.  **Toggle Inputs** -- Use input switches\
6.  **View Outputs** -- Check truth table panel\
7.  **Delete Gates** -- Right-click a gate\
8.  **Generate Truth Table** -- Click "Update Table"\
9.  **Save Circuit** -- Export as JSON\
10. **Load Circuit** -- Import a saved design

------------------------------------------------------------------------

## 🏗️ Project Structure

    Boolforge/
    ├── public/
    ├── src/
    ├── .gitignore
    ├── LICENSE
    ├── README.md
    ├── package-lock.json
    └── package.json


------------------------------------------------------------------------

## ⚙️ Technologies

-   React 18\
-   HTML5 Canvas\
-   CSS Grid & Flexbox\
-   JavaScript ES6+\
-   Vite

------------------------------------------------------------------------

## 📝 Changelog

### \[2.0.0\] -- 2026-01-30

#### 🐛 Bug Fixes

-   Fixed broken wires by switching storage from object refs to gate IDs
-   Wires now persist across drag, delete, and load
-   Fixed stale closure issues in evaluation logic
-   Enabled canvas pointer events for wire deletion
-   Fixed connection point active state visuals
-   Corrected `useCallback` dependency arrays

#### ✨ New Features

-   Undo/Redo system with 50-state history
-   Keyboard shortcuts for undo, redo, delete, cancel
-   Click-to-delete wires
-   Visual undo/redo buttons
-   Improved sidebar instructions

#### 🎨 Improvements

-   Better immutable state management
-   Performance optimizations
-   Improved wire deletion UX
-   Clearer visual history feedback

------------------------------------------------------------------------

### \[1.0.0\] -- Initial Release

-   Drag-and-drop logic gate canvas
-   10 gate types
-   Wire connections
-   Real-time evaluation
-   Truth table generation
-   Circuit save/load
-   Cyberpunk UI theme
-   Animated glowing wires
-   Stats panel
-   Right-click gate deletion

------------------------------------------------------------------------

## 📄 License

Proprietary License -- Copyright (c) 2026 Muhammad Saad Amin. All Rights Reserved.

## 🙌 Credits

Original concept: **Boolforge**\
React conversion and enhancements: Modern React refactor
