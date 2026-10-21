import {
  GridraBadge,
  GridraBox,
  GridraStack,
  GridraSidebar,
} from "@gridra-ui/react";
import { SidebarToggleExample } from "./sidebar-toggle-example";
import type { ComponentDoc } from "../../types";

export const sidebarDoc: ComponentDoc = {
  category: "Layout",
  name: "GridraSidebar",
  summary:
    "App-shell sidebar primitive with left/right placement, open state, and optional resizing.",
  description:
    "GridraSidebar is a layout-only side region for dense app shells. It supports left/right side placement, controlled or uncontrolled open state, width and collapsedWidth behavior, and optional drag/keyboard resize with min/max bounds.",
  importExample: 'import { GridraSidebar } from "@gridra-ui/react";',
  props: [
    {
      name: "side",
      type: '"left" | "right"',
      default: '"left"',
      description: "Sidebar side placement.",
    },
    { name: "open", type: "boolean", description: "Controlled open state." },
    {
      name: "defaultOpen",
      type: "boolean",
      default: "true",
      description: "Uncontrolled initial open state.",
    },
    {
      name: "onOpenChange",
      type: "(next, previous) => void",
      description: "Called when open state changes.",
    },
    {
      name: "width",
      type: "number | string",
      default: "280",
      description: "Open width. Number values are px.",
    },
    {
      name: "collapsedWidth",
      type: "number | string",
      default: "0",
      description: "Closed width. Number values are px.",
    },
    {
      name: "resizable",
      type: "boolean",
      default: "false",
      description: "Enables separator drag and keyboard resize.",
    },
    {
      name: "minWidth",
      type: "number",
      default: "180",
      description: "Minimum width for resizable mode.",
    },
    {
      name: "maxWidth",
      type: "number",
      default: "480",
      description: "Maximum width for resizable mode.",
    },
    {
      name: "toggleSize",
      type: "number | string",
      default: "20",
      description:
        "Hamburger button size. Number values are px and clamped to 20px minimum.",
    },
    { name: "children", type: "ReactNode", description: "Sidebar content." },
  ],
  options: [
    "side: left | right",
    "open / defaultOpen / onOpenChange",
    "width / collapsedWidth",
    "resizable / minWidth / maxWidth",
    "toggleSize",
    "HTML aside attributes",
  ],
  features: [
    "App-shell side region with open/closed width transition.",
    "Controlled and uncontrolled open state.",
    "Built-in hamburger toggle button for open/close with configurable size.",
    "Optional resizable separator with keyboard support.",
  ],
  usage:
    "Use GridraSidebar for shell-level side regions (navigation, inspector, utility rail). Use GridraPanel for boxed panel content, not shell-width orchestration.",
  avoid:
    "Avoid using GridraSidebar as a drawer/modal replacement. Overlay, backdrop, and focus-trap behavior are out of scope for v1.",
  compositions: [
    "GridraSidebar + GridraBox/GridraStack: sidebar content layout.",
    "GridraSidebar + main content container: classic left or right app shell.",
  ],
  notes:
    "Behavior is provided by useGridraSidebar from @gridra-ui/headless. Use the same state and semantic bindings with your own DOM and CSS. Gridra visual variants and theme integration remain in @gridra-ui/react. " +
    "The built-in hamburger uses the exported GridraSidebarToggle. The unboxed icon becomes a close icon when expanded, with a visible keyboard focus ring and reduced-motion support. Sidebar keeps its existing 20px toggleSize default; use toggleSize={44} for touch interfaces. Standalone GridraSidebarToggle is 44px by default and accepts open/defaultOpen/onOpenChange(next, previous), native button attributes, disabled, and a button ref. Supply aria-controls for the region it controls and aria-label to customize the accessible name. It only toggles state; modal focus management and scroll locking belong to the application.",
  examples: [
    {
      title: "Custom markup with headless hook",
      code: 'import { useGridraSidebar } from "@gridra-ui/headless";\n\nexport default function Example() {\n  const sidebar=useGridraSidebar({defaultOpen:true,resizable:true});\n  return <aside><button aria-expanded={sidebar.currentOpen} onClick={sidebar.toggleOpen}>Toggle</button><div hidden={!sidebar.currentOpen}>Custom sidebar content</div><div {...sidebar.getSeparatorProps()} aria-label="Resize custom sidebar" /></aside>;\n}',
    },
    ...([
      {
        title: "Standalone navigation toggle",
        code: `import { useState } from "react";
import { GridraSidebarToggle } from "@gridra-ui/react";

function NavigationToggle() {
  const [open, setOpen] = useState(false);
  return <>
    <GridraSidebarToggle open={open} onOpenChange={setOpen} aria-controls="navigation-content" />
    <div id="navigation-content" hidden={!open}>Navigation content</div>
    <GridraSidebarToggle disabled aria-label="Unavailable navigation" />
  </>;
}`,
        preview: <SidebarToggleExample />,
      },
      {
        title: "Controlled left sidebar",
        code: `<GridraSidebar
  side="left"
  open={open}
  onOpenChange={setOpen}
  width={260}
  collapsedWidth={0}
>
  <GridraBox padding="sm" surface="input">Sidebar content</GridraBox>
</GridraSidebar>`,
      },
      {
        title: "Right resizable sidebar",
        code: `<GridraSidebar side="right" resizable minWidth={180} maxWidth={360}>
  <GridraBox padding="sm" surface="input">Inspector</GridraBox>
</GridraSidebar>`,
      },
    ] satisfies ComponentDoc["examples"]),
  ],
  preview: (
    <div className="docs-inline-preview" style={{ height: 170 }}>
      <GridraStack
        direction="horizontal"
        inline
        align="center"
        gap="sm"
        fullWidth
        style={{ height: "100%" }}
      >
        <GridraSidebar defaultOpen resizable side="left" width={180}>
          <GridraBox fullHeight padding="sm" surface="input">
            <GridraBadge size="sm">Sidebar</GridraBadge>
          </GridraBox>
        </GridraSidebar>
        <GridraBox fullWidth padding="sm" surface="raised">
          <GridraBadge size="sm" tone="muted">
            Main Content
          </GridraBadge>
        </GridraBox>
      </GridraStack>
    </div>
  ),
};
