import { GridraAvatar, GridraBadge, GridraButton, GridraHoverCard, GridraInline, GridraLabel, GridraStack } from "@gridra-ui/react";
import type { ComponentDoc } from "../../types";

export const hoverCardDoc: ComponentDoc = {
    category: "Overlays",
    name: "GridraHoverCard",
    summary: "Interactive hover card with show/hide delays, positioned between Tooltip and Popover.",
    description:
      "GridraHoverCard shows rich preview content on hover/focus and stays open while the pointer is over the trigger or the card itself. It sits between GridraTooltip (short text) and GridraPopover (click-triggered)  Eideal for user profiles, item previews, and summary cards.",
    importExample: 'import { GridraHoverCard } from "@gridra-ui/react";',
    props: [
      { name: "children", type: "ReactElement", required: true, description: "A single trigger element." },
      { name: "content", type: "ReactNode", required: true, description: "Content rendered inside the hover card." },
      { name: "placement", type: '"top" | "right" | "bottom" | "left"', default: '"bottom"', description: "Preferred placement." },
      { name: "size", type: '"sm" | "md" | "lg"', default: '"md"', description: "Size token for padding and font." },
      { name: "width", type: "string", description: 'Optional CSS width, such as "320px", "32vw", or "50%".' },
      { name: "minWidth", type: "string", description: 'Optional CSS min-width, such as "240px" or "50%".' },
      { name: "maxWidth", type: "string", description: 'Optional CSS max-width, such as "80vw".' },
      { name: "height", type: "string", description: 'Optional CSS height, such as "60vh".' },
      { name: "minHeight", type: "string", description: 'Optional CSS min-height, such as "120px".' },
      { name: "maxHeight", type: "string", description: 'Optional CSS max-height, such as "40vh" or "calc(100vh - 48px)".' },
      { name: "open", type: "boolean", description: "Controlled open state." },
      { name: "defaultOpen", type: "boolean", default: "false", description: "Initial open state when uncontrolled." },
      { name: "onOpenChange", type: "(next, previous) => void", description: "Callback when open state changes." },
      { name: "showDelay", type: "number", default: "120", description: "Delay before opening in ms." },
      { name: "hideDelay", type: "number", default: "120", description: "Delay before closing in ms after leaving trigger/card." },
      { name: "disabled", type: "boolean", default: "false", description: "Disables hover card behavior." },
      { name: "closeOnEscape", type: "boolean", default: "true", description: "Whether Escape closes the card." },
    ],
    options: [
      "trigger: hover and focus with configurable showDelay/hideDelay",
      "interactive: stays open while pointer is on the card",
      "placements: top | right | bottom | left",
      "sizes: sm | md | lg",
      "CSS length sizing: width / minWidth / maxWidth / height / minHeight / maxHeight",
      "viewport flip on collision",
      "Escape key dismissal",
    ],
    features: [
      "Hover and focus trigger with independent show/hide delay timers.",
      "Interactive card: moving the pointer to the card cancels the hide timer.",
      "Fixed positioning engine shared with GridraTooltip and GridraPopover.",
      "Automatic viewport-collision flip to opposite placement.",
      "String-only CSS length sizing for px, %, vw, vh, rem, and calc() values.",
      "Composes with existing trigger handlers and ref without breaking them.",
      "ARIA: aria-expanded and aria-controls on the trigger.",
    ],
    usage: "Use GridraHoverCard for user profile cards, item previews, rich summary tooltips, and any hover-revealed content that needs more layout than a plain Tooltip but shouldn't require a click to open.",
    avoid: "Avoid using GridraHoverCard for menu-style lists or click-triggered panels (use GridraPopover or GridraDropdownMenu). Hover cards are inherently inaccessible on touch devices, so avoid placing critical actions only inside them.",
    compositions: [
      "GridraHoverCard + GridraAvatar / GridraBadge: user profile preview.",
      "GridraHoverCard + GridraStack / GridraLabel: item detail summary.",
    ],
    examples: [
      {
        title: "Basic hover card",
        code: `<GridraHoverCard
  content={
    <GridraStack gap="sm" style={{ minWidth: 200 }}>
      <GridraLabel>User Profile</GridraLabel>
      <GridraStack gap="xs">
        <GridraBadge>Premium</GridraBadge>
        <GridraBadge tone="muted">Member since 2024</GridraBadge>
      </GridraStack>
    </GridraStack>
  }
>
  <GridraAvatar fallback="UN" size="md" />
</GridraHoverCard>`,
      },
      {
        title: "Controlled hover card",
        code: `<GridraHoverCard
  content={<GridraLabel>Controlled content</GridraLabel>}
  open={isOpen}
  onOpenChange={(next) => setIsOpen(next)}
>
  <GridraButton>Info</GridraButton>
</GridraHoverCard>`,
      },
      {
        title: "Sized hover card",
        code: `<GridraHoverCard
  width="320px"
  minWidth="240px"
  maxHeight="40vh"
  content={<GridraLabel>Fixed-width preview content</GridraLabel>}
>
  <GridraButton>Preview</GridraButton>
</GridraHoverCard>`,
      },
    ],
    preview: (
      <div className="docs-inline-preview">
        <GridraHoverCard
          content={
            <GridraStack gap="sm" style={{ minWidth: 200 }}>
              <GridraInline align="center" gap="sm">
                <GridraAvatar fallback="JD" shape="circle" size="sm" />
                <GridraLabel>Jane Doe</GridraLabel>
              </GridraInline>
              <GridraStack gap="xs">
                <GridraBadge size="sm">Admin</GridraBadge>
                <GridraBadge size="sm" tone="muted">jane@gridra.dev</GridraBadge>
              </GridraStack>
            </GridraStack>
          }
          placement="bottom"
          showDelay={0}
          width="320px"
          maxHeight="40vh"
        >
          <GridraButton size="sm">Profile</GridraButton>
        </GridraHoverCard>
      </div>
    ),
    accessibility:
      "The trigger has aria-expanded reflecting the open state and aria-controls linking to the card ID while open. The card does not use role=tooltip or role=dialog  Eit is a non-modal preview panel. Interactive cards are inherently mouse-dependent; ensure critical information is also reachable via focus.",
  };
