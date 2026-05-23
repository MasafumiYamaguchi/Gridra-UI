import { GridraAccordion, GridraBox, GridraLabel } from "@gridra-ui/react";
import type { ComponentDoc } from "../../types";

export const accordionDoc: ComponentDoc = {
    category: "Navigation",
    name: "GridraAccordion",
    summary: "Expandable sections with items-based API, single/multiple open modes, keyboard navigation, and defensive state normalization.",
    description:
      "GridraAccordion renders a list of expandable panels, each with a header button and collapsible content region. It supports single and multiple open modes, controlled and uncontrolled value APIs, collapsible behavior, and full keyboard navigation. Invalid inputs (non-existent ids, disabled items, type mismatches) are gracefully handled without crashes.",
    importExample: 'import { GridraAccordion } from "@gridra-ui/react";',
    props: [
      { name: "items", type: "GridraAccordionItem[]", required: true, description: "Array of { id, title, content, disabled? }." },
      { name: "type", type: '"single" | "multiple"', default: '"single"', description: "Whether only one or multiple panels can be open at a time." },
      { name: "value", type: "GridraAccordionValue", description: "Controlled open item(s). string for single, string[] for multiple." },
      { name: "defaultValue", type: "GridraAccordionValue", description: "Initial open item(s) when uncontrolled. Single defaults to first enabled item." },
      { name: "onValueChange", type: "(nextValue, previousValue) => void", description: "Callback when open state changes." },
      { name: "collapsible", type: "boolean", default: "false", description: "In single mode, allows closing the currently open item." },
      { name: "size", type: '"sm" | "md" | "lg"', default: '"md"', description: "Padding and font size." },
      { name: "variant", type: '"default" | "divided"', default: '"default"', description: "Visual style: borderless or with item dividers." },
    ],
    options: [
      "type: single (one open) | multiple (many open)",
      "collapsible: allow closing all panels in single mode",
      "controlled (value + onValueChange) or uncontrolled (defaultValue)",
      "disabled items",
      "sizes: sm | md | lg",
      "variant: default | divided",
      "defensive normalization of invalid values",
    ],
    features: [
      "ARIA accordion pattern: buttons with aria-expanded and aria-controls, panels with role=region and aria-labelledby.",
      "Keyboard navigation: ArrowDown/ArrowUp move focus; Home/End jump to extremes. Enter/Space toggle via native button.",
      "Disabled items are non-interactive, non-focusable, and skipped in keyboard navigation.",
      "Closed panels are unmounted (content not in DOM).",
      "Invalid values (non-existent ids, disabled ids, type mismatches) are silently normalized without crashing.",
      "Duplicate item ids render without crashes, using the first matching valid item.",
    ],
    usage: "Use GridraAccordion for FAQ sections, settings panels, or any collapsible content groups. Prefer it over custom collapse implementations for accessibility compliance. For dynamic content where panel state must persist when closed, manage the content state outside the component.",
    compositions: [
      "GridraAccordion + GridraBox/GridraStack: panel content layout.",
      "GridraAccordion + GridraField: setting forms inside panels.",
    ],
    examples: [
      {
        title: "Default single accordion",
        code: `<GridraAccordion
  items={[
    { id: "general", title: "General", content: "General settings content." },
    { id: "account", title: "Account", content: "Account settings content." },
    { id: "security", title: "Security", content: "Security settings content." },
  ]}
/>`,
      },
      {
        title: "Multiple mode with controlled value",
        code: `const [value, setValue] = useState<string[]>(["general"]);

<GridraAccordion
  type="multiple"
  value={value}
  onValueChange={setValue}
  items={items}
/>`,
      },
      {
        title: "Collapsible single mode",
        code: `<GridraAccordion
  collapsible={true}
  items={items}
/>`,
      },
    ],
    preview: (
      <GridraBox padding="md" style={{ width: 300 }}>
        <GridraAccordion
          items={[
            { id: "general", title: "General", content: <GridraBox padding="sm"><GridraLabel>General settings</GridraLabel></GridraBox> },
            { id: "account", title: "Account", content: <GridraBox padding="sm"><GridraLabel>Account settings</GridraLabel></GridraBox> },
            { id: "security", title: "Security", content: <GridraBox padding="sm"><GridraLabel>Security settings</GridraLabel></GridraBox> },
          ]}
        />
      </GridraBox>
    ),
    accessibility:
      "Each header is a button element with aria-expanded (true/false) and aria-controls pointing to the panel id. Panels use role='region' and aria-labelledby pointing to the header id. Disabled items have disabled and aria-disabled='true'. All items are focusable via keyboard navigation (Arrow keys, Home, End). Closed panels are removed from the DOM.",
  };
