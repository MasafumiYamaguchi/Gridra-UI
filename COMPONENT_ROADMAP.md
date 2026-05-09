# Component Roadmap

This file tracks the component surface for Gridra UI before adding more features.
Use it as the shared memory for what exists, what comes next, and what should wait.

## Status Legend

- `[x]` Implemented enough to export from `@gridra-ui/react`
- `[~]` Partially implemented or needs design/API hardening
- `[ ]` Not started

## Current Implemented Surface

- [x] `GridraRoot`
- [x] `GridraCanvasArea`
- [x] `GridraGrid`
- [x] `GridraPanel`
- [x] `GridraNode`
- [~] `GridraSelectionBox` visual primitive only
- [x] `GridraToolbar`
- [x] `GridraButton`
- [x] `GridraField`
- [x] `GridraInput`
- [x] `GridraSelect`

## Priority 1: Gridra Core

These components define the library's identity as a dense, panel-based spatial UI toolkit.

- [x] Root / Provider
- [x] Canvas Area / Viewport Base
- [x] Grid
- [x] Panel
- [x] Node
- [~] Selection Box visual primitive
- [ ] Drag Handle
- [ ] Resize Handle
- [ ] Connection Handle
- [ ] Snap Guide
- [ ] Minimap
- [ ] Inspector Panel
- [ ] Properties Panel

## Priority 2: Basic Controls

These should stay small, predictable, and useful both inside Gridra components and in consumer apps.

- [x] Button
- [ ] Icon Button
- [x] Input
- [x] Select
- [ ] Textarea
- [ ] Checkbox
- [ ] Radio
- [ ] Switch
- [ ] Slider
- [x] Field
- [ ] Label
- [ ] Badge
- [ ] Avatar
- [ ] Spinner / Loader
- [ ] Divider

## Priority 3: Layout

Layout components should support dense application surfaces rather than marketing-style pages.

- [ ] Box
- [ ] Stack
- [ ] Inline
- [ ] Cluster
- [ ] Grid Layout
- [ ] Container
- [ ] Split Pane
- [ ] Resizable Panel Group
- [ ] Sidebar
- [ ] Header
- [ ] Footer

## Priority 4: Overlays And Interaction

These need careful keyboard, focus, and layering behavior before they are considered stable.

- [ ] Tooltip
- [ ] Popover
- [ ] Dialog / Modal
- [ ] Drawer
- [ ] Dropdown Menu
- [ ] Context Menu
- [ ] Command Palette
- [ ] Hover Card

## Priority 5: Navigation

Useful once the playground and documentation need more structure.

- [ ] Tabs
- [ ] Breadcrumb
- [ ] Accordion
- [ ] Tree View
- [ ] Menu
- [ ] Pagination
- [ ] Stepper

## Priority 6: Feedback

These communicate async state, validation, and empty/error states.

- [ ] Alert
- [ ] Toast
- [ ] Progress
- [ ] Skeleton
- [ ] Empty State
- [ ] Error Message
- [ ] Status Indicator

## Priority 7: Data Display

Keep these display-first at the beginning. Add stateful variants only when a real use case appears.

- [ ] Card
- [ ] List
- [ ] Table
- [ ] Data Table
- [ ] Description List
- [ ] Stat
- [ ] Tag
- [ ] Code Block
- [ ] Kbd
- [ ] Timeline

## Priority 8: Advanced Controls

These are useful but should wait until the lower-level primitives are stable.

- [ ] Combobox
- [ ] Autocomplete
- [ ] Date Picker
- [ ] Time Picker
- [ ] Color Picker
- [ ] File Upload
- [ ] Virtual List
- [ ] Rich Text Editor
- [ ] Code Editor
- [ ] Calendar

## Suggested Implementation Order

1. Harden the current exported components and ensure their APIs feel consistent.
2. Add missing basic controls that the Gridra-specific components will need internally.
3. Add spatial editing components such as selection, handles, resize, snap, and inspector panels.
4. Add overlays only after focus management and portal strategy are decided.
5. Add data display and advanced controls after concrete product examples exist in the playground.

## Component Notes

### GridraSelectionBox

Current status: partial.

Implemented:

- Visual selection frame component exported from `@gridra-ui/react`.
- Supports pixel-based `rect` placement.
- Supports grid-based `placement`.
- Supports `visible` for display toggling.
- Used in the playground as a selection-frame preview.

Not implemented yet:

- Pointer drag behavior.
- Rect calculation from pointer start/current positions.
- Hit testing nodes inside the selection rectangle.
- Multi-selection state such as `selectedIds`.
- Keyboard modifiers such as shift-add or command-toggle.

Current data flow:

```text
external rect or grid placement
  -> GridraSelectionBox
  -> visual selection frame
```

Future interactive data flow:

```text
pointer down
  -> capture origin point
  -> pointer move
  -> derive selection rect
  -> hit test canvas items
  -> update selected ids
  -> render GridraSelectionBox
```

## Design Notes To Keep In Mind

- Prefer small composable primitives over large stateful components at first.
- Separate visual components from behavior-heavy spatial editing logic.
- Keep CSS token usage consistent across theme, React components, and playground examples.
- Treat accessibility behavior as part of the component API, especially for overlays and controls.
- For complex canvas-like interaction, define the data flow first:

```text
pointer event
  -> normalize coordinates
  -> update interaction state
  -> derive visual state
  -> render handles/guides/selection
  -> emit stable callback
```

## Debug And Research Keywords

- WAI-ARIA Authoring Practices
- React controlled vs uncontrolled components
- Roving tabindex
- Focus trap
- Portal layering
- CSS custom properties design tokens
- Pointer Events API
- ResizeObserver
- IntersectionObserver
- Virtualized list accessibility
