import { useEffect, useRef, useState } from "react";
import { GRIDRA_BUILT_IN_THEME_NAMES, GridraTreeView } from "@gridra-ui/react";
import type { GridraBuiltInThemeName, GridraTreeItem } from "@gridra-ui/react";
import { CodeBlock } from "./code-block";
import { CopyButton } from "./copy-button";
import { componentDocs } from "./data";
import { DocsPreview, ExampleCard } from "./preview";
import { PropsTable } from "./props-table";

const repoUrl = "https://github.com/MasafumiYamaguchi/Gridra-UI";
const categories = Array.from(new Set(componentDocs.map((doc) => doc.category)));

export function ComponentDocsPage({ onThemeChange, theme }: {
  onThemeChange: (theme: GridraBuiltInThemeName) => void;
  theme: GridraBuiltInThemeName;
}) {
  const readerRef = useRef<HTMLElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("preview");
  const [activeDocName, setActiveDocName] = useState(() => {
    const name = window.location.hash.replace("#docs-", "").split("/")[0];
    return componentDocs.some((doc) => doc.name === name) ? name : componentDocs[0].name;
  });
  const [expandedCategories, setExpandedCategories] = useState<string[]>(() => {
    const doc = componentDocs.find((doc) => doc.name === activeDocName);
    return doc ? [doc.category] : [];
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
      children: filteredDocs.filter((doc) => doc.category === category)
        .map((doc) => ({ id: doc.name, label: doc.name })),
    }));
  const expandedIds = normalizedQuery ? searchExpandedCategories : expandedCategories;
  const allExpanded = treeItems.every((item) => expandedIds.includes(item.id));
  const activeDoc = componentDocs.find((doc) => doc.name === activeDocName) ?? componentDocs[0];
  const activeIndex = componentDocs.indexOf(activeDoc);
  const docFile = ({ GridraSkeleton: "gridra-skeleton-empty", GridraEmptyState: "gridra-skeleton-empty",
    GridraErrorMessage: "gridra-error-status", GridraStatusIndicator: "gridra-error-status" } as Record<string, string>)[activeDoc.name]
    ?? activeDoc.name.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
  const hasNotes = Boolean(activeDoc.notes || activeDoc.features.length || activeDoc.options.length ||
    (!activeDoc.usage && (activeDoc.avoid || activeDoc.compositions?.length)));
  const sections = [
    { id: "preview", label: "Preview" },
    ...(activeDoc.description ? [{ id: "overview", label: "Overview" }] : []),
    ...(activeDoc.usage ? [{ id: "usage", label: "Usage" }] : []),
    ...(activeDoc.states?.length ? [{ id: "states", label: "States" }] : []),
    ...(activeDoc.examples.length ? [{ id: "examples", label: "Examples" }] : []),
    ...(activeDoc.props.length ? [{ id: "props", label: "Props" }] : []),
    ...(hasNotes ? [{ id: "notes", label: "Notes" }] : []),
    ...(activeDoc.accessibility ? [{ id: "accessibility", label: "Accessibility" }] : []),
  ];

  function sectionTitle(id: string, label: string) {
    return <h3 className="docs-section__title">
      <span className="docs-section__number" aria-hidden="true">
        {String(sections.findIndex((section) => section.id === id)).padStart(2, "0")}
      </span>{label}
    </h3>;
  }

  function selectDoc(name: string) {
    const doc = componentDocs.find((doc) => doc.name === name);
    if (!doc) return;
    setActiveDocName(name);
    setExpandedCategories((current) => current.includes(doc.category) ? current : [...current, doc.category]);
    setMobileNavOpen(false);
    window.history.replaceState(null, "", `#docs-${name}`);
    if (readerRef.current) readerRef.current.scrollTop = 0;
    setActiveSection("preview");
  }

  function goToSection(id: string, smooth = true) {
    const reader = readerRef.current;
    const section = reader?.querySelector<HTMLElement>(`[data-section="${id}"]`);
    if (!reader || !section) return;
    const top = section.getBoundingClientRect().top - reader.getBoundingClientRect().top + reader.scrollTop - 32;
    const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
    reader.scrollTo({ top: Math.max(0, top), behavior: smooth && !reducedMotion ? "smooth" : "instant" });
    setActiveSection(id);
  }

  useEffect(() => {
    if (readerRef.current) readerRef.current.scrollTop = 0;
    setActiveSection("preview");
    const section = window.location.hash.split("/")[1];
    if (section) goToSection(section, false);
  }, [activeDocName]);

  useEffect(() => {
    function handleKey(event: KeyboardEvent) {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        searchRef.current?.focus();
      }
      if (event.key === "Escape") setMobileNavOpen(false);
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  return (
    <div className={`docs-root gridra-theme-${theme}`}>
      <div className="docs-page">
        <header className="docs-header">
          <a className="docs-brand" href="/" aria-label="Gridra UI playground">
            <span className="docs-brand__mark" aria-hidden="true" />
            <span>GRIDRA UI</span><span className="docs-version">v0.1.0</span>
          </a>
          <nav className="docs-header__links" aria-label="Main navigation">
            <a href="/docs" aria-current="page">Components</a>
            <a href={`${repoUrl}/blob/main/THEMING.md`}>Theming</a>
            <a href={`${repoUrl}/blob/main/MIGRATION.md`}>Migration</a>
            <a href="/">Playground</a>
          </nav>
          <div className="docs-header__tools">
            <div className="docs-search">
              <span className="docs-search__icon" aria-hidden="true" />
              <input ref={searchRef} aria-label="Search components" type="search" placeholder="Search docs..."
                value={searchQuery} onChange={(event) => {
                  const query = event.target.value.trim().toLowerCase();
                  setSearchQuery(event.target.value);
                  setSearchExpandedCategories(categories.filter((category) => componentDocs.some((doc) =>
                    doc.category === category && `${doc.name} ${doc.category}`.toLowerCase().includes(query)
                  )));
                }} />
              <kbd>Ctrl K</kbd>
            </div>
            <label className="docs-theme-select">
              <span>Theme</span>
              <select aria-label="Documentation theme" value={theme}
                onChange={(event) => onThemeChange(event.target.value as GridraBuiltInThemeName)}>
                {GRIDRA_BUILT_IN_THEME_NAMES.map((name) =>
                  <option key={name} value={name}>{name[0].toUpperCase() + name.slice(1)}</option>
                )}
              </select>
            </label>
            <a className="docs-github" href={repoUrl} aria-label="GitHub repository">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
                <path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.86c-2.78.6-3.37-1.18-3.37-1.18-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.89 1.53 2.34 1.09 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.56-1.11-4.56-4.94 0-1.09.39-1.99 1.03-2.69-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.03A9.6 9.6 0 0 1 12 6.82c.85 0 1.71.11 2.51.34 1.91-1.3 2.75-1.03 2.75-1.03.55 1.38.2 2.4.1 2.65.64.7 1.03 1.6 1.03 2.69 0 3.84-2.34 4.69-4.57 4.94.36.31.68.92.68 1.85v2.75c0 .27.18.58.69.48A10 10 0 0 0 12 2Z" />
              </svg>
            </a>
          </div>
        </header>

        <div className="docs-page__layout">
          <aside className="docs-sidebar">
            <div className="docs-mobile-controls">
              <span>{activeDoc.name}</span>
              <button type="button" aria-controls="docs-component-nav"
                aria-expanded={mobileNavOpen || Boolean(normalizedQuery)} onClick={() => {
                  if (normalizedQuery) setSearchQuery("");
                  setMobileNavOpen(!(mobileNavOpen || Boolean(normalizedQuery)));
                }}>{mobileNavOpen || normalizedQuery ? "Hide navigation" : "Browse components"}</button>
            </div>
            <nav id="docs-component-nav" aria-label="Component documentation"
              className={`docs-sidebar__nav${mobileNavOpen || normalizedQuery ? " docs-sidebar__nav--open" : ""}`}>
              <div className="docs-sidebar__intro">
                <h2 className="docs-eyebrow">Getting started</h2>
                <a href={`${repoUrl}/blob/main/README.md#installation`}>Installation</a>
                <a href={`${repoUrl}/blob/main/THEMING.md`}>Theming</a>
                <button type="button" onClick={() => selectDoc("useGridraCanvas")}>Canvas interactions</button>
              </div>
              <div className="docs-sidebar__tree-heading">
                <span className="docs-eyebrow">Components</span>
                <button type="button" aria-label={allExpanded ? "Collapse all" : "Expand all"}
                  title={allExpanded ? "Collapse all" : "Expand all"} onClick={() => {
                    const next = allExpanded ? [] : treeItems.map((item) => item.id);
                    if (normalizedQuery) setSearchExpandedCategories(next);
                    else setExpandedCategories(next);
                  }}>{allExpanded ? "−" : "+"}</button>
              </div>
              {filteredDocs.length === 0 ? <p className="docs-sidebar__empty">No matches</p> :
                <GridraTreeView items={treeItems} expandedIds={expandedIds}
                  onExpandedIdsChange={(next) => {
                    if (normalizedQuery) setSearchExpandedCategories(next);
                    else setExpandedCategories(next);
                  }} onItemClick={selectDoc} onKeyDown={(event) => {
                    if (event.key !== "Enter" && event.key !== " ") return;
                    const row = (event.target as HTMLElement).closest<HTMLElement>(".gridra-tree-view__row");
                    if (row) { event.preventDefault(); row.click(); }
                  }} renderItem={(item, state) => (
                    <span aria-current={!state.hasChildren && item.id === activeDoc.name ? "page" : undefined}
                      className={state.hasChildren ? "docs-tree-category" : "docs-tree-component"}>
                      {!state.hasChildren && <span className="docs-tree-marker" aria-hidden="true" />}
                      <span>{item.label}</span>
                    </span>
                  )} />
              }
            </nav>
          </aside>

          <main ref={readerRef} className="docs-reader" onScroll={() => {
            const reader = readerRef.current;
            if (!reader) return;
            let current = "preview";
            const limit = reader.getBoundingClientRect().top + 120;
            reader.querySelectorAll<HTMLElement>("[data-section]").forEach((section) => {
              if (section.getBoundingClientRect().top <= limit) current = section.dataset.section!;
            });
            setActiveSection(current);
          }}>
            <div className="docs-reader__layout">
              <article className="docs-detail" id={`docs-${activeDoc.name}`}>
                <header className="docs-detail__header">
                  <div className="docs-breadcrumb" aria-label="Breadcrumb">
                    <span>Components</span><span aria-hidden="true">/</span><span>{activeDoc.category}</span>
                    <span aria-hidden="true">/</span><strong>{activeDoc.name}</strong>
                  </div>
                  <h2 className="docs-detail__title">{activeDoc.name}</h2>
                  <p className="docs-detail__summary">{activeDoc.summary}</p>
                  <div className="docs-detail__meta">
                    <span className="docs-tag">{activeDoc.category}</span>
                    {activeDoc.category === "Layout" && <span className="docs-tag">Primitive</span>}
                    <span className="docs-detail__meta-divider" />
                    <a href={`${repoUrl}/search?q=${encodeURIComponent(activeDoc.name)}&type=code`}>Source ↗</a>
                    <a href={`${repoUrl}/edit/main/apps/playground/src/componentDocs/data/components/${docFile}.tsx`}>Edit this page ↗</a>
                  </div>
                </header>

                {activeDoc.importExample && <div className="docs-import-block">
                  <CodeBlock code={activeDoc.importExample} header={false} />
                  <CopyButton text={activeDoc.importExample} />
                </div>}

                <section data-section="preview" aria-label="Component preview" className="docs-preview-section">
                  <DocsPreview key={activeDoc.name} preview={activeDoc.preview}
                    code={activeDoc.previewCode ?? activeDoc.examples[0]?.code ?? activeDoc.importExample} theme={theme} />
                </section>

                {activeDoc.description && <section data-section="overview" className="docs-section">
                  {sectionTitle("overview", "Overview")}
                  <p className="docs-detail__description">{activeDoc.description}</p>
                </section>}

                {activeDoc.usage && <section data-section="usage" className="docs-section">
                  {sectionTitle("usage", "Usage")}
                  <p className="docs-detail__description">{activeDoc.usage}</p>
                  {(activeDoc.compositions?.length || activeDoc.avoid) ? <div className="docs-callouts">
                    {!!activeDoc.compositions?.length && <div className="docs-callout docs-callout--compose">
                      <h4>Compose with</h4>
                      {activeDoc.compositions.map((text) => <p key={text}>{text}</p>)}
                    </div>}
                    {activeDoc.avoid && <div className="docs-callout docs-callout--avoid">
                      <h4>Avoid</h4><p>{activeDoc.avoid}</p>
                    </div>}
                  </div> : null}
                </section>}

                {!!activeDoc.states?.length && <section data-section="states" className="docs-section">
                  {sectionTitle("states", "States")}
                  <div className="docs-examples">{activeDoc.states.map((example, index) =>
                    <ExampleCard key={example.title} example={example} theme={theme}
                      number={`${sections.findIndex((section) => section.id === "states")}.${index + 1}`} />
                  )}</div>
                </section>}

                {!!activeDoc.examples.length && <section data-section="examples" className="docs-section">
                  {sectionTitle("examples", "Examples")}
                  <div className="docs-examples">{activeDoc.examples.map((example, index) =>
                    <ExampleCard key={example.title} example={example} theme={theme}
                      number={`${sections.findIndex((section) => section.id === "examples")}.${index + 1}`} />
                  )}</div>
                </section>}

                {!!activeDoc.props.length && <section data-section="props" className="docs-section">
                  {sectionTitle("props", "Props")}
                  {activeDoc.propsDescription && <p className="docs-detail__description">{activeDoc.propsDescription}</p>}
                  <PropsTable props={activeDoc.props} />
                </section>}

                {hasNotes && <section data-section="notes" className="docs-section">
                  {sectionTitle("notes", "Notes")}
                  {activeDoc.notes && <p className="docs-detail__description">{activeDoc.notes}</p>}
                  {!activeDoc.usage && activeDoc.avoid && <p className="docs-detail__description">{activeDoc.avoid}</p>}
                  {!activeDoc.usage && activeDoc.compositions?.map((text) => <p key={text}>{text}</p>)}
                  {activeDoc.features.length > 0 && <div className="docs-notes-group">
                    <h4>Features</h4><ul className="docs-card__list">{activeDoc.features.map((text) => <li key={text}>{text}</li>)}</ul>
                  </div>}
                  {activeDoc.options.length > 0 && <div className="docs-notes-group">
                    <h4>Design choices</h4><ul className="docs-card__list">{activeDoc.options.map((text) => <li key={text}>{text}</li>)}</ul>
                  </div>}
                </section>}

                {activeDoc.accessibility && <section data-section="accessibility" className="docs-section">
                  {sectionTitle("accessibility", "Accessibility")}
                  <p className="docs-detail__description">{activeDoc.accessibility}</p>
                </section>}

                <nav className="docs-pagination" aria-label="Previous and next components">
                  {activeIndex > 0 ? <button type="button" onClick={() => selectDoc(componentDocs[activeIndex - 1].name)}>
                    <span>← Previous</span><strong>{componentDocs[activeIndex - 1].name}</strong>
                  </button> : <button type="button" onClick={() => selectDoc("useGridraCanvas")}>
                    <span>← Previous</span><strong>Canvas interactions</strong>
                  </button>}
                  {activeIndex < componentDocs.length - 1 && <button type="button"
                    onClick={() => selectDoc(componentDocs[activeIndex + 1].name)}>
                    <span>Next →</span><strong>{componentDocs[activeIndex + 1].name}</strong>
                  </button>}
                </nav>
              </article>

              <nav className="docs-toc" aria-label="On this page">
                <h2 className="docs-eyebrow">On this page</h2>
                {sections.map((section) => <a key={section.id} href={`#docs-${activeDoc.name}/${section.id}`}
                  aria-current={activeSection === section.id ? "location" : undefined}
                  onClick={(event) => {
                    event.preventDefault();
                    window.history.replaceState(null, "", `#docs-${activeDoc.name}/${section.id}`);
                    goToSection(section.id);
                  }}>{section.label}</a>)}
              </nav>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
