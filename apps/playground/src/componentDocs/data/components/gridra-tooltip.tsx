import { GridraButton, GridraCluster, GridraIconButton, GridraTooltip } from "@gridra-ui/react";
import type { ComponentDoc } from "../../types";

export const tooltipDoc: ComponentDoc = {
    category: "Overlays",
    name: "GridraTooltip",
    summary: "Lightweight tooltip with hover/focus trigger and top/right/bottom/left placement.",
    description:
      "GridraTooltip shows short helper text for an anchor element. It supports hover and focus triggers, controlled and uncontrolled open state, four-direction placement, and optional maxWidth override for custom sizing.",
    importExample: 'import { GridraTooltip } from "@gridra-ui/react";',
    props: [
      { name: "content", type: "ReactNode", required: true, description: "Tooltip body content." },
      { name: "placement", type: '"top" | "right" | "bottom" | "left"', default: '"top"', description: "Preferred tooltip position." },
      { name: "size", type: '"sm" | "md" | "lg"', default: '"md"', description: "Density token for tooltip body." },
      { name: "maxWidth", type: "number | string", description: "Optional max width override. Number values are px." },
      { name: "open", type: "boolean", description: "Controlled open state." },
      { name: "defaultOpen", type: "boolean", default: "false", description: "Uncontrolled initial open state." },
      { name: "onOpenChange", type: "(next, previous) => void", description: "Called when open state changes." },
      { name: "showDelay", type: "number", default: "120", description: "Delay before opening in ms." },
      { name: "disabled", type: "boolean", default: "false", description: "Disables tooltip behavior." },
      { name: "children", type: "ReactElement", required: true, description: "Single anchor element." }
    ],
    options: [
      "content",
      "placement: top | right | bottom | left",
      "size: sm | md | lg",
      "maxWidth: number | string",
      "open / defaultOpen / onOpenChange",
      "showDelay / disabled"
    ],
    features: [
      "Hover and focus trigger support.",
      "Controlled and uncontrolled open state.",
      "Simple viewport collision fallback by opposite-side flip.",
      "Size token plus maxWidth override."
    ],
    examples: [
      {
        title: "Basic tooltip",
        code: `<GridraTooltip content="Helpful hint" placement="top">
  <GridraButton size="sm">Hover me</GridraButton>
</GridraTooltip>`
      },
      {
        title: "Custom width",
        code: `<GridraTooltip
  content="Longer text with width control."
  placement="right"
  size="lg"
  maxWidth={280}
>
  <GridraIconButton label="Info">i</GridraIconButton>
</GridraTooltip>`
      }
    ],
    preview: (
      <GridraCluster align="center" gap="sm">
        <GridraTooltip content="Top tooltip" placement="top">
          <GridraButton size="sm">Top</GridraButton>
        </GridraTooltip>
        <GridraTooltip content="Right tooltip with wider content area" maxWidth={220} placement="right" size="lg">
          <GridraButton size="sm">Right</GridraButton>
        </GridraTooltip>
        <GridraTooltip content="Bottom tooltip" placement="bottom">
          <GridraButton size="sm">Bottom</GridraButton>
        </GridraTooltip>
      </GridraCluster>
    )
  };
