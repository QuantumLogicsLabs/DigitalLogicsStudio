import { Link } from "react-router-dom";
import { BookOpen, Lightbulb } from "lucide-react";
import TheoryQuiz from "./TheoryQuiz";
import "./TheoryTopicContent.css";

// ── Body blocks ──────────────────────────────────────────────────
// section.body is an array where each item is either:
//   a plain string              -> paragraph
//   { type: "subheading", text }
//   { type: "list", items }
//   { type: "steps", items }                       (numbered step list)
//   { type: "cards", items: [{icon,title,text}] }   (info-card grid)
//   { type: "code", code } or { type: "code", lines: [{text,color}] }
function Body({ body }) {
  if (!body?.length) return null;

  return (
    <>
      {body.map((block, index) => {
        if (typeof block === "string") {
          return <p key={`p-${index}`}>{block}</p>;
        }

        if (block?.type === "subheading") {
          return (
            <h3 key={`sh-${index}`} className="theory-section__subhead">
              {block.text}
            </h3>
          );
        }

        if (block?.type === "list") {
          return (
            <ul key={`list-${index}`} className="theory-bullets">
              {block.items.map((item, i) => (
                <li key={i} className="theory-bullets__item">{item}</li>
              ))}
            </ul>
          );
        }

        if (block?.type === "steps") {
          return (
            <div key={`steps-${index}`} className="theory-steps">
              {block.items.map((step, i) => (
                <div key={i} className="theory-step">
                  <span className="theory-step-num">{i + 1}</span>
                  <span className="theory-step-text">{step}</span>
                </div>
              ))}
            </div>
          );
        }

        if (block?.type === "cards") {
          return (
            <div key={`cards-${index}`} className="theory-card-group">
              {block.items.map((card, i) => (
                <div key={i} className="theory-info-card">
                  {card.icon ? <div className="theory-info-card-icon">{card.icon}</div> : null}
                  <div className="theory-info-card-title">{card.title}</div>
                  <div className="theory-info-card-text">{card.text}</div>
                </div>
              ))}
            </div>
          );
        }

        if (block?.type === "code") {
          return (
            <pre key={`code-${index}`} className="theory-code-block">
              <code>
                {block.lines
                  ? block.lines.map((line, i) => (
                      <div key={i} style={line.color ? { color: line.color } : undefined}>
                        {line.text || "\u00A0"}
                      </div>
                    ))
                  : block.code}
              </code>
            </pre>
          );
        }

        if (block?.type === "chip") {
          return (
            <div key={`chip-${index}`} className="theory-chip">
              <div className="theory-chip-label">{block.label}</div>
              {(block.pins || []).map((p, i) => (
                <div key={`p${i}`} className="theory-chip-pin">▸ {p}</div>
              ))}
              {(block.dataPins || []).map((p, i) => (
                <div key={`d${i}`} className="theory-chip-pin-data">◈ {p}</div>
              ))}
            </div>
          );
        }

        return null;
      })}
    </>
  );
}

function ContentTable({ table }) {
  if (!table) return null;
  return (
    <div className="theory-table-wrap">
      {table.caption ? <p className="theory-table-caption">{table.caption}</p> : null}
      <table className="theory-table">
        <thead>
          <tr>
            {table.headers.map((h, i) => (
              <th key={i} style={table.colColors?.[i] ? { color: table.colColors[i] } : undefined}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.rows.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) => (
                <td key={j} style={table.colColors?.[j] ? { color: table.colColors[j] } : undefined}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Callout({ example }) {
  if (!example) return null;
  return (
    <aside className="theory-callout">
      <div className="theory-callout__head">
        <Lightbulb size={16} />
        <strong>{example.title}</strong>
      </div>
      <p>{example.text}</p>
    </aside>
  );
}

// ── Generic theory topic content renderer ──────────────────────────
// Shared by DLD and COAL. `widgetRegistry` maps a section's
// `component` key to a real React component (e.g. COAL's embedded
// alu-flags-simulator) — content data stays subject-agnostic, the
// caller supplies which widgets exist for its track. `diagramRenderer`
// is likewise an optional component for section.diagram.
export default function TheoryTopicContent({ content, widgetRegistry, diagramRenderer: Diagram }) {
  if (!content) {
    return (
      <div className="theory-coming-soon">
        <strong>This topic is coming soon</strong>
        Check back shortly — we're still writing this page.
      </div>
    );
  }

  return (
    <article className="theory-topic-content">
      {content.preview?.summary ? (
        <p className="theory-topic-content__intro">{content.preview.summary}</p>
      ) : null}

      {content.sections.map((section) => {
        const Widget = section.component && widgetRegistry ? widgetRegistry[section.component] : null;
        return (
          <section key={section.id} className="theory-section">
            {section.kicker ? <p className="theory-section__kicker">{section.kicker}</p> : null}
            <h2>{section.title}</h2>
            <Body body={section.body} />
            {section.code ? (
              <pre className="theory-code-block">
                <code>{section.code.code}</code>
              </pre>
            ) : null}
            {section.diagram && Diagram ? <Diagram type={section.diagram} /> : null}
            {Widget ? <Widget /> : null}
            <ContentTable table={section.table} />
            <Callout example={section.realLife || section.callout} />
            {section.quiz ? <TheoryQuiz questions={section.quiz.questions} title={section.quiz.title} /> : null}
          </section>
        );
      })}

      {content.keyTakeaways?.length ? (
        <div className="theory-takeaways">
          <h2>Remember this</h2>
          <ul>
            {content.keyTakeaways.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
      ) : null}

      {content.relatedTool ? (
        <Link to={content.relatedTool.to} className="theory-related-tool">
          <BookOpen size={16} />
          {content.relatedTool.label}
        </Link>
      ) : null}
    </article>
  );
}
