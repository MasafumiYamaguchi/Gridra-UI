import { GridraBadge, GridraLabel, GridraPanel } from "@gridra-ui/react";
import type { ComponentDoc } from "../../types";

export const panelDoc: ComponentDoc = {
    category: "Core",
    name: "GridraPanel",
    summary: "Dense side panel container with optional heading and header action.",
    description:
      "GridraPanel is a dense sidebar container with a header (title + actions) and a scrollable body. It uses the panel width token from the theme and is designed to be placed inside GridraRoot.",
    importExample: 'import { GridraPanel } from "@gridra-ui/react";',
    props: [
      { name: "heading", type: "ReactNode", description: "Panel title rendered as an h2." },
      { name: "header", type: "ReactNode", description: "Additional header content rendered next to the heading." },
      { name: "position", type: "\"left\" | \"right\"", default: "\"left\"", description: "Panel position class modifier." },
      { name: "children", type: "ReactNode", description: "Body content." },
      { name: "className", type: "string", description: "Additional CSS classes." }
    ],
    options: ["heading", "header", "position: left | right", "HTML aside attributes"],
    features: ["Provides header and scrollable body regions.", "Uses panel width tokens from the theme."],
    examples: [
      {
        title: "Panel with header",
        code: `<GridraPanel heading="Tools" header={<GridraBadge>PRO</GridraBadge>}>
  <GridraLabel>Body content</GridraLabel>
</GridraPanel>`
      }
    ],
    preview: (
      <div className="docs-panel-preview">
        <GridraPanel heading="Panel" header={<GridraBadge>Tools</GridraBadge>}>
          <GridraLabel>Body</GridraLabel>
        </GridraPanel>
      </div>
    )
  };
