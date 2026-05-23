import { GridraBadge, GridraBox, GridraInline, GridraMenu } from "@gridra-ui/react";
import type { ComponentDoc } from "../../types";

export const menuDoc: ComponentDoc = {
  category: "Navigation",
  name: "GridraMenu",
  summary: "Permanent navigation menu with item links, active state, and keyboard navigation.",
  description:
    "GridraMenu renders a persistent navigation menu as a nav landmark. Command items with href render as anchor links; items without href render as buttons that fire onAction. The activeId prop tracks the current page and applies aria-current='page'. Supports vertical and horizontal orientation, controlled/uncontrolled active state, and full keyboard navigation with Arrow keys and Home/End.",
  importExample: 'import { GridraMenu } from "@gridra-ui/react";',
  props: [
    { name: "items", type: "GridraMenuItem[]", required: true, description: "Array of command items ({ id, label, href?, disabled?, destructive? }) and separator items ({ type: 'separator' })." },
    { name: "activeId", type: "string", description: "Controlled active item id." },
    { name: "defaultActiveId", type: "string", description: "Initial active item id when uncontrolled." },
    { name: "onActiveIdChange", type: "(nextId, previousId) => void", description: "Callback when activeId changes." },
    { name: "onAction", type: "(id: string) => void", description: "Called with the item id when a non-href command item is clicked." },
    { name: "renderItem", type: "(item, state) => ReactNode", description: "Custom row content renderer for richer labels with badges/metadata." },
    { name: "orientation", type: '"vertical" | "horizontal"', default: '"vertical"', description: "Layout direction of the menu list." },
    { name: "size", type: '"sm" | "md" | "lg"', default: '"md"', description: "Row padding and font size." },
  ],
  options: [
    "vertical or horizontal orientation",
    "href items render as anchor links",
    "non-href items render as buttons with onAction",
    "controlled or uncontrolled activeId",
    "custom row content via renderItem",
    "sizes: sm | md | lg",
    "separators between groups of items",
    "destructive item styling",
  ],
  features: [
    "Rendered as nav landmark with aria-label.",
    "Active item gets aria-current='page' and a selected visual style.",
    "href items are native anchor elements with standard link behavior.",
    "Non-href items are buttons that call onAction and update activeId.",
    "Keyboard: ArrowDown/ArrowUp (vertical) or ArrowRight/ArrowLeft (horizontal) move focus between enabled items.",
    "Home/End jump to first/last enabled item.",
    "Disabled items are skipped by keyboard and clicks, and cannot be active.",
    "Invalid activeId values (non-existent, disabled) are silently ignored.",
    "Empty items array renders an empty nav without crashing.",
  ],
  usage:
    "Use GridraMenu for sidebar navigation, settings menus, or any permanent menu that should stay visible in the UI. Pair with GridraPanel for a classic sidebar menu pattern. For dropdown-style temporary command menus, use GridraDropdownMenu.",
  avoid:
    "Avoid using GridraMenu for popup or temporary menus — use GridraDropdownMenu or GridraContextMenu instead. Avoid relying on GridraMenu for complex multi-level navigation; submenus are not supported in v1.",
  compositions: [
    "GridraMenu + GridraPanel: sidebar navigation shell.",
    "GridraMenu + GridraSidebar: app-shell side navigation.",
  ],
  states: [
    {
      title: "Vertical menu with active item",
      code: `<GridraMenu
  items={[
    { id: "dashboard", label: "Dashboard" },
    { id: "projects", label: "Projects" },
    { type: "separator" as const },
    { id: "settings", label: "Settings" },
    { id: "logout", label: "Logout", destructive: true },
  ]}
  activeId="projects"
/>`,
    },
    {
      title: "Horizontal menu with links",
      code: `<GridraMenu
  items={[
    { id: "home", label: "Home", href: "/" },
    { id: "docs", label: "Docs", href: "/docs" },
    { id: "blog", label: "Blog", href: "/blog" },
  ]}
  orientation="horizontal"
  size="sm"
/>`,
    },
    {
      title: "With disabled items",
      code: `<GridraMenu
  items={[
    { id: "view", label: "View" },
    { id: "edit", label: "Edit" },
    { id: "delete", label: "Delete", disabled: true, destructive: true },
  ]}
/>`,
    },
  ],
  examples: [
    {
      title: "Sidebar menu pattern",
      description: "A typical vertical sidebar menu inside a box panel.",
      code: `<GridraBox border="default" padding="md" surface="input" style={{ width: 200 }}>
  <GridraMenu
    defaultActiveId="nodes"
    items={[
      { id: "nodes", label: "Nodes" },
      { id: "connections", label: "Connections" },
      { type: "separator" as const },
      { id: "preferences", label: "Preferences" },
    ]}
  />
</GridraBox>`,
    },
    {
      title: "Custom row content",
      description: "Use renderItem to add badges, counts, or icons alongside labels.",
      language: "tsx",
      code: `<GridraMenu
  items={items}
  renderItem={(item, state) => (
    <GridraInline align="center" gap="sm" fullWidth justify="between">
      <span>{item.label}</span>
      {state.active ? <GridraBadge size="sm" tone="accent">Active</GridraBadge> : null}
    </GridraInline>
  )}
/>`,
    },
    {
      title: "Controlled active state",
      code: `const [active, setActive] = useState("dashboard");

<GridraMenu
  items={items}
  activeId={active}
  onActiveIdChange={(next) => setActive(next)}
/>`,
    },
  ],
  preview: (
    <GridraBox border="default" padding="md" surface="input" style={{ width: 200 }}>
      <GridraMenu
        defaultActiveId="projects"
        items={[
          { id: "dashboard", label: "Dashboard" },
          { id: "projects", label: "Projects" },
          { type: "separator" as const },
          { id: "settings", label: "Settings" },
          { id: "logout", label: "Logout", destructive: true },
        ]}
      />
    </GridraBox>
  ),
  accessibility:
    "Root element is a nav with aria-label. Items are list items containing anchor elements (for href items) or button elements (for non-href items). The active item receives aria-current='page'. Separator list items use role='separator' and aria-hidden='true'. Keyboard navigation uses a roving tabindex pattern: only the active item has tabIndex=0, others have tabIndex=-1. Arrow keys and Home/End navigate between enabled items.",
};
