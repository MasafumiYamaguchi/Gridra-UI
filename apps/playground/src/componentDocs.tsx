import { useState, type ReactNode } from "react";
import {
  GridraAvatar,
  GridraBadge,
  GridraButton,
  GridraCheckbox,
  GridraConnectionHandle,
  GridraDivider,
  GridraDragHandle,
  GridraField,
  GridraGrid,
  GridraIconButton,
  GridraInput,
  GridraLabel,
  GridraNode,
  GridraPanel,
  GridraRadio,
  GridraResizeHandle,
  GridraSelect,
  GridraSelectionBox,
  GridraSlider,
  GridraSnapGuide,
  GridraSpinner,
  GridraSwitch,
  GridraTextarea,
  GridraToolbar
} from "@gridra-ui/react";

export interface ComponentDoc {
  category: string;
  features: string[];
  name: string;
  options: string[];
  preview: ReactNode;
  summary: string;
}

const avatarImageUrl = "https://i.pravatar.cc/96?img=12";

export const componentDocs: ComponentDoc[] = [
  {
    category: "Core",
    name: "GridraRoot",
    summary: "Application shell that owns the Gridra visual scope and optional side panel layout.",
    options: ["panel", "panelPosition: left | right", "HTML div attributes"],
    features: ["Applies the root theme class.", "Creates a main surface with optional left or right panel."],
    preview: (
      <div className="docs-mini-shell">
        <GridraBadge tone="muted">panel</GridraBadge>
        <GridraBadge tone="accent">main</GridraBadge>
      </div>
    )
  },
  {
    category: "Core",
    name: "GridraCanvasArea",
    summary: "Spatial editing area for grid-based nodes, selection, dragging, resizing, and connections.",
    options: [
      "nodes",
      "renderNode",
      "gridColumns / gridRows",
      "selectedId / selectedIds",
      "nodePlacements / nodeConnections",
      "enableRangeSelection / enableNodeDragging / enableNodeResizing / enableNodeConnecting",
      "onSelectionChange / onSelectionIdsChange / onNodePlacementsChange / onNodeConnectionsChange"
    ],
    features: [
      "Renders nodes inside a CSS grid.",
      "Supports controlled and uncontrolled node placement state.",
      "Can draw connection lines and range-selection overlays."
    ],
    preview: (
      <div className="docs-canvas-preview">
        <GridraNode id="docs-canvas-node" placement={{ column: 1, row: 1, columnSpan: 2, rowSpan: 1 }} selected>
          Node
        </GridraNode>
      </div>
    )
  },
  {
    category: "Core",
    name: "GridraGrid",
    summary: "Compact selectable item grid for dense lists and panel navigation.",
    options: ["items", "columns", "selectedId", "onSelectionChange", "emptyLabel", "HTML div attributes"],
    features: ["Renders items as selectable buttons.", "Marks the selected item with aria-selected."],
    preview: (
      <GridraGrid
        columns={2}
        items={[
          { id: "a", label: "Input" },
          { id: "b", label: "Output" }
        ]}
        selectedId="a"
      />
    )
  },
  {
    category: "Core",
    name: "GridraPanel",
    summary: "Dense side panel container with optional heading and header action.",
    options: ["heading", "header", "position: left | right", "HTML aside attributes"],
    features: ["Provides header and scrollable body regions.", "Uses panel width tokens from the theme."],
    preview: (
      <div className="docs-panel-preview">
        <GridraPanel heading="Panel" header={<GridraBadge>Tools</GridraBadge>}>
          <GridraLabel>Body</GridraLabel>
        </GridraPanel>
      </div>
    )
  },
  {
    category: "Core",
    name: "GridraNode",
    summary: "Grid-positioned node surface for canvas workflows.",
    options: ["id", "placement", "selected", "onSelect", "dragHandle", "resizeHandle", "connectionHandles", "HTML button attributes"],
    features: ["Maps grid placement to CSS grid coordinates.", "Can host drag, resize, and connection slots."],
    preview: (
      <div className="docs-node-preview">
        <GridraNode id="docs-node" placement={{ column: 1, row: 1, columnSpan: 1, rowSpan: 1 }} selected>
          Input
        </GridraNode>
      </div>
    )
  },
  {
    category: "Core",
    name: "GridraSelectionBox",
    summary: "Visual selection rectangle for drag selection or explicit placement.",
    options: ["rect", "placement", "visible", "HTML div attributes"],
    features: ["Supports pixel rect placement.", "Supports grid placement for canvas overlays."],
    preview: <GridraSelectionBox rect={{ x: 8, y: 8, width: 120, height: 48 }} />
  },
  {
    category: "Core",
    name: "GridraDragHandle",
    summary: "Decorative and interactive grip for node movement.",
    options: ["position: top-left | top-right | bottom-left | bottom-right | inline", "HTML span attributes"],
    features: ["Forwards pointer handlers.", "Can be used inline or absolutely positioned inside a node."],
    preview: <GridraDragHandle position="inline" />
  },
  {
    category: "Core",
    name: "GridraResizeHandle",
    summary: "Handle used to resize grid nodes.",
    options: ["position: right | bottom | bottom-right | inline", "HTML span attributes"],
    features: ["Forwards pointer handlers.", "Supports right, bottom, corner, and inline rendering."],
    preview: <GridraResizeHandle position="inline" />
  },
  {
    category: "Core",
    name: "GridraConnectionHandle",
    summary: "Input or output connection point for node graphs.",
    options: ["type: input | output", "position: top | right | bottom | left | inline", "active", "HTML span attributes"],
    features: ["Differentiates input and output shape.", "Supports active visual state."],
    preview: (
      <div className="docs-inline-preview">
        <GridraConnectionHandle kind="input" position="inline" />
        <GridraConnectionHandle active kind="output" position="inline" />
      </div>
    )
  },
  {
    category: "Core",
    name: "GridraSnapGuide",
    summary: "Alignment guide for drag and resize interactions.",
    options: ["orientation: vertical | horizontal", "position", "placement", "active", "visible", "HTML div attributes"],
    features: ["Can render from pixel coordinates.", "Can render from grid placement."],
    preview: (
      <div className="docs-guide-preview">
        <GridraSnapGuide end={72} orientation="vertical" position={48} />
        <GridraSnapGuide end={120} orientation="horizontal" position={36} />
      </div>
    )
  },
  {
    category: "Controls",
    name: "GridraToolbar",
    summary: "Toolbar with action metadata and optional custom action rendering.",
    options: ["actions", "onAction", "renderAction", "children", "HTML div attributes"],
    features: ["Sets role toolbar.", "Uses GridraButton for default actions."],
    preview: <GridraToolbar actions={[{ id: "select", label: "Select", pressed: true }, { id: "pan", label: "Pan" }]} />
  },
  {
    category: "Controls",
    name: "GridraButton",
    summary: "Standard text button for dense UI commands.",
    options: ["variant: default | primary | ghost", "pressed", "All button attributes"],
    features: ["Defaults type to button.", "Maps pressed state to aria-pressed."],
    preview: (
      <div className="docs-inline-preview">
        <GridraButton variant="primary">Primary</GridraButton>
        <GridraButton>Default</GridraButton>
        <GridraButton variant="ghost">Ghost</GridraButton>
      </div>
    )
  },
  {
    category: "Controls",
    name: "GridraIconButton",
    summary: "Square button for compact icon-only commands.",
    options: ["label", "variant: default | primary | ghost", "pressed", "title", "All button attributes"],
    features: ["Requires an accessible label.", "Uses label as fallback title and fallback glyph."],
    preview: (
      <div className="docs-inline-preview">
        <GridraIconButton label="Preview" pressed>
          P
        </GridraIconButton>
        <GridraIconButton label="Add" variant="ghost">
          +
        </GridraIconButton>
      </div>
    )
  },
  {
    category: "Controls",
    name: "GridraField",
    summary: "Label, control, hint, and error wrapper.",
    options: ["label", "htmlFor", "hint", "error", "children", "HTML div attributes"],
    features: ["Associates label with a control.", "Shows error instead of hint when both are present."],
    preview: (
      <GridraField hint="1 to 24" htmlFor="docs-columns" label="Columns">
        <GridraInput id="docs-columns" defaultValue="12" />
      </GridraField>
    )
  },
  {
    category: "Controls",
    name: "GridraInput",
    summary: "Text-like input styled with Gridra tokens.",
    options: ["type", "aria-invalid", "value / defaultValue", "All input attributes"],
    features: ["Defaults type to text.", "Uses invalid styling through aria-invalid."],
    preview: <GridraInput aria-label="Name" defaultValue="Node label" />
  },
  {
    category: "Controls",
    name: "GridraSelect",
    summary: "Native select styled for dense panels.",
    options: ["value / defaultValue", "children option elements", "aria-invalid", "All select attributes"],
    features: ["Keeps native keyboard and form behavior.", "Uses Gridra input border and focus styles."],
    preview: (
      <GridraSelect aria-label="Mode" defaultValue="select">
        <option value="select">Select</option>
        <option value="pan">Pan</option>
      </GridraSelect>
    )
  },
  {
    category: "Controls",
    name: "GridraTextarea",
    summary: "Multi-line text input for notes and longer properties.",
    options: ["value / defaultValue", "aria-invalid", "All textarea attributes"],
    features: ["Supports vertical resizing.", "Uses the same invalid styling as input and select."],
    preview: <GridraTextarea aria-label="Notes" defaultValue="Dense controls for node editing." />
  },
  {
    category: "Controls",
    name: "GridraCheckbox",
    summary: "Checkbox with optional inline label.",
    options: ["label", "checked / defaultChecked", "disabled", "All checkbox input attributes except type"],
    features: ["Keeps native checkbox semantics.", "Uses a custom square mark."],
    preview: <GridraCheckbox defaultChecked label="Snap" />
  },
  {
    category: "Controls",
    name: "GridraRadio",
    summary: "Radio control with optional inline label.",
    options: ["label", "checked / defaultChecked", "name", "value", "All radio input attributes except type"],
    features: ["Keeps native radio grouping.", "Uses a custom circular mark."],
    preview: (
      <div className="docs-inline-preview">
        <GridraRadio defaultChecked label="Compact" name="docs-density" />
        <GridraRadio label="Comfort" name="docs-density" />
      </div>
    )
  },
  {
    category: "Controls",
    name: "GridraSwitch",
    summary: "Button-based switch for binary settings.",
    options: ["checked", "label", "disabled", "All button attributes except role"],
    features: ["Sets role switch.", "Maps checked to aria-checked."],
    preview: <GridraSwitch checked label="Preview" />
  },
  {
    category: "Controls",
    name: "GridraSlider",
    summary: "Range input for numeric values.",
    options: ["min", "max", "step", "value / defaultValue", "All range input attributes except type"],
    features: ["Uses native range behavior.", "Theme renders a square track and thumb."],
    preview: <GridraSlider aria-label="Opacity" defaultValue="72" max={100} min={0} />
  },
  {
    category: "Display",
    name: "GridraLabel",
    summary: "Standalone label typography primitive.",
    options: ["htmlFor", "children", "All label attributes"],
    features: ["Matches Gridra uppercase panel typography.", "Can label native or custom controls."],
    preview: <GridraLabel>Properties</GridraLabel>
  },
  {
    category: "Display",
    name: "GridraBadge",
    summary: "Small status or metadata chip.",
    options: ["tone: default | accent | muted", "children", "HTML span attributes"],
    features: ["Supports neutral, accent, and muted tones.", "Uses compact uppercase typography."],
    preview: (
      <div className="docs-inline-preview">
        <GridraBadge>Default</GridraBadge>
        <GridraBadge tone="accent">Accent</GridraBadge>
        <GridraBadge tone="muted">Muted</GridraBadge>
      </div>
    )
  },
  {
    category: "Display",
    name: "GridraAvatar",
    summary: "Image or fallback avatar for people, agents, or entities.",
    options: [
      "src",
      "alt",
      "fallback",
      "size: sm | md | lg | number | string",
      "shape: square | rounded | circle",
      "monochrome",
      "HTML span attributes"
    ],
    features: [
      "Renders an image when src exists.",
      "Falls back to initials or the first two alt characters.",
      "Supports preset and custom CSS sizes.",
      "Can render square, softly rounded, or circular shapes.",
      "Can apply monochrome image treatment."
    ],
    preview: (
      <div className="docs-inline-preview">
        <GridraAvatar alt="Demo avatar" fallback="UI" shape="square" size="sm" src={avatarImageUrl} />
        <GridraAvatar alt="Demo avatar" fallback="UI" shape="rounded" size="md" src={avatarImageUrl} />
        <GridraAvatar alt="Demo avatar" fallback="UI" monochrome shape="circle" size="lg" src={avatarImageUrl} />
        <GridraAvatar fallback="UI" shape="circle" size={34} />
      </div>
    )
  },
  {
    category: "Display",
    name: "GridraSpinner",
    summary: "Small loading indicator.",
    options: ["label", "HTML span attributes"],
    features: ["Sets role status.", "Uses label as the accessible status name."],
    preview: <GridraSpinner label="Loading" />
  },
  {
    category: "Display",
    name: "GridraDivider",
    summary: "Horizontal or vertical separator.",
    options: ["orientation: horizontal | vertical", "HTML hr attributes"],
    features: ["Sets role separator.", "Maps orientation to aria-orientation."],
    preview: (
      <div className="docs-divider-preview">
        <GridraDivider />
        <GridraDivider orientation="vertical" />
      </div>
    )
  }
];

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
          <section className="docs-detail__preview">
            <GridraLabel>Preview</GridraLabel>
            <div className="docs-card__preview">{activeDoc.preview}</div>
          </section>
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
