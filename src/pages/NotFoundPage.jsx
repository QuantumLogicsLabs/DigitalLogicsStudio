import React from "react";
import { Link } from "react-router-dom";

const NotFoundPage = () => (
  <main
    style={{
      minHeight: "100vh",
      display: "grid",
      placeItems: "center",
      padding: "2rem",
      background:
        "radial-gradient(circle at top left, rgba(91,140,255,0.16), transparent 26%), linear-gradient(180deg, #050b16 0%, #0a1120 45%, #0c1528 100%)",
      color: "#e5edf8",
      textAlign: "center",
    }}
  >
    <section
      style={{
        width: "min(560px, 100%)",
        padding: "2rem",
        borderRadius: "24px",
        background: "rgba(11, 19, 36, 0.86)",
        border: "1px solid rgba(148, 163, 184, 0.18)",
        boxShadow: "0 18px 40px rgba(2, 6, 23, 0.35)",
      }}
    >
      <p style={{ margin: 0, color: "#9fb0c8", letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 700 }}>
        Page Not Found
      </p>
      <h1 style={{ margin: "0.8rem 0", fontSize: "clamp(2rem, 5vw, 3rem)" }}>
        This learning path doesn&apos;t exist yet.
      </h1>
      <p style={{ margin: "0 auto 1.4rem", color: "#c8d5e6", lineHeight: 1.8 }}>
        Return to the core digital logic topics, open the problem library, or continue with one of Boolforge&apos;s interactive tools.
      </p>
      <div style={{ display: "flex", justifyContent: "center", gap: "0.9rem", flexWrap: "wrap" }}>
        <Link
          to="/"
          style={{
            padding: "0.9rem 1.2rem",
            borderRadius: "999px",
            background: "rgba(91, 140, 255, 0.16)",
            color: "#e5edf8",
            textDecoration: "none",
            border: "1px solid rgba(99, 102, 241, 0.24)",
            fontWeight: 700,
          }}
        >
          Explore Topics
        </Link>
        <Link
          to="/problems"
          style={{
            padding: "0.9rem 1.2rem",
            borderRadius: "999px",
            background: "transparent",
            color: "#9fb0c8",
            textDecoration: "none",
            border: "1px solid rgba(148, 163, 184, 0.18)",
            fontWeight: 700,
          }}
        >
          Open Problems
        </Link>
      </div>
    </section>
  </main>
);

export default NotFoundPage;
