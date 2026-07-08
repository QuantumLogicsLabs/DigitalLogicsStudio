import { useEffect, useRef } from "react";

const hexToRgb = (hex) => {
  let cleaned = hex.replace("#", "");
  if (cleaned.length === 3) {
    cleaned = cleaned
      .split("")
      .map((char) => char + char)
      .join("");
  }

  const value = parseInt(cleaned, 16);
  const r = (value >> 16) & 255;
  const g = (value >> 8) & 255;
  const b = value & 255;

  return { r, g, b };
};

const toRgba = (hex, alpha = 0.24) => {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export default function usePointerGlow({ color = "#60a5fa", alpha = 0.24, selector = ".learning-resources-glow-card" } = {}) {
  const rootRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;

    const glowColor = toRgba(color, alpha);
    let activeCard = null;

    const resetCard = (card) => {
      if (!card) return;
      card.style.setProperty("--pointer-glow-opacity", "0");
    };

    const handlePointerMove = (event) => {
      const card = event.target.closest(selector);
      if (!card || !root.contains(card)) {
        if (activeCard) {
          resetCard(activeCard);
          activeCard = null;
        }
        return;
      }

      if (activeCard !== card && activeCard) {
        resetCard(activeCard);
      }
      activeCard = card;

      const rect = card.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      card.style.setProperty("--pointer-glow-x", `${x}px`);
      card.style.setProperty("--pointer-glow-y", `${y}px`);
      card.style.setProperty("--pointer-glow-color", glowColor);
      card.style.setProperty("--pointer-glow-opacity", "1");
    };

    const handlePointerLeave = (event) => {
      const card = event.target.closest(selector);
      if (card && root.contains(card)) {
        resetCard(card);
      }
    };

    root.addEventListener("pointermove", handlePointerMove);
    root.addEventListener("pointerleave", handlePointerLeave, true);
    root.addEventListener("pointercancel", handlePointerLeave, true);

    return () => {
      root.removeEventListener("pointermove", handlePointerMove);
      root.removeEventListener("pointerleave", handlePointerLeave, true);
      root.removeEventListener("pointercancel", handlePointerLeave, true);
    };
  }, [color, alpha, selector]);

  return rootRef;
}
