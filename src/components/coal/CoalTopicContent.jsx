import React from "react";
import { Link } from "react-router-dom";
import { BookOpen, Lightbulb } from "lucide-react";
import { CoalDiagram } from "./CoalDiagrams";
import AluFlagsSimulator from "./AluFlagsSimulator";
import AssemblyStackSimulator from "./AssemblyStackSimulator";
import "./CoalTopicCard.css";
import "./CoalTopicContent.css";

function CoalBody({ body }) {
  if (!body?.length) return null;

  return (
    <>
      {body.map((block, index) => {
        if (typeof block === "string") {
          return <p key={`${block.slice(0, 24)}-${index}`}>{block}</p>;
        }

        if (block?.type === "subheading") {
          return (
            <h3 key={`subheading-${index}`} className="coal-section__subhead">
              {block.text}
            </h3>
          );
        }

        if (block?.type === "list") {
          return (
            <ul key={`list-${index}`} className="coal-bullets">
              {block.items.map((item, itemIndex) => (
                <li key={`${item}-${itemIndex}`} className="coal-bullets__item">
                  {item}
                </li>
              ))}
            </ul>
          );
        }

        if (block?.type === "code") {
          return (
            <pre key={`code-${index}`} className="coal-code-block">
              <code>{block.code}</code>
            </pre>
          );
        }

        return null;
      })}
    </>
  );
}

function CoalContentTable({ table }) {
  if (!table) return null;
  return (
    <div className="coal-table-wrap">
      {table.caption ? <p className="coal-table-caption">{table.caption}</p> : null}
      <table className="coal-table">
        <thead>
          <tr>
            {table.headers.map((h) => (
              <th key={h}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.rows.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) => (
                <td key={j}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function CoalRealLife({ example }) {
  if (!example) return null;
  return (
    <aside className="coal-real-life">
      <div className="coal-real-life__head">
        <Lightbulb size={16} />
        <strong>{example.title}</strong>
      </div>
      <p>{example.text}</p>
    </aside>
  );
}

function CoalTopicContent({ content }) {
  if (!content) return null;

  return (
    <article className="coal-topic-content">
      <p className="coal-topic-content__intro">{content.preview.summary}</p>

      {content.sections.map((section) => (
        <section key={section.id} className="coal-section">
          <h2>{section.title}</h2>
          <CoalBody body={section.body} />
          {section.code ? (
            <pre className="coal-code-block">
              <code>{section.code.code}</code>
            </pre>
          ) : null}
          {section.diagram ? <CoalDiagram type={section.diagram} /> : null}
          {section.component === "alu-flags-simulator" ? <AluFlagsSimulator /> : null}
          {section.component === "assembly-stack-simulator" ? <AssemblyStackSimulator /> : null}
          <CoalContentTable table={section.table} />
          <CoalRealLife example={section.realLife} />
        </section>
      ))}

      {content.keyTakeaways?.length ? (
        <div className="coal-takeaways">
          <h2>Remember this</h2>
          <ul>
            {content.keyTakeaways.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      ) : null}

      {content.relatedTool ? (
        <Link to={content.relatedTool.to} className="coal-related-tool">
          <BookOpen size={16} />
          {content.relatedTool.label}
        </Link>
      ) : null}
    </article>
  );
}

export default CoalTopicContent;
