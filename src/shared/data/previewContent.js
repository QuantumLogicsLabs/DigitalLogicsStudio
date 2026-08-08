import React from "react";

export const PREVIEW_MAPPINGS = {
  "/boolean/identities": {
    title: "Boolean Identities Quick Reference",
    type: "inline-preview",
    component: (
      <div className="preview-card">
        <h3>Essential Boolean Identities</h3>
        <ul>
          <li><strong>Identity:</strong> A · 1 = A, A + 0 = A</li>
          <li><strong>Null:</strong> A · 0 = 0, A + 1 = 1</li>
          <li><strong>Idempotent:</strong> A · A = A, A + A = A</li>
          <li><strong>Inverse:</strong> A · A' = 0, A + A' = 1</li>
        </ul>
      </div>
    ),
  },
};
