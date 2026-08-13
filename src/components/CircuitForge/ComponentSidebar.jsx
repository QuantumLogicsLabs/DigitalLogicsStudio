import React, { useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";
import SearchInput from "../../elements/SearchInput";
import GateCard from "../../elements/GateCard";
import { GATE_CATEGORIES, ALL_GATES } from "../../utils/gateDefinitions";
import "./ComponentSidebar.css";

export default function ComponentSidebar({ onAddGate }) {
  const [query, setQuery] = useState("");
  const [openCategories, setOpenCategories] = useState(
    () => new Set(GATE_CATEGORIES.map((c) => c.id))
  );

  const toggleCategory = (id) => {
    setOpenCategories((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const searchResults = useMemo(() => {
    if (!query.trim()) return null;
    const q = query.trim().toLowerCase();
    return ALL_GATES.filter((g) => g.label.toLowerCase().includes(q));
  }, [query]);

  return (
    <aside className="cf-sidebar">
      <div className="cf-sidebar__search">
        <SearchInput value={query} onChange={setQuery} />
      </div>

      <div className="cf-sidebar__scroll">
        {searchResults ? (
          <div className="cf-sidebar__section">
            <p className="cf-sidebar__section-label">
              {searchResults.length} result{searchResults.length !== 1 ? "s" : ""}
            </p>
            <div className="cf-sidebar__grid">
              {searchResults.map((gate) => (
                <GateCard key={gate.type} gate={gate} onAdd={onAddGate} />
              ))}
            </div>
          </div>
        ) : (
          GATE_CATEGORIES.map((cat) => {
            const isOpen = openCategories.has(cat.id);
            return (
              <div className="cf-sidebar__section" key={cat.id}>
                <button
                  type="button"
                  className="cf-sidebar__section-header"
                  onClick={() => toggleCategory(cat.id)}
                  style={{ "--accent": cat.accent }}
                >
                  <span className="cf-sidebar__section-dot" />
                  <span className="cf-sidebar__section-label">{cat.label}</span>
                  <ChevronDown
                    size={14}
                    className={`cf-sidebar__chevron ${isOpen ? "is-open" : ""}`}
                  />
                </button>
                {isOpen && (
                  <div className="cf-sidebar__grid">
                    {cat.gates.map((gate) => (
                      <GateCard
                        key={gate.type}
                        gate={{ ...gate, accent: cat.accent }}
                        onAdd={onAddGate}
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </aside>
  );
}
