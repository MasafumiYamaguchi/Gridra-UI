import { GridraSnapGuides } from "@gridra-ui/react";
import type { ComponentDoc } from "../../types";

export const snapGuideDoc: ComponentDoc = {
    category: "Core",
    name: "GridraSnapGuide",
    summary: "Alignment guide for drag and resize interactions.",
    description:
      "GridraSnapGuide renders thin alignment lines during drag and resize interactions. It supports both absolute pixel positioning and grid placement coordinates. GridraSnapGuides is a helper that renders multiple guides.",
    importExample: 'import { GridraSnapGuide, GridraSnapGuides } from "@gridra-ui/react";',
    props: [
      { name: "orientation", type: "\"vertical\" | \"horizontal\"", default: "\"vertical\"", description: "Line direction." },
      { name: "position", type: "number", description: "Pixel coordinate for absolute positioning." },
      { name: "start", type: "number", default: "0", description: "Start offset in pixels." },
      { name: "end", type: "number", description: "End offset in pixels." },
      { name: "placement", type: "GridraSnapGuidePlacement", description: "Grid-based placement { column, row, columnSpan, rowSpan }." },
      { name: "active", type: "boolean", default: "true", description: "Whether the guide is active. Inactive guides are not rendered." },
      { name: "visible", type: "boolean", default: "true", description: "Whether the guide is visible." },
      { name: "className", type: "string", description: "Additional CSS classes." }
    ],
    options: [
      "orientation: vertical | horizontal",
      "position",
      "placement",
      "active",
      "visible",
      "GridraSnapGuides guides[] helper",
      "HTML div attributes"
    ],
    features: [
      "Can render from pixel coordinates.",
      "Can render from grid placement.",
      "GridraSnapGuides renders multiple guides without changing the single-guide primitive."
    ],
    examples: [
      {
        title: "Multiple guides",
        code: `<GridraSnapGuides
  guides={[
    { end: 72, orientation: "vertical", position: 48 },
    { end: 120, orientation: "horizontal", position: 36 }
  ]}
/>`
      }
    ],
    preview: (
      <div className="docs-guide-preview">
        <GridraSnapGuides
          guides={[
            { end: 72, orientation: "vertical", position: 48 },
            { end: 120, orientation: "horizontal", position: 36 }
          ]}
        />
      </div>
    )
  };
