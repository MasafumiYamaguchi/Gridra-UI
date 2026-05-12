import { useEffect, useState } from "react";
import { GridraBadge, GridraButton, GridraLabel } from "@gridra-ui/react";
import { componentDocs } from "./data";
import { highlightDocsCode } from "./highlight";
import type { DocsCodeLanguage, PropDoc } from "./types";

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <button
      className="docs-copy-button"
      onClick={() => {
        navigator.clipboard.writeText(text).then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        });
      }}
      type="button"
      title="Copy to clipboard"
    >
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

function CodeBlock({
  code,
  language = "tsx"
}: {
  code: string;
  language?: DocsCodeLanguage;
}) {
  const [highlightedCode, setHighlightedCode] = useState<string>();

  useEffect(() => {
    let active = true;

    setHighlightedCode(undefined);
    highlightDocsCode(code, language)
      .then((html) => {
        if (active) {
          setHighlightedCode(html);
        }
      })
      .catch(() => {
        if (active) {
          setHighlightedCode(undefined);
        }
      });

    return () => {
      active = false;
    };
  }, [code, language]);

  return (
    <div className="docs-code-block">
      <div className="docs-code-block__header">
        <span className="docs-code-block__lang">{language}</span>
        <CopyButton text={code} />
      </div>
      {highlightedCode ? (
        <div
          className="docs-code-block__highlight"
          dangerouslySetInnerHTML={{ __html: highlightedCode }}
        />
      ) : (
        <pre className="docs-code-block__pre">
          <code>{code}</code>
        </pre>
      )}
    </div>
  );
}

function PropsTable({ props }: { props: PropDoc[] }) {
  return (
    <div className="docs-props-table-wrapper">
      <table className="docs-props-table">
        <thead>
          <tr>
            <th>Prop</th>
            <th>Type</th>
            <th>Default</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {props.map((prop) => (
            <tr key={prop.name}>
              <td>
                <code className="docs-prop-name">
                  {prop.name}
                  {prop.required && <span className="docs-prop-required">*</span>}
                </code>
              </td>
              <td>
                <code className="docs-prop-type">{prop.type}</code>
              </td>
              <td>{prop.default ?? "—"}</td>
              <td>{prop.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function ComponentDocsPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeDocName, setActiveDocName] = useState(() => {
    const hashName = window.location.hash.replace("#docs-", "");
    return componentDocs.some((doc) => doc.name === hashName)
      ? hashName
      : componentDocs[0]?.name;
  });
  const categories = ["All", ...Array.from(new Set(componentDocs.map((doc) => doc.category)))];
  const visibleDocs =
    activeCategory === "All"
      ? componentDocs
      : componentDocs.filter((doc) => doc.category === activeCategory);
  const activeDoc =
    visibleDocs.find((doc) => doc.name === activeDocName) ?? visibleDocs[0] ?? componentDocs[0];

  function selectCategory(category: string) {
    const nextDocs =
      category === "All"
        ? componentDocs
        : componentDocs.filter((doc) => doc.category === category);

    setActiveCategory(category);
    setActiveDocName(nextDocs[0]?.name);
  }

  function selectDoc(name: string) {
    setActiveDocName(name);
    window.history.replaceState(null, "", `#docs-${name}`);
  }

  return (
    <section className="gridra-root gridra-theme-dark docs-page">
      <header className="docs-page__header">
        <div>
          <GridraLabel>Documentation</GridraLabel>
          <h1 className="docs-page__title">Gridra UI Components</h1>
        </div>
        <GridraBadge tone="accent">{componentDocs.length} components</GridraBadge>
      </header>
      <div className="docs-page__filters" aria-label="Component categories">
        {categories.map((category) => (
          <GridraButton
            key={category}
            onClick={() => selectCategory(category)}
            pressed={activeCategory === category}
            variant={activeCategory === category ? "primary" : "default"}
          >
            {category}
          </GridraButton>
        ))}
      </div>
      <div className="docs-page__layout">
        <nav className="docs-page__nav" aria-label="Component documentation">
          {visibleDocs.map((doc) => (
            <button
              className="docs-page__nav-item"
              key={doc.name}
              onClick={() => selectDoc(doc.name)}
              type="button"
              aria-current={doc.name === activeDoc.name ? "page" : undefined}
            >
              <span>{doc.name}</span>
              <GridraBadge tone="muted">{doc.category}</GridraBadge>
            </button>
          ))}
        </nav>
        <article className="docs-detail" id={`docs-${activeDoc.name}`}>
          <header className="docs-detail__header">
            <div>
              <GridraBadge tone="muted">{activeDoc.category}</GridraBadge>
              <h2 className="docs-detail__title">{activeDoc.name}</h2>
            </div>
          </header>
          <p className="docs-detail__summary">{activeDoc.summary}</p>

          {activeDoc.description ? (
            <section className="docs-detail__section">
              <GridraLabel>Description</GridraLabel>
              <p className="docs-detail__description">{activeDoc.description}</p>
            </section>
          ) : null}

          {activeDoc.importExample ? (
            <section className="docs-detail__section">
              <GridraLabel>Import</GridraLabel>
              <div className="docs-import-block">
                <code className="docs-import-block__code">{activeDoc.importExample}</code>
                <CopyButton text={activeDoc.importExample} />
              </div>
            </section>
          ) : null}

          <section className="docs-detail__section">
            <GridraLabel>Preview</GridraLabel>
            <div className="docs-card__preview">{activeDoc.preview}</div>
          </section>

          {activeDoc.props.length > 0 ? (
            <section className="docs-detail__section">
              <GridraLabel>Props</GridraLabel>
              <PropsTable props={activeDoc.props} />
            </section>
          ) : null}

          {activeDoc.examples.length > 0 ? (
            <section className="docs-detail__section">
              <GridraLabel>Examples</GridraLabel>
              <div className="docs-examples">
                {activeDoc.examples.map((example, index) => (
                  <div className="docs-example" key={index}>
                    <div className="docs-example__header">
                      <span className="docs-example__title">{example.title}</span>
                      {example.description ? (
                        <span className="docs-example__description">{example.description}</span>
                      ) : null}
                    </div>
                    <CodeBlock code={example.code} language={example.language} />
                  </div>
                ))}
              </div>
            </section>
          ) : null}

          <div className="docs-detail__meta">
            <section className="docs-detail__section">
              <GridraLabel>Options</GridraLabel>
              <ul className="docs-card__list">
                {activeDoc.options.map((option) => (
                  <li key={option}>{option}</li>
                ))}
              </ul>
            </section>
            <section className="docs-detail__section">
              <GridraLabel>Features</GridraLabel>
              <ul className="docs-card__list">
                {activeDoc.features.map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
            </section>
          </div>
        </article>
      </div>
    </section>
  );
}
