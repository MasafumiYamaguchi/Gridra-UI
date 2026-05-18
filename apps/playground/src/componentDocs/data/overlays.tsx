import { GridraButton, GridraCheckbox, GridraCluster, GridraDialog, GridraDropdownMenu, GridraIconButton, GridraInput, GridraLabel, GridraPopover, GridraStack, GridraTooltip } from "@gridra-ui/react";
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
  {
    category: "Overlays",
    name: "GridraDialog",
    summary: "Modal dialog with portal, backdrop, focus trap, and keyboard dismissal.",
    description:
      "GridraDialog renders a modal overlay into document.body via portal. It includes a backdrop, close button, Escape-key dismissal, backdrop-click dismissal, focus trap, and focus restore on close. The surface uses role=dialog with aria-modal, wired to title and description via IDs.",
    importExample: 'import { GridraDialog } from "@gridra-ui/react";',
    props: [
      { name: "children", type: "ReactElement", description: "Optional trigger element that opens the dialog on click." },
      { name: "title", type: "ReactNode", required: true, description: "Dialog title rendered as heading and used for aria-labelledby." },
      { name: "description", type: "ReactNode", description: "Optional descriptive text wired to aria-describedby." },
      { name: "content", type: "ReactNode", required: true, description: "Dialog body content." },
      { name: "open", type: "boolean", description: "Controlled open state." },
      { name: "defaultOpen", type: "boolean", default: "false", description: "Initial open state when uncontrolled." },
      { name: "onOpenChange", type: "(next: boolean, previous: boolean) => void", description: "Callback when open state should change." },
      { name: "size", type: '"sm" | "md" | "lg" | "fullscreen"', default: '"md"', description: "Dialog width variant." },
      { name: "closeLabel", type: "string", default: '"Close dialog"', description: "Accessible label for the close button." },
      { name: "closeOnEscape", type: "boolean", default: "true", description: "Whether Escape key closes the dialog." },
      { name: "closeOnBackdropPointerDown", type: "boolean", default: "true", description: "Whether clicking the backdrop closes the dialog." },
      { name: "showCloseButton", type: "boolean", default: "true", description: "Whether to render the close button in the header." },
      { name: "initialFocusRef", type: "RefObject<HTMLElement>", description: "Optional ref to an element to focus when the dialog opens." },
    ],
    options: [
      "sizes: sm (360px) | md (480px) | lg (640px) | fullscreen",
      "controlled or uncontrolled open state",
      "portal rendering to document.body",
      "backdrop with click-to-close",
      "Escape key dismissal",
      "focus trap with Tab/Shift+Tab wrapping",
      "focus restore to trigger on close",
      "close button with configurable label",
    ],
    features: [
      "Portal-based rendering via createPortal — first component to use portals.",
      "role=dialog, aria-modal=true, aria-labelledby/aria-describedby wired automatically.",
      "Focus trap: Tab and Shift+Tab cycle through focusable elements inside the dialog.",
      "Focus restore: returns focus to the previously focused element or trigger on close.",
      "Composes with existing trigger onClick and ref without breaking them.",
      "Backdrop click only closes when the pointer event starts on the backdrop itself.",
    ],
    usage: "Use GridraDialog for confirmation prompts, settings forms, detail views, and any blocking overlay that requires user acknowledgment. Prefer it over Popover when the user should not interact with the main surface while the overlay is open.",
    avoid: "Avoid nesting Dialogs inside other Dialogs or Popovers without a clear focus-management strategy. Avoid using GridraDialog for non-blocking tooltips or inline pickers — use Popover or Tooltip instead.",
    compositions: [
      "GridraDialog + GridraStack/GridraField/GridraButton: confirmation or settings forms.",
      "GridraDialog + GridraCheckbox / GridraSelect: parameter panels.",
      "GridraDialog + GridraInput / GridraTextarea: prompt-style input dialogs.",
    ],
    examples: [
      {
        title: "Basic trigger dialog",
        code: `<GridraDialog
  title="Confirm"
  description="Are you sure you want to proceed?"
  content={
    <GridraStack gap="sm">
      <GridraButton variant="primary">Proceed</GridraButton>
      <GridraButton variant="ghost">Cancel</GridraButton>
    </GridraStack>
  }
>
  <GridraButton>Open Dialog</GridraButton>
</GridraDialog>`,
      },
      {
        title: "Controlled dialog",
        code: `const [open, setOpen] = useState(false);

<GridraDialog
  content={<GridraLabel>Settings content</GridraLabel>}
  onOpenChange={(next) => setOpen(next)}
  open={open}
  title="Settings"
>
  <GridraButton>Configure</GridraButton>
</GridraDialog>`,
      },
      {
        title: "Fullscreen dialog",
        code: `<GridraDialog
  content={<GridraBox padding="md" surface="input">Full-width content</GridraBox>}
  size="fullscreen"
  title="Editor"
>
  <GridraButton>Expand</GridraButton>
</GridraDialog>`,
      },
    ],
    preview: (
      <div className="docs-inline-preview">
        <GridraDialog
          content={
            <GridraStack gap="sm">
              <GridraLabel>Dialog body content with settings and controls.</GridraLabel>
              <GridraStack gap="xs">
                <GridraCheckbox defaultChecked label="Enable feature" />
                <GridraCheckbox label="Send notifications" />
              </GridraStack>
            </GridraStack>
          }
          defaultOpen
          description="Configure your preferences below."
          size="sm"
          title="Preferences"
        >
          <GridraButton>Open Preferences</GridraButton>
        </GridraDialog>
      </div>
    ),
    accessibility:
      "The dialog surface uses role=dialog and aria-modal=true. The title is linked via aria-labelledby. The optional description is linked via aria-describedby. The trigger receives aria-haspopup=dialog and aria-expanded. Focus is moved into the dialog on open and restored to the trigger on close. Tab and Shift+Tab are trapped inside the dialog. Escape closes by default. The close button has an accessible label.",
  },
  {
    category: "Overlays",
    name: "GridraDropdownMenu",
    summary: "Command dropdown menu with items-based API, full keyboard navigation, and WAI-ARIA menu semantics.",
    description:
      "GridraDropdownMenu renders a role=menu near a trigger element with fixed positioning. It accepts an items array of commands and separators, handles arrow-key navigation, Home/End jumping, Enter/Space activation, and Escape/outside-click close. v1 is command-only — checkbox, radio, and submenu are deferred.",
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
  },
];
