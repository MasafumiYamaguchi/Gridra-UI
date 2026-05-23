import { GridraBadge, GridraCanvasArea, GridraPanel, GridraRoot } from "@gridra-ui/react";
import type { ComponentDoc } from "../../types";

export const rootDoc: ComponentDoc = {
    category: "Core",
    name: "GridraRoot",
    summary: "Application shell that owns the Gridra visual scope and optional side panel layout.",
    description:
      "GridraRoot is the top-level application wrapper. It applies the root CSS custom properties (theme tokens), sets the dark background, and creates a two-column shell when a panel is provided. Place it once at the root of your app.",
    importExample: 'import { GridraRoot } from "@gridra-ui/react";',
    props: [
      { name: "panel", type: "ReactNode", description: "Optional side panel content rendered inside GridraPanel." },
      { name: "panelPosition", type: "\"left\" | \"right\"", default: "\"left\"", description: "Side of the panel relative to main content." },
      { name: "children", type: "ReactNode", description: "Main application content rendered in the center." },
      { name: "className", type: "string", description: "Additional CSS classes." },
      { name: "style", type: "CSSProperties", description: "Inline styles." }
    ],
    options: ["panel", "panelPosition: left | right", "HTML div attributes"],
    features: ["Applies the root theme class.", "Creates a main surface with optional left or right panel."],
    examples: [
      {
        title: "With left panel",
        code: `<GridraRoot panel={<GridraPanel heading="Tools" />}>
  <GridraCanvasArea nodes={nodes} />
</GridraRoot>`
      }
    ],
    preview: (
      <div className="docs-mini-shell">
        <GridraBadge tone="muted">panel</GridraBadge>
        <GridraBadge tone="accent">main</GridraBadge>
      </div>
    )
  };
