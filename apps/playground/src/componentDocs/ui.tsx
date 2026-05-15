import { useEffect, useRef, useState } from "react";
import {
  GridraBadge,
  GridraButton,
  GridraField,
  GridraInline,
  GridraInlineItem,
  GridraInput,
  GridraLabel,
  GridraSelect,
  GridraSidebar,
  GridraStack
} from "@gridra-ui/react";
import { componentDocs } from "./data";
import { highlightDocsCode } from "./highlight";
import type { DocsCodeLanguage, PropDoc } from "./types";

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <GridraButton
      onClick={() => {
        navigator.clipboard.writeText(text).then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        });
      }}
      size="sm"
      variant="ghost"
    >
      {copied ? "Copied" : "Copy"}
    </GridraButton>
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
  const detailRef = useRef<HTMLElement>(null);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [activeDocName, setActiveDocName] = useState(() => {
    const hashName = window.location.hash.replace("#docs-", "");
    return componentDocs.some((doc) => doc.name === hashName)
      ? hashName
      : componentDocs[0]?.name;
  });
  const categories = ["All", ...Array.from(new Set(componentDocs.map((doc) => doc.category)))];

  const filteredDocs = componentDocs.filter((doc) =>
    doc.name.toLowerCase().includes(searchQuery.trim().toLowerCase())
  );
  const visibleDocs =
    activeCategory === "All"
      ? filteredDocs
      : filteredDocs.filter((doc) => doc.category === activeCategory);
  const activeDoc =
    visibleDocs.find((doc) => doc.name === activeDocName) ?? visibleDocs[0] ?? componentDocs[0];

  function resetDetailScroll() {
    if (detailRef.current) {
      detailRef.current.scrollTop = 0;
    }
  }

  function selectCategory(category: string) {
    const nextDocs =
      category === "All"
        ? filteredDocs
        : filteredDocs.filter((doc) => doc.category === category);

    setActiveCategory(category);
    setActiveDocName(nextDocs[0]?.name);
    resetDetailScroll();
  }

  function selectDoc(name: string) {
    setActiveDocName(name);
    window.history.replaceState(null, "", `#docs-${name}`);
    resetDetailScroll();
  }

  useEffect(() => {
    resetDetailScroll();
  }, [activeDocName]);

  return (
    <section className="gridra-root gridra-theme-dark docs-page">
      <GridraStack
        align="center"
        as="header"
        className="docs-page__header"
        direction="horizontal"
        justify="between"
      >
        <div>
          <GridraLabel>Documentation</GridraLabel>
          <h1 className="docs-page__title">Gridra UI Components</h1>
        </div>
        <GridraBadge tone="accent">{componentDocs.length} components</GridraBadge>
      </GridraStack>
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
        <GridraSidebar
          className="docs-page__sidebar"
          collapsedWidth={0}
          defaultOpen
          toggleSize={32}
          width={260}
        >
          <div className="docs-page__sidebar-inner">
            <GridraField className="docs-page__search" label="Search">
              <GridraInput
                aria-label="Search components"
                onChange={(event) => {
                  setSearchQuery(event.target.value);
                }}
                placeholder="Search components..."
                type="search"
                value={searchQuery}
              />
            </GridraField>
            <div className="docs-page__mobile-controls">
              {visibleDocs.length === 0 ? (
                <div className="docs-page__mobile-empty">
                  <GridraBadge tone="muted">No matches</GridraBadge>
                </div>
              ) : (
                <>
                  <GridraSelect
                    aria-label="Select component"
                    className="docs-page__mobile-selector"
                    onChange={(event) => selectDoc(event.target.value)}
                    value={activeDoc.name}
                  >
                    {visibleDocs.map((doc) => (
                      <option key={doc.name} value={doc.name}>
                        {doc.name}
                      </option>
                    ))}
                  </GridraSelect>
                  <div className="docs-page__mobile-viewing">
                    <span className="docs-page__mobile-viewing-label">Currently viewing:</span>{" "}
                    <span className="docs-page__mobile-viewing-name">{activeDoc.name}</span>
                  </div>
                  <GridraButton
                    className="docs-page__mobile-toggle"
                    onClick={() => setMobileNavOpen((open) => !open)}
                    size="sm"
                    variant="default"
                  >
                    {mobileNavOpen ? "Hide component list" : "Show all components"}
                  </GridraButton>
                </>
              )}
            </div>
            <nav
              className={`docs-page__nav${mobileNavOpen ? " docs-page__nav--mobile-open" : ""}`}
              aria-label="Component documentation"
            >
              {visibleDocs.length === 0 ? (
                <div className="docs-page__nav-empty">
                  <GridraBadge tone="muted">No matches</GridraBadge>
                </div>
              ) : (
                visibleDocs.map((doc) => (
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
                ))
              )}
            </nav>
          </div>
        </GridraSidebar>
        <article ref={detailRef} className="docs-detail" id={`docs-${activeDoc.name}`}>
          <header className="docs-detail__header">
            <GridraBadge tone="muted">{activeDoc.category}</GridraBadge>
            <h2 className="docs-detail__title">{activeDoc.name}</h2>
          </header>
          <p className="docs-detail__summary">{activeDoc.summary}</p>

          {activeDoc.description ? (
            <section className="docs-detail__section docs-detail__section--primary">
              <GridraLabel>Overview</GridraLabel>
              <p className="docs-detail__description">{activeDoc.description}</p>
            </section>
          ) : null}

          {activeDoc.usage ? (
            <section className="docs-detail__section docs-detail__section--primary">
              <GridraLabel>Usage</GridraLabel>
              <p className="docs-detail__description">{activeDoc.usage}</p>
            </section>
          ) : null}

          {activeDoc.importExample ? (
            <section className="docs-detail__section docs-detail__section--quiet">
              <GridraLabel>Import</GridraLabel>
              <div className="docs-import-block">
                <code className="docs-import-block__code">{activeDoc.importExample}</code>
                <CopyButton text={activeDoc.importExample} />
              </div>
            </section>
          ) : null}

          <section className="docs-detail__section docs-detail__section--primary">
            <GridraLabel>Preview</GridraLabel>
            <div className="docs-card__preview">{activeDoc.preview}</div>
          </section>

          {activeDoc.states && activeDoc.states.length > 0 ? (
            <section className="docs-detail__section docs-detail__section--primary">
              <GridraLabel>States</GridraLabel>
              <div className="docs-examples">
                {activeDoc.states.map((state, index) => (
                  <div className="docs-example" key={index}>
                    <GridraInline align="baseline" className="docs-example__header" gap="sm">
                      <span className="docs-example__title">{state.title}</span>
                      {state.description ? (
                        <span className="docs-example__description">{state.description}</span>
                      ) : null}
                    </GridraInline>
                    <CodeBlock code={state.code} language={state.language} />
                  </div>
                ))}
              </div>
            </section>
          ) : null}

          {activeDoc.props.length > 0 ? (
            <section className="docs-detail__section docs-detail__section--technical">
              <GridraLabel>Props</GridraLabel>
              <PropsTable props={activeDoc.props} />
            </section>
          ) : null}

          {activeDoc.examples.length > 0 ? (
            <section className="docs-detail__section docs-detail__section--examples">
              <GridraLabel>Examples</GridraLabel>
              <div className="docs-examples">
                {activeDoc.examples.map((example, index) => (
                  <div className="docs-example" key={index}>
                    <GridraInline align="baseline" className="docs-example__header" gap="sm">
                      <span className="docs-example__title">{example.title}</span>
                      {example.description ? (
                        <span className="docs-example__description">{example.description}</span>
                      ) : null}
                    </GridraInline>
                    <CodeBlock code={example.code} language={example.language} />
                  </div>
                ))}
              </div>
            </section>
          ) : null}

          {(activeDoc.notes || activeDoc.avoid || activeDoc.options.length > 0 || activeDoc.features.length > 0 || activeDoc.compositions) ? (
            <section className="docs-detail__section docs-detail__section--secondary">
              <GridraLabel>Notes</GridraLabel>
              {activeDoc.avoid ? (
                <div className="docs-detail__notes-group">
                  <p className="docs-detail__notes-label">Avoid</p>
                  <p className="docs-detail__description">{activeDoc.avoid}</p>
                </div>
              ) : null}
              {activeDoc.compositions && activeDoc.compositions.length > 0 ? (
                <div className="docs-detail__notes-group">
                  <p className="docs-detail__notes-label">Compositions</p>
                  <ul className="docs-card__list">
                    {activeDoc.compositions.map((comp) => (
                      <li key={comp}>{comp}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
              {activeDoc.features.length > 0 ? (
                <div className="docs-detail__notes-group">
                  <p className="docs-detail__notes-label">Features</p>
                  <ul className="docs-card__list">
                    {activeDoc.features.map((feature) => (
                      <li key={feature}>{feature}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
              {activeDoc.options.length > 0 ? (
                <div className="docs-detail__notes-group">
                  <p className="docs-detail__notes-label">Design choices</p>
                  <ul className="docs-card__list">
                    {activeDoc.options.map((option) => (
                      <li key={option}>{option}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
              {activeDoc.notes ? (
                <div className="docs-detail__notes-group">
                  <p className="docs-detail__description">{activeDoc.notes}</p>
                </div>
              ) : null}
            </section>
          ) : null}

          {activeDoc.accessibility ? (
            <section className="docs-detail__section docs-detail__section--primary">
              <GridraLabel>Accessibility</GridraLabel>
              <p className="docs-detail__description">{activeDoc.accessibility}</p>
            </section>
          ) : null}
        </article>
      </div>
    </section>
  );
}
