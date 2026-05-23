import { GridraBox, GridraButton, GridraCheckbox, GridraDialog, GridraLabel, GridraStack } from "@gridra-ui/react";
import type { ComponentDoc } from "../../types";

export const dialogDoc: ComponentDoc = {
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
      "Portal-based rendering via createPortal  Efirst component to use portals.",
      "role=dialog, aria-modal=true, aria-labelledby/aria-describedby wired automatically.",
      "Focus trap: Tab and Shift+Tab cycle through focusable elements inside the dialog.",
      "Focus restore: returns focus to the previously focused element or trigger on close.",
      "Composes with existing trigger onClick and ref without breaking them.",
      "Backdrop click only closes when the pointer event starts on the backdrop itself.",
    ],
    usage: "Use GridraDialog for confirmation prompts, settings forms, detail views, and any blocking overlay that requires user acknowledgment. Prefer it over Popover when the user should not interact with the main surface while the overlay is open.",
    avoid: "Avoid nesting Dialogs inside other Dialogs or Popovers without a clear focus-management strategy. Avoid using GridraDialog for non-blocking tooltips or inline pickers  Euse Popover or Tooltip instead.",
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
  };
