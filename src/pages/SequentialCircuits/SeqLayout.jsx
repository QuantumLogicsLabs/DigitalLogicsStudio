import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import {
  BookOpen,
  Lock,
  ToggleRight,
  Layers,
  Microscope,
  Blocks,
  Waypoints,
  Zap,
} from "lucide-react";
import './SeqLayout.css';
import SeqTopbar from "./components/SeqTopbar";
import SeqSidebar from "./components/SeqSidebar";
import SeqMain from "./components/SeqMain";

const seqPages = [
  { path: "/sequential/intro", label: "Introduction", icon: <BookOpen size={18} />, short: "Intro" },
  { path: "/sequential/latches", label: "Latches", icon: <Lock size={18} />, short: "Latches" },
  { path: "/sequential/flip-flops", label: "Flip-Flops", icon: <ToggleRight size={18} />, short: "Flip-Flops" },
  { path: "/sequential/flip-flop-types", label: "Types of Flip-Flops", icon: <Layers size={18} />, short: "FF Types" },
  { path: "/sequential/analysis", label: "Analysis", icon: <Microscope size={18} />, short: "Analysis" },
  { path: "/sequential/design-procedures", label: "Design Procedures", icon: <Blocks size={18} />, short: "Design" },
  { path: "/sequential/state-diagram", label: "State Diagrams & Tables", icon: <Waypoints size={18} />, short: "States" },
  { path: "/sequential/state-reduction", label: "State Reduction & Excitation", icon: <Zap size={18} />, short: "Reduction" },
];

const SeqLayout = ({ children, title, subtitle }) => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const currentIndex = seqPages.findIndex((p) => p.path === location.pathname);
  const prev = seqPages[currentIndex - 1];
  const next = seqPages[currentIndex + 1];
  const progress = Math.round(((currentIndex + 1) / seqPages.length) * 100);

  return (
    <div className="seq-layout" data-component="sequential-layout">
      <div className="seq-bg-blob seq-bg-blob-1" />
      <div className="seq-bg-blob seq-bg-blob-2" />
      <div className="seq-bg-blob seq-bg-blob-3" />

      <SeqTopbar seqPages={seqPages} currentIndex={currentIndex} progress={progress} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="seq-body">
        {sidebarOpen && <div className="seq-overlay" onClick={() => setSidebarOpen(false)} />}

        <SeqSidebar seqPages={seqPages} currentIndex={currentIndex} progress={progress} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <SeqMain seqPages={seqPages} currentIndex={currentIndex} prev={prev} next={next} title={title} subtitle={subtitle} children={children} />
      </div>
    </div>
  );
};

export default SeqLayout;
