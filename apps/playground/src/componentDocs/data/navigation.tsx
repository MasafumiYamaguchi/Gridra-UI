import { GridraBadge, GridraBox, GridraBreadcrumb, GridraLabel, GridraStack, GridraTabs } from "@gridra-ui/react";
import type { ComponentDoc } from "../types";

export const navigationDocs: ComponentDoc[] = [
  {
    category: "Navigation",
    name: "GridraBreadcrumb",
    summary: "Hierarchical path indicator using items with href, supporting current/disabled states and optional parentId validation.",
    description:
      "GridraBreadcrumb renders a breadcrumb trail as an ordered list inside a navigation landmark. Items can be links (href), current page indicators, or disabled entries. An optional maxItems prop collapses long trails with an ellipsis. When items carry parentId, the component validates that each item chains from the previous one and reports issues via onHierarchyInvalid.",
    importExample: 'import { GridraBreadcrumb } from "@gridra-ui/react";',
    props: [
      { name: "items", type: "GridraBreadcrumbItem[]", required: true, description: "Array of { id, label, href?, current?, disabled?, parentId? }." },
      { name: "size", type: '"sm" | "md" | "lg"', default: '"md"', description: "Font size of breadcrumb items." },
      { name: "separator", type: "ReactNode", default: '"/"', description: "Visual separator between items." },
      { name: "maxItems", type: "number", description: "Maximum visible items before collapsing middle with ellipsis. Clamped to minimum 3." },
      { name: "onHierarchyInvalid", type: "(issues: GridraBreadcrumbHierarchyIssue[]) => void", description: "Called when parentId validation detects broken or missing parent references." },
      { name: "aria-label", type: "string", default: '"Breadcrumb"', description: "Accessible label for the nav landmark." },
    ],
    options: [
      "sizes: sm | md | lg",
      "custom separator via ReactNode",
      "maxItems collapse with ellipsis",
      "optional parentId hierarchy validation",
    ],
    features: [
      "Rendered as nav with aria-label and ol/li structure.",
      "Items with href render as anchor links. Items without href render as spans.",
      "current items get aria-current='page' and no link.",
      "disabled items get a disabled class and no link.",
      "Separator is aria-hidden and only rendered between items.",
      "maxItems collapses excess items: first item + ellipsis + tail items.",
      "Hierarchy validation triggers onHierarchyInvalid and sets data-gridra-invalid-hierarchy on the nav.",
    ],
    usage: "Use GridraBreadcrumb to show the user's location within a hierarchical structure. Pass an array of trail items in order from root to leaf. For simple flat trails, omit parentId. For validated hierarchy, include parentId on each non-root item pointing to the previous item's id.",
    avoid: "GridraBreadcrumb does not compute paths from a tree structure automatically. Pass the trail in display order. It does not integrate with client-side routers (use href for plain links, or wrap with your router's Link component).",
    examples: [
      {
        title: "Basic breadcrumb",
        code: `<GridraBreadcrumb
  items={[
    { id: "home", label: "Home", href: "/" },
    { id: "projects", label: "Projects", href: "/projects" },
    { id: "detail", label: "My Project", current: true },
  ]}
/>`,
      },
      {
        title: "With maxItems collapse",
        code: `<GridraBreadcrumb
  maxItems={4}
  items={[
    { id: "home", label: "Home", href: "/" },
    { id: "a", label: "Category", href: "/category" },
    { id: "b", label: "Subcategory", href: "/category/sub" },
    { id: "c", label: "Item", href: "/category/sub/item" },
    { id: "d", label: "Details", href: "/category/sub/item/details" },
    { id: "detail", label: "Edit", current: true },
  ]}
/>`,
      },
      {
        title: "Validated parentId chain",
        code: `<GridraBreadcrumb
  items={[
    { id: "home", label: "Home", href: "/" },
    { id: "projects", label: "Projects", href: "/projects", parentId: "home" },
    { id: "detail", label: "Detail", href: "/projects/1", current: true, parentId: "projects" },
  ]}
  onHierarchyInvalid={(issues) => console.warn(issues)}
/>`,
      },
    ],
    preview: (
      <GridraBox padding="md">
        <GridraBreadcrumb
          items={[
            { id: "home", label: "Home", href: "#" },
            { id: "projects", label: "Projects", href: "#" },
            { id: "nested", label: "Nested", href: "#", parentId: "projects" },
            { id: "current", label: "Current Page", current: true, parentId: "nested" },
          ]}
        />
      </GridraBox>
    ),
    accessibility:
      "Root element is a nav with aria-label='Breadcrumb' (customizable). Items are ol > li. Current page has aria-current='page'. Separators have aria-hidden='true'. When hierarchy is invalid, data-gridra-invalid-hierarchy='true' is set on the nav. Links are standard anchor elements.",
  },
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
