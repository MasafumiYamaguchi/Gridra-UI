import { useEffect, useRef, useState } from "react";
import {
  GRIDRA_BUILT_IN_THEME_NAMES,
  GridraBadge,
  GridraButton,
  GridraField,
  GridraStack,
  GridraInput,
  GridraLabel,
  GridraSelect,
  GridraSidebar,
  GridraTreeView,
} from "@gridra-ui/react";
import type {
  GridraBuiltInThemeName,
  GridraTreeItem,
} from "@gridra-ui/react";
import { CodeBlock } from "./code-block";
import { CopyButton } from "./copy-button";
import { componentDocs } from "./data";
import { PropsTable } from "./props-table";

const categories = Array.from(new Set(componentDocs.map((doc) => doc.category)));

export function ComponentDocsPage({
  onThemeChange,
  theme,
}: {
  onThemeChange: (theme: GridraBuiltInThemeName) => void;
  theme: GridraBuiltInThemeName;
}) {
  const detailRef = useRef<HTMLElement>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [activeDocName, setActiveDocName] = useState(() => {
    const hashName = window.location.hash.replace("#docs-", "");
    return componentDocs.some((doc) => doc.name === hashName)
      ? hashName
      : componentDocs[0]?.name;
  });
  const [expandedCategories, setExpandedCategories] = useState<string[]>(() => {
    const initialDoc = componentDocs.find((doc) => doc.name === activeDocName);
    return initialDoc ? [initialDoc.category] : [];
  });
  const [searchExpandedCategories, setSearchExpandedCategories] = useState<string[]>([]);
  const normalizedQuery = searchQuery.trim().toLowerCase();

  const filteredDocs = componentDocs.filter((doc) =>
    `${doc.name} ${doc.category}`.toLowerCase().includes(normalizedQuery)
  );
  const treeItems: GridraTreeItem[] = categories
    .filter((category) => filteredDocs.some((doc) => doc.category === category))
    .map((category) => ({
      id: category,
      label: category,
      children: filteredDocs
        .filter((doc) => doc.category === category)
        .map((doc) => ({ id: doc.name, label: doc.name })),
    }));
  const expandedIds = normalizedQuery ? searchExpandedCategories : expandedCategories;
  const allExpanded = treeItems.every((item) => expandedIds.includes(item.id));
  const activeDoc =
    componentDocs.find((doc) => doc.name === activeDocName) ?? componentDocs[0];

  function resetDetailScroll() {
    if (detailRef.current) {
      detailRef.current.scrollTop = 0;
    }
  }

  function selectDoc(name: string) {
    const doc = componentDocs.find((candidate) => candidate.name === name);
    if (!doc) return;
    setActiveDocName(name);
    setExpandedCategories((current) =>
      current.includes(doc.category) ? current : [...current, doc.category]
    );
    setMobileNavOpen(false);
    window.history.replaceState(null, "", `#docs-${name}`);
    resetDetailScroll();
  }

  useEffect(() => {
    resetDetailScroll();
  }, [activeDocName]);

  return (
    <div className={`docs-root gridra-theme-${theme}`}>
      <section className="docs-page">
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
        <GridraStack direction="horizontal" inline align="center" gap="sm">
          <GridraSelect
            aria-label="Documentation theme"
            onChange={(event) =>
              onThemeChange(event.target.value as GridraBuiltInThemeName)
            }
            value={theme}
          >
            {GRIDRA_BUILT_IN_THEME_NAMES.map((themeName) => (
              <option key={themeName} value={themeName}>
                {themeName[0].toUpperCase() + themeName.slice(1)}
              </option>
            ))}
          </GridraSelect>
        </GridraStack>
      </GridraStack>
      <div className="docs-page__layout">
        <GridraSidebar
          className="docs-page__sidebar"
          collapsedWidth={0}
          defaultOpen
          toggleSize={32}
          width={280}
        >
          <div className="docs-page__sidebar-inner">
            <div className="docs-page__sidebar-heading">
              <GridraLabel>Components</GridraLabel>
            </div>
            <GridraField className="docs-page__search" label="Search">
              <GridraInput
                aria-label="Search components"
                onChange={(event) => {
                  setSearchQuery(event.target.value);
                  const query = event.target.value.trim().toLowerCase();
                  setSearchExpandedCategories(categories.filter((category) =>
                    componentDocs.some((doc) => doc.category === category &&
                      `${doc.name} ${doc.category}`.toLowerCase().includes(query))
                  ));
                }}
                placeholder="Search components..."
                type="search"
                value={searchQuery}
              />
            </GridraField>
            <div className="docs-page__mobile-controls">
              <span className="docs-page__mobile-viewing-name">{activeDoc.name}</span>
              <GridraButton
                aria-controls="docs-component-nav"
                aria-expanded={mobileNavOpen || Boolean(normalizedQuery)}
                onClick={() => {
                  if (normalizedQuery) setSearchQuery("");
                  setMobileNavOpen(!(mobileNavOpen || Boolean(normalizedQuery)));
                }}
                size="sm"
              >
                {mobileNavOpen || normalizedQuery ? "Hide navigation" : "Browse components"}
              </GridraButton>
            </div>
            <nav
              className={`docs-page__nav${mobileNavOpen || normalizedQuery ? " docs-page__nav--mobile-open" : ""}`}
              aria-label="Component documentation"
              id="docs-component-nav"
            >
              {filteredDocs.length === 0 ? (
                <div className="docs-page__nav-empty">
                  <GridraBadge tone="muted">No matches</GridraBadge>
                </div>
              ) : (
                <>
                <GridraButton
                  className="docs-page__tree-toggle"
                  onClick={() => {
                    const next = allExpanded ? [] : treeItems.map((item) => item.id);
                    if (normalizedQuery) setSearchExpandedCategories(next);
                    else setExpandedCategories(next);
                  }}
                  size="sm"
                >
                  {allExpanded ? "Collapse all" : "Expand all"}
                </GridraButton>
                <GridraTreeView
                  expandedIds={expandedIds}
                  onExpandedIdsChange={(next) => {
                    if (normalizedQuery) setSearchExpandedCategories(next);
                    else setExpandedCategories(next);
                  }}
                  items={treeItems}
                  onItemClick={(id) => selectDoc(id)}
                  onKeyDown={(event) => {
                    if (event.key !== "Enter" && event.key !== " ") return;
                    const row = (event.target as HTMLElement).closest<HTMLElement>(".gridra-tree-view__row");
                    if (row) {
                      event.preventDefault();
                      row.click();
                    }
                  }}
                  renderItem={(item, state) => (
                    <span
                      aria-current={!state.hasChildren && item.id === activeDoc.name ? "page" : undefined}
                      className={state.hasChildren ? "docs-tree-category" : "docs-tree-component"}
                    >
                      <span className="docs-tree-label">{item.label}</span>
                    </span>
                  )}
                  size="md"
                />
                </>
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
                    <GridraStack direction="horizontal" inline align="baseline" className="docs-example__header" gap="sm">
                      <span className="docs-example__title">{state.title}</span>
                      {state.description ? (
                        <span className="docs-example__description">{state.description}</span>
                      ) : null}
                    </GridraStack>
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
                    <GridraStack direction="horizontal" inline align="baseline" className="docs-example__header" gap="sm">
                      <span className="docs-example__title">{example.title}</span>
                      {example.description ? (
                        <span className="docs-example__description">{example.description}</span>
                      ) : null}
                    </GridraStack>
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
    </div>
  );
}
