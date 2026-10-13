import { GridraBadge, GridraBox, GridraSplitPane } from "@gridra-ui/react";
import type { ComponentDoc } from "../../types";

export const splitPaneDoc: ComponentDoc = {
    category: "Layout",
    name: "GridraSplitPane",
    summary: "Two- or three-pane layout primitive with draggable separator and controlled/uncontrolled sizing.",
    description:
      "GridraSplitPane provides a two- or three-pane split layout with draggable separators. Give the container a definite height. Two children use size/defaultSize; three children use sizes/defaultSizes. Controlled examples must pass the updated state back to the component. It supports horizontal and vertical orientation, controlled or uncontrolled size, and percent-based min/max constraints. Use it for editor shells, inspector splits, and resizable work areas.",
    importExample: 'import { useState } from "react";\nimport { GridraSplitPane } from "@gridra-ui/react";',
    props: [
      { name: "orientation", type: "\"horizontal\" | \"vertical\"", default: "\"horizontal\"", description: "Split direction." },
      { name: "size", type: "number", description: "Controlled primary pane size in percent (0-100)." },
      { name: "defaultSize", type: "number", default: "50", description: "Uncontrolled initial primary pane size in percent." },
      { name: "sizes", type: "number[]", description: "Controlled sizes for three panes; provide at least three entries. Ratios are normalized to 100%." },
      { name: "defaultSizes", type: "number[]", description: "Initial three-pane ratios; defaults to [30, 40, 30]. Read only on mount." },
      { name: "minSize", type: "number", default: "10", description: "Minimum primary size for two panes; adjacent-pane lower bound when resizing three panes." },
      { name: "maxSize", type: "number", default: "90", description: "Maximum primary size for two panes; adjacent-pane upper bound when resizing three panes." },
      { name: "onSizeChange", type: "(next, previous) => void", description: "Called when pane size changes." },
      { name: "onSizesChange", type: "(next, previous) => void", description: "Called with (next, previous) normalized ratios. Equivalent updates are not emitted." },
      { name: "children", type: "ReactNode", description: "Two or three panes. Missing panes are empty; children after the third are ignored." }
    ],
    options: [
      "orientation: horizontal | vertical",
      "size / defaultSize",
      "sizes / defaultSizes",
      "minSize / maxSize",
      "onSizeChange / onSizesChange",
      "HTML div attributes"
    ],
    features: [
      "Draggable separator with pointer capture.",
      "Focus a separator with Tab; arrows resize by 2 percentage points, Home/End move to the allowed limits.",
      "Controlled and uncontrolled sizing with percent constraints.",
      "Supports two-pane and three-pane layouts with backward compatibility."
    ],
    examples: [
      {
        title: "Horizontal split",
        code: `<GridraSplitPane defaultSize={60} minSize={20} maxSize={80}>
  <GridraBox padding="sm" surface="input">Pane A</GridraBox>
  <GridraBox padding="sm" surface="input">Pane B</GridraBox>
</GridraSplitPane>`
      },
      {
        title: "Vertical controlled split",
        code: `const [size, setSize] = useState(50);

<GridraSplitPane orientation="vertical" size={size} onSizeChange={setSize}>
  <GridraBox padding="sm" surface="input">Top</GridraBox>
  <GridraBox padding="sm" surface="input">Bottom</GridraBox>
</GridraSplitPane>`
      },
      {
        title: "Three-pane controlled split",
        code: `const [sizes, setSizes] = useState([30, 40, 30]);

<GridraSplitPane sizes={sizes} onSizesChange={setSizes}>
  <GridraBox padding="sm" surface="input">Pane A</GridraBox>
  <GridraBox padding="sm" surface="input">Pane B</GridraBox>
  <GridraBox padding="sm" surface="input">Pane C</GridraBox>
</GridraSplitPane>`
      }
    ],
    preview: (
      <div className="docs-inline-preview" style={{ height: 170 }}>
        <GridraSplitPane defaultSizes={[28, 42, 30]} minSize={15} maxSize={85}>
          <GridraBox padding="sm" surface="input">
            <GridraBadge size="sm">Pane A</GridraBadge>
          </GridraBox>
          <GridraBox padding="sm" surface="input">
            <GridraBadge size="sm" tone="accent">Pane B</GridraBadge>
          </GridraBox>
          <GridraBox padding="sm" surface="input">
            <GridraBadge size="sm">Pane C</GridraBadge>
          </GridraBox>
        </GridraSplitPane>
      </div>
    )
  };
