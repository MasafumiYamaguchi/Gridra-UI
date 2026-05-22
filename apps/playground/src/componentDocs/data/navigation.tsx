import { GridraBadge, GridraBox, GridraLabel, GridraStack, GridraTabs } from "@gridra-ui/react";
import type { ComponentDoc } from "../types";

export const navigationDocs: ComponentDoc[] = [
  {
    category: "Navigation",
    name: "GridraTabs",
    summary: "Tabbed content switching with items-based API, ARIA tab panel pattern, and full keyboard navigation.",
    description:
      "GridraTabs renders a tablist with tab buttons and a single visible panel. It supports horizontal and vertical orientation, line and boxed variants, automatic and manual activation, and controlled/uncontrolled selection with roving tabindex keyboard navigation.",
    importExample: 'import { GridraTabs } from "@gridra-ui/react";',
    props: [
      { name: "items", type: "GridraTabItem[]", required: true, description: "Array of { id, label, content, disabled? }." },
      { name: "selectedId", type: "string", description: "Controlled selected tab id." },
      { name: "defaultSelectedId", type: "string", description: "Initial selected tab id when uncontrolled." },
      { name: "onSelectionChange", type: "(nextId, previousId) => void", description: "Callback when selection changes." },
      { name: "orientation", type: '"horizontal" | "vertical"', default: '"horizontal"', description: "Layout direction of the tab list." },
      { name: "size", type: '"sm" | "md" | "lg"', default: '"md"', description: "Tab padding and font size." },
      { name: "variant", type: '"line" | "boxed"', default: '"line"', description: "Visual style: underline or bordered box." },
      { name: "activationMode", type: '"automatic" | "manual"', default: '"automatic"', description: "Whether arrow keys also select the tab." },
    ],
    options: [
      "orientation: horizontal | vertical",
      "variant: line (underline) | boxed (bordered)",
      "sizes: sm | md | lg",
      "activation: automatic (focus=select) | manual (Enter/Space to select)",
      "controlled or uncontrolled selection",
      "disabled tabs",
    ],
    features: [
      "ARIA tab pattern: role=tablist/tab/tabpanel with aria-controls/aria-labelledby wiring.",
      "Roving tabindex keyboard navigation: Arrow keys, Home, End.",
      "Automatic mode selects on focus move; manual mode uses Enter/Space.",
      "Disabled tabs are non-interactive and skipped by keyboard.",
      "Only the active panel is rendered.",
      "line variant: selected tab gets an accent underline. boxed: bordered box background.",
    ],
    usage: "Use GridraTabs for switching between related content panels in dense UIs. Prefer it for static tab sets like settings pages, inspector panels, and content filters. For complex navigation (routers, deeply nested tabs), compose with your own routing layer.",
    avoid: "Avoid using GridraTabs as a router replacement for page-level navigation. Nested tabs, closable tabs, and lazy-loaded panel content are not supported in v1.",
    compositions: [
      "GridraTabs + GridraBox/GridraStack: panel content layout.",
      "GridraTabs + GridraLabel/GridraBadge: tab decoration.",
    ],
    examples: [
      {
        title: "Basic horizontal tabs",
        code: `<GridraTabs
  items={[
    { id: "general", label: "General", content: <GridraBox padding="md">General settings</GridraBox> },
    { id: "account", label: "Account", content: <GridraBox padding="md">Account settings</GridraBox> },
    { id: "security", label: "Security", content: <GridraBox padding="md">Security settings</GridraBox> },
  ]}
/>`,
      },
      {
        title: "Controlled tabs",
        code: `const [tab, setTab] = useState("general");

<GridraTabs
  items={items}
  selectedId={tab}
  onSelectionChange={(next) => setTab(next)}
/>`,
      },
      {
        title: "Boxed variant with manual activation",
        code: `<GridraTabs
  items={items}
  activationMode="manual"
  variant="boxed"
/>`,
      },
    ],
    preview: (
      <GridraTabs
        items={[
          { id: "general", label: "General", content: <GridraBox padding="md"><GridraLabel>General settings panel</GridraLabel><GridraStack gap="xs"><GridraBadge size="sm">Default</GridraBadge><GridraBadge size="sm" tone="muted">v1.0</GridraBadge></GridraStack></GridraBox> },
          { id: "account", label: "Account", content: <GridraBox padding="md"><GridraLabel>Account settings</GridraLabel><GridraStack gap="xs"><GridraBadge size="sm" tone="accent">Premium</GridraBadge></GridraStack></GridraBox> },
          { id: "security", label: "Security", content: <GridraBox padding="md"><GridraLabel>Security settings</GridraLabel><GridraBadge size="sm" tone="muted">2FA enabled</GridraBadge></GridraBox> },
        ].slice(0, 3)}
        variant="line"
      />
    ),
    accessibility:
      "Uses role=tablist on the tab container, role=tab on each button, and role=tabpanel on the content panel. Tabs are linked to panels via aria-controls (tab) and aria-labelledby (panel). Disabled tabs have aria-disabled=true. Keyboard: Arrow keys move focus, Home/End jump to extremes. Automatic mode selects on focus; manual mode uses Enter/Space.",
  },
];
