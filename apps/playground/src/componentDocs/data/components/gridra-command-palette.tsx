import { GridraButton, GridraCommandPalette } from "@gridra-ui/react";
import type { ComponentDoc } from "../../types";

export const commandPaletteDoc: ComponentDoc = {
    category: "Overlays",
    name: "GridraCommandPalette",
    summary: "Search-driven modal command palette with portal, filtering, groups, and full keyboard navigation.",
    description:
      "GridraCommandPalette renders a modal command palette via portal with a search input, filtered command list, and optional group labels. It matches plain string/number label and description values, plus group and keywords, with case-insensitive substring search. Uses the Dialog-style backdrop and focus management for a familiar overlay experience.",
    importExample: 'import { GridraCommandPalette } from "@gridra-ui/react";',
    props: [
      { name: "items", type: "GridraCommandPaletteItem[]", required: true, description: "Array of command items (id, label, description?, group?, keywords?, disabled?, destructive?) and optional separator items." },
      { name: "onAction", type: "(id: string) => void", description: "Called with the item id when a command is activated." },
      { name: "open", type: "boolean", description: "Controlled open state." },
      { name: "defaultOpen", type: "boolean", default: "false", description: "Initial open state when uncontrolled." },
      { name: "onOpenChange", type: "(next, previous) => void", description: "Callback when open state should change." },
      { name: "placeholder", type: "string", default: '"Search commands..."', description: "Placeholder text for the search input." },
      { name: "title", type: "ReactNode", default: '"Command Palette"', description: "Heading rendered in the palette header." },
      { name: "emptyLabel", type: "ReactNode", default: '"No commands found."', description: "Shown when no commands match the query." },
      { name: "size", type: '"sm" | "md" | "lg"', default: '"md"', description: "Max-width variant: 400px, 560px, 720px." },
      { name: "query", type: "string", description: "Controlled query string." },
      { name: "defaultQuery", type: "string", default: '""', description: "Initial query when uncontrolled." },
      { name: "onQueryChange", type: "(next, previous) => void", description: "Callback when query should change." },
      { name: "closeOnAction", type: "boolean", default: "true", description: "Whether activating a command closes the palette." },
      { name: "closeOnEscape", type: "boolean", default: "true", description: "Whether Escape closes the palette." },
      { name: "showCloseButton", type: "boolean", default: "true", description: "Whether to render the close button." },
    ],
    options: [
      "search: case-insensitive substring across plain label/description text, group, keywords",
      "groups: render group labels for matching items with a group field",
      "sizes: sm (400px) | md (560px) | lg (720px)",
      "controlled/uncontrolled open and query state",
      "portal rendering with backdrop and focus restore",
      "full keyboard navigation: Arrow keys, Home, End, Enter, Escape",
    ],
    features: [
      "Portal-based modal surface with backdrop  Esame overlay strategy as GridraDialog.",
      "Search input focused on open; filters commands in real time.",
      "Matches across plain string/number label and description values, group, and keywords.",
      "Use keywords for commands with JSX labels or rich descriptions.",
      "Group labels shown for items with the group field (automatic, no caller pre-sort).",
      "Full keyboard: ArrowDown/Up, Home/End, Enter, Escape, and modal Tab focus trapping.",
      "Disabled commands are rendered, skipped by keyboard, and never activate.",
      "Focus restores to the previously focused element on close.",
      "Query resets on close for uncontrolled mode.",
    ],
    usage: "Use GridraCommandPalette for quick-command search UIs, app-wide command launchers, and any overlay that needs to filter and select from a list of named actions. Wire Cmd/Ctrl+K to control the open prop externally.",
    avoid: "Avoid using GridraCommandPalette as a generic combobox or autocomplete in forms. It is a modal overlay, not an inline input. Checkbox/radio commands and nested pages are not supported in v1.",
    compositions: [
      "GridraCommandPalette + global keyboard event: Cmd/Ctrl+K to toggle open.",
      "GridraCommandPalette + GridraButton: toolbar shortcut to open the palette.",
    ],
    examples: [
      {
        title: "Basic command palette",
        code: `<GridraCommandPalette
  items={[
    { id: "new", label: "New File", description: "Create", group: "File" },
    { id: "open", label: "Open", description: "Browse", group: "File" },
    { id: "save", label: "Save", group: "File" },
    { type: "separator" as const },
    { id: "undo", label: "Undo", group: "Edit" },
    { id: "redo", label: "Redo", group: "Edit" },
  ]}
  onAction={(id) => console.log(id)}
/>`,
      },
      {
        title: "Controlled with trigger",
        code: `const [open, setOpen] = useState(false);

<>
  <GridraButton onClick={() => setOpen(true)}>
    Cmd Palette
  </GridraButton>
  <GridraCommandPalette
    items={items}
    open={open}
    onOpenChange={(next) => setOpen(next)}
    onAction={(id) => { handle(id); setOpen(false); }}
  />
</>`,
      },
    ],
    preview: (
      <div className="docs-inline-preview">
        <GridraCommandPalette
          items={[
            { id: "new", label: "New File", description: "Create", group: "File", keywords: ["add"] },
            { id: "open", label: "Open", description: "Browse", group: "File" },
            { id: "save", label: "Save", group: "File" },
            { type: "separator" as const },
            { id: "undo", label: "Undo", group: "Edit" },
            { id: "delete", label: "Delete", destructive: true },
          ]}
          defaultOpen
          size="sm"
        />
      </div>
    ),
    accessibility:
      "The palette uses role=dialog with aria-modal=true and aria-labelledby pointing to the heading. The search input is focusable. Command items are rendered as buttons. Arrow keys, Home, End, Enter, and Escape control navigation and selection. Focus is restored to the previously focused element on close.",
  };
