import { GridraButton, GridraDropdownMenu } from "@gridra-ui/react";
import type { ComponentDoc } from "../../types";

export const dropdownMenuDoc: ComponentDoc = {
    category: "Overlays",
    name: "GridraDropdownMenu",
    summary: "Command dropdown menu with items-based API, full keyboard navigation, and WAI-ARIA menu semantics.",
    description:
      "GridraDropdownMenu renders a role=menu near a trigger element with fixed positioning. It accepts an items array of commands and separators, handles arrow-key navigation, Home/End jumping, Enter/Space activation, and Escape/outside-click close. v1 is command-only  Echeckbox, radio, and submenu are deferred.",
    importExample: 'import { GridraDropdownMenu } from "@gridra-ui/react";',
    props: [
      { name: "children", type: "ReactElement", required: true, description: "A single trigger element that toggles the menu on click." },
      { name: "items", type: "GridraDropdownMenuItem[]", required: true, description: "Array of command items ({ id, label, disabled?, destructive? }) and separator items ({ type: 'separator' })." },
      { name: "onAction", type: "(id: string) => void", description: "Called with the item id when a command is activated." },
      { name: "placement", type: '"top" | "right" | "bottom" | "left"', default: '"bottom"', description: "Preferred placement." },
      { name: "size", type: '"sm" | "md" | "lg"', default: '"md"', description: "Size token for item padding and font." },
      { name: "minWidth", type: "number | string", description: "Minimum width override." },
      { name: "maxWidth", type: "number | string", description: "Maximum width override." },
      { name: "open", type: "boolean", description: "Controlled open state." },
      { name: "defaultOpen", type: "boolean", default: "false", description: "Initial open state when uncontrolled." },
      { name: "onOpenChange", type: "(next, previous) => void", description: "Callback when open state should change." },
      { name: "disabled", type: "boolean", default: "false", description: "Disables the entire dropdown." },
      { name: "closeOnEscape", type: "boolean", default: "true", description: "Whether Escape closes the menu." },
      { name: "closeOnOutsidePointerDown", type: "boolean", default: "true", description: "Whether outside clicks close." },
      { name: "closeOnAction", type: "boolean", default: "true", description: "Whether activating an item closes the menu." },
    ],
    options: [
      "items: command items with id, label, disabled?, destructive?",
      "separators: { type: 'separator' }",
      "placements: top | right | bottom | left",
      "sizes: sm | md | lg",
      "keyboard: ArrowDown/Up, Home/End, Enter/Space, Escape",
      "trigger keyboard: ArrowDown/Enter/Space to open",
    ],
    features: [
      "WAI-ARIA menu semantics: role=menu, role=menuitem, role=separator.",
      "Trigger wired with aria-haspopup=menu, aria-expanded, aria-controls.",
      "Full keyboard navigation with active item tracking.",
      "Disabled items are rendered, skipped by keyboard, and never fire onAction.",
      "Destructive items receive a visual accent treatment.",
      "Fixed positioning engine shared with GridraPopover.",
      "Viewport collision flip to opposite placement.",
    ],
    usage: "Use GridraDropdownMenu for command menus, action pickers, and context-selectors that need menu-semantic keyboard behavior. Prefer it over Popover when the content is a list of menu commands.",
    avoid: "Avoid using GridraDropdownMenu for generic content panels (use GridraPopover) or modal interactions (use GridraDialog). Checkbox/radio/submenu items are not supported in v1.",
    compositions: [
      "GridraDropdownMenu + GridraButton: toolbar-style command menu.",
      "GridraDropdownMenu + GridraIconButton: icon-triggered actions menu.",
    ],
    examples: [
      {
        title: "Basic command menu",
        code: `<GridraDropdownMenu
  items={[
    { id: "new", label: "New" },
    { id: "open", label: "Open" },
    { type: "separator" as const },
    { id: "delete", label: "Delete", destructive: true },
  ]}
  onAction={(id) => console.log(id)}
>
  <GridraButton>Actions</GridraButton>
</GridraDropdownMenu>`,
      },
      {
        title: "With disabled item",
        code: `<GridraDropdownMenu
  items={[
    { id: "save", label: "Save" },
    { id: "rename", label: "Rename", disabled: true },
    { type: "separator" as const },
    { id: "close", label: "Close" },
  ]}
>
  <GridraButton>File</GridraButton>
</GridraDropdownMenu>`,
      },
    ],
    preview: (
      <div className="docs-inline-preview">
        <GridraDropdownMenu
          items={[
            { id: "new", label: "New" },
            { id: "open", label: "Open" },
            { type: "separator" as const },
            { id: "delete", label: "Delete", destructive: true },
          ]}
          placement="bottom"
          defaultOpen
        >
          <GridraButton>Actions</GridraButton>
        </GridraDropdownMenu>
        <GridraDropdownMenu
          items={[
            { id: "copy", label: "Copy" },
            { id: "paste", label: "Paste" },
            { type: "separator" as const },
            { id: "undo", label: "Undo", disabled: true },
          ]}
          placement="right"
          size="sm"
        >
          <GridraButton variant="ghost">Edit</GridraButton>
        </GridraDropdownMenu>
      </div>
    ),
    accessibility:
      "Menu uses role=menu. Each command item uses role=menuitem. Separators use role=separator. The trigger has aria-haspopup=menu, aria-expanded, and aria-controls. Arrow keys, Home, End, Enter, and Space control navigation and activation. Escape closes. Disabled items are rendered but not focusable and are skipped during keyboard navigation.",
  };
