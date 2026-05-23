import { GridraBox, GridraContextMenu, GridraLabel } from "@gridra-ui/react";
import type { ComponentDoc } from "../../types";

export const contextMenuDoc: ComponentDoc = {
    category: "Overlays",
    name: "GridraContextMenu",
    summary: "Right-click context menu with command/separator items, keyboard triggers, and viewport clamping.",
    description:
      "GridraContextMenu wraps a target element and opens a role=menu on right-click (contextmenu), ContextMenu key, or Shift+F10. It reuses the same item model as GridraDropdownMenu and applies viewport clamping to keep the menu on screen. Keyboard navigation mirrors the dropdown pattern.",
    importExample: 'import { GridraContextMenu } from "@gridra-ui/react";',
    props: [
      { name: "children", type: "ReactElement", required: true, description: "A single target element that receives contextmenu and keyboard handlers." },
      { name: "items", type: "GridraDropdownMenuItem[]", required: true, description: "Array of command and separator items  Esame type as GridraDropdownMenu." },
      { name: "onAction", type: "(id: string) => void", description: "Called with the item id when a command is activated." },
      { name: "size", type: '"sm" | "md" | "lg"', default: '"md"', description: "Size token for item padding and font." },
      { name: "minWidth", type: "number | string", description: "Minimum width override." },
      { name: "maxWidth", type: "number | string", description: "Maximum width override." },
      { name: "open", type: "boolean", description: "Controlled open state." },
      { name: "defaultOpen", type: "boolean", default: "false", description: "Initial open state when uncontrolled." },
      { name: "onOpenChange", type: "(next, previous) => void", description: "Callback when open state should change." },
      { name: "disabled", type: "boolean", default: "false", description: "Disables the entire context menu." },
      { name: "closeOnEscape", type: "boolean", default: "true", description: "Whether Escape closes the menu." },
      { name: "closeOnOutsidePointerDown", type: "boolean", default: "true", description: "Whether outside clicks close." },
      { name: "closeOnAction", type: "boolean", default: "true", description: "Whether activating an item closes the menu." },
    ],
    options: [
      "right-click (contextmenu) open with automatic native menu prevention",
      "keyboard open: ContextMenu key or Shift+F10",
      "viewport-relative positioning with collision clamping",
      "same item schema as GridraDropdownMenu",
      "full keyboard navigation: Arrow keys, Home, End, Enter, Space, Escape",
    ],
    features: [
      "Wraps a target element and composes with existing onContextMenu, onKeyDown, and ref.",
      "Prevents the native browser context menu with preventDefault().",
      "Opens at pointer coordinates for mouse, near target bottom-left for keyboard.",
      "Viewport clamping keeps the menu fully inside the screen.",
      "Reuses GridraDropdownMenu CSS classes for visual consistency.",
      "Same keyboard semantics: ArrowDown/Up, Home/End, Enter/Space, Escape, Tab.",
    ],
    usage: "Use GridraContextMenu for right-click menus on canvas elements, list items, nodes, or any surface that needs command access via context menu. Prefer it over GridraDropdownMenu when the trigger is a right-click or keyboard context event.",
    avoid: "Avoid using GridraContextMenu as a replacement for GridraDropdownMenu when the trigger is a normal click on a button. Checkbox/radio/submenu items are not supported in v1.",
    compositions: [
      "GridraContextMenu + GridraCanvasArea/GridraNode: spatial editing context menus.",
      "GridraContextMenu + GridraSelectableGrid: collection item right-click actions.",
    ],
    examples: [
      {
        title: "Basic context menu",
        code: `<GridraContextMenu
  items={[
    { id: "new", label: "New" },
    { id: "open", label: "Open" },
    { type: "separator" as const },
    { id: "delete", label: "Delete", destructive: true },
  ]}
  onAction={(id) => console.log(id)}
>
  <GridraBox border="default" padding="md" surface="input">
    <GridraLabel>Right-click here</GridraLabel>
  </GridraBox>
</GridraContextMenu>`,
      },
      {
        title: "With disabled item",
        code: `<GridraContextMenu
  items={[
    { id: "save", label: "Save" },
    { id: "rename", label: "Rename", disabled: true },
    { type: "separator" as const },
    { id: "close", label: "Close" },
  ]}
>
  <GridraBox border="default" padding="md" surface="input">
    <GridraLabel>Right-click or ContextMenu key</GridraLabel>
  </GridraBox>
</GridraContextMenu>`,
      },
    ],
    preview: (
      <div className="docs-inline-preview">
        <GridraContextMenu
          items={[
            { id: "new", label: "New" },
            { id: "open", label: "Open" },
            { type: "separator" as const },
            { id: "delete", label: "Delete", destructive: true },
          ]}
          defaultOpen
        >
          <GridraBox border="default" padding="md" surface="input">
            <GridraLabel>Right-click me</GridraLabel>
          </GridraBox>
        </GridraContextMenu>
      </div>
    ),
    accessibility:
      "The target receives aria-haspopup=menu and aria-expanded. The menu uses role=menu with role=menuitem items and role=separator for dividers. The native context menu is prevented. Arrow keys, Home, End, Enter, Space, Escape, and Tab control the menu. Focus is restored to the target on close.",
  };
