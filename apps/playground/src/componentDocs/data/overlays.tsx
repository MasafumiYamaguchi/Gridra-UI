import { GridraButton, GridraCheckbox, GridraCluster, GridraIconButton, GridraInput, GridraLabel, GridraPopover, GridraStack, GridraTooltip } from "@gridra-ui/react";
import type { ComponentDoc } from "../types";

export const overlaysDocs: ComponentDoc[] = [
  {
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
  },
  {
    category: "Overlays",
    name: "GridraPopover",
    summary: "Click-triggered non-modal overlay panel positioned relative to an anchor element.",
    description:
      "GridraPopover renders transient overlay content next to a trigger element on click. It supports viewport collision flipping, Escape key dismissal, and outside-click dismissal. Positioned with fixed coordinates matching the GridraTooltip placement engine.",
    importExample: 'import { GridraPopover } from "@gridra-ui/react";',
    props: [
      { name: "children", type: "ReactElement", required: true, description: "A single trigger element that toggles the popover on click." },
      { name: "content", type: "ReactNode", required: true, description: "Content rendered inside the popover." },
      { name: "placement", type: '"top" | "right" | "bottom" | "left"', default: '"bottom"', description: "Preferred placement relative to the trigger." },
      { name: "size", type: '"sm" | "md" | "lg"', default: '"md"', description: "Size token controlling padding and font size." },
      { name: "maxWidth", type: "number | string", description: "Maximum width override for the popover." },
      { name: "open", type: "boolean", description: "Controlled open state." },
      { name: "defaultOpen", type: "boolean", default: "false", description: "Initial open state when uncontrolled." },
      { name: "onOpenChange", type: "(next: boolean, previous: boolean) => void", description: "Callback fired when the controlled open state should change." },
      { name: "disabled", type: "boolean", default: "false", description: "Prevents the popover from opening." },
      { name: "closeOnEscape", type: "boolean", default: "true", description: "Whether pressing Escape closes the popover." },
      { name: "closeOnOutsidePointerDown", type: "boolean", default: "true", description: "Whether clicking outside the trigger and popover closes it." },
    ],
    options: [
      "placements: top | right | bottom | left",
      "sizes: sm | md | lg",
      "controlled or uncontrolled open state",
      "viewport flip on collision",
      "Escape key dismissal",
      "outside click dismissal",
    ],
    features: [
      "Click-triggered toggle with aria-expanded and aria-controls.",
      "Positioned with fixed coordinates — same engine as GridraTooltip.",
      "Automatic viewport-collision flip to opposite placement.",
      "Composes with existing trigger onClick and ref without breaking them.",
      "Non-modal overlay. No focus trap, arrow, or portal in v1.",
    ],
    usage: "Use GridraPopover for controls-and-settings panels, selection palettes, and contextual pickers that open beside a trigger button. It is intentionally non-modal so the user can see and click the main surface while the popover is open.",
    avoid: "Avoid using GridraPopover as a modal dialog replacement — use a dedicated Dialog/Modal component for blocking overlays, focus traps, and backdrop behavior.",
    compositions: [
      "GridraPopover + GridraStack/GridraCluster: layout popover content.",
      "GridraPopover + GridraButton: icon-triggered settings panel.",
      "GridraPopover + GridraCheckbox / GridraSelect: palette-style filters.",
    ],
    examples: [
      {
        title: "Basic popover",
        code: `<GridraPopover
  content={
    <GridraStack gap="sm" style={{ minWidth: 160 }}>
      <GridraLabel>Options</GridraLabel>
      <GridraStack gap="xs">
        <GridraCheckbox label="Snap to grid" defaultChecked />
        <GridraCheckbox label="Show labels" />
      </GridraStack>
    </GridraStack>
  }
>
  <GridraButton>Settings</GridraButton>
</GridraPopover>`,
      },
      {
        title: "Controlled popover",
        code: `const [open, setOpen] = useState(false);

<GridraPopover
  content={<GridraLabel>Controlled content</GridraLabel>}
  open={open}
  onOpenChange={(next) => setOpen(next)}
>
  <GridraButton>Toggle</GridraButton>
</GridraPopover>`,
      },
      {
        title: "Disabled popover",
        code: `<GridraPopover content="Unreachable" disabled>
  <GridraButton>Disabled trigger</GridraButton>
</GridraPopover>`,
      },
    ],
    preview: (
      <div className="docs-inline-preview">
        <GridraPopover
          content={
            <GridraStack gap="sm" style={{ minWidth: 160 }}>
              <GridraLabel>View</GridraLabel>
              <GridraStack gap="xs">
                <GridraCheckbox defaultChecked label="Guides" />
                <GridraCheckbox label="Labels" />
              </GridraStack>
            </GridraStack>
          }
          placement="bottom"
          defaultOpen
        >
          <GridraButton>Open</GridraButton>
        </GridraPopover>
        <GridraPopover
          content={
            <GridraStack gap="xs" style={{ minWidth: 120 }}>
              <GridraLabel>Filter</GridraLabel>
              <GridraInput defaultValue="" placeholder="Search..." />
            </GridraStack>
          }
          placement="right"
          size="sm"
        >
          <GridraButton variant="ghost">Filter</GridraButton>
        </GridraPopover>
      </div>
    ),
    accessibility:
      "The trigger receives aria-expanded reflecting open state and aria-controls pointing to the popover content ID. The popover itself does not use role=dialog since v1 is non-modal. Escape key closes by default. Outside pointer clicks close by default. When disabled, aria-expanded remains false regardless of click.",
  },
];
