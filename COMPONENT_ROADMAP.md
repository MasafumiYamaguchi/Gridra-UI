# Component Roadmap

This file tracks the component surface for Gridra UI before adding more features.
Use it as the shared memory for what exists, what comes next, and what should wait.

Before changing implementation or tests, read [DEVELOPMENT_NOTES.md](./DEVELOPMENT_NOTES.md).

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
- [x] `GridraSelectionBox`
- [x] `GridraDragHandle`
- [x] `GridraResizeHandle`
- [x] `GridraConnectionHandle`
- [x] `GridraSnapGuide`
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
- [x] Selection Box
- [x] Drag Handle
- [x] Resize Handle
- [x] Connection Handle
- [x] Snap Guide
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

Current status: implemented.

Implemented:

- Visual selection frame component exported from `@gridra-ui/react`.
- Supports pixel-based `rect` placement.
- Supports grid-based `placement`.
- Supports `visible` for display toggling.
- `GridraCanvasArea` renders it during pointer drag.
- `GridraCanvasArea` calculates the drag rectangle from pointer start/current positions.
- `GridraCanvasArea` hit tests nodes inside the selection rectangle.
- `GridraCanvasArea` supports multi-selection state with `selectedIds`, `defaultSelectedIds`, and `onSelectionIdsChange`.
- The playground demonstrates range selection by dragging on the canvas background.

Not implemented yet:

- Keyboard modifiers such as shift-add or command-toggle.
- Additive range selection. Current drag selection replaces `selectedIds`.

Current data flow:

```text
external rect or grid placement, or CanvasArea drag state
  -> GridraSelectionBox
  -> visual selection frame
```

Interactive data flow:

```text
pointer down
  -> capture origin point
  -> pointer move
  -> derive selection rect
  -> hit test canvas items
  -> update selected ids
  -> render GridraSelectionBox
```

### GridraDragHandle

Current status: implemented.

Implemented:

- Decorative grip component exported from `@gridra-ui/react`.
- Supports corner and inline position classes.
- Forwards span attributes and pointer handlers so consumers can attach drag behavior.
- `GridraNode` exposes a `dragHandle` slot.
- `GridraCanvasArea` can optionally move nodes with `enableNodeDragging`.
- `GridraCanvasArea` supports controlled or uncontrolled `nodePlacements`.
- `GridraCanvasArea` emits `onNodeMove` and `onNodePlacementsChange`.
- The playground can toggle node dragging from the toolbar.

Not implemented yet:

- Keyboard repositioning semantics.
- Multi-node dragging.
- Snap guide visualization while dragging.

Current data flow:

```text
handle pointer down
  -> capture node id and origin placement
  -> pointer move
  -> convert pointer delta to grid-cell delta
  -> normalize placement inside grid bounds
  -> update nodePlacements
  -> render moved node
```

### GridraResizeHandle

Current status: implemented.

Implemented:

- Resize handle component exported from `@gridra-ui/react`.
- Supports right, bottom, bottom-right, and inline position classes.
- `GridraNode` exposes a `resizeHandle` slot.
- `GridraCanvasArea` can optionally resize selected nodes with `enableNodeResizing`.
- Resizing updates `columnSpan` and `rowSpan` through the existing `nodePlacements` state.
- `GridraCanvasArea` emits `onNodeResize`.
- The playground can toggle node resizing from the toolbar.

Not implemented yet:

- Left/top resizing that changes both origin and span.
- Keyboard resizing semantics.
- Multi-node resizing.
- Min/max span constraints beyond grid bounds.

Current data flow:

```text
resize handle pointer down
  -> capture node id and origin placement
  -> pointer move
  -> convert pointer delta to grid-span delta
  -> normalize span inside grid bounds
  -> update nodePlacements
  -> render resized node
```

### GridraConnectionHandle

Current status: implemented.

Implemented:

- Connection handle component exported from `@gridra-ui/react`.
- Supports top, right, bottom, left, and inline position classes.
- Supports input and output handle variants.
- Supports active visual state.
- `GridraNode` exposes a `connectionHandles` slot.
- `GridraCanvasArea` can optionally render node connection handles with `enableNodeConnecting`.
- `GridraCanvasArea` supports controlled or uncontrolled `nodeConnections`.
- `GridraCanvasArea` emits `onNodeConnectionStart`, `onNodeConnect`, and `onNodeConnectionCancel`.
- `GridraCanvasArea` renders persisted connections as SVG paths.
- `GridraCanvasArea` supports `connectionLineWidth` for configurable connection stroke width.
- Connection lines can be clicked to highlight them.
- Range selection can highlight multiple connection lines.
- Highlighted connection lines can be deleted with Delete or Backspace.
- Highlighted connection lines clear when the canvas background or another node action is used.
- The playground can toggle node connection handles from the toolbar.

Not implemented yet:

- Connection preview line while dragging.
- Hit testing beyond direct handle pointer targets.
- Validation rules for allowed source/target pairs.
- Keyboard connection semantics.

Current data flow:

```text
output handle pointer down
  -> capture source node id
  -> input handle pointer up
  -> derive target node id
  -> update nodeConnections
  -> render connection path
  -> emit connection callback
```

### GridraSnapGuide

Current status: implemented.

Implemented:

- Visual snap guide component exported from `@gridra-ui/react`.
- Supports vertical and horizontal guide orientation.
- Supports pixel-based `position`, `start`, and `end` placement for absolute overlays.
- Supports grid-based `placement` for guide rendering inside grid containers.
- Supports `active` and `visible` for display toggling.
- `GridraCanvasArea` renders drag guides while moving selected nodes.
- `GridraCanvasArea` renders resize guides while resizing selected nodes.

Not implemented yet:

- Multi-guide rendering helper.
- Snap candidate matching against other nodes or grid landmarks.

Current data flow:

```text
snap candidate from interaction logic
  -> orientation plus pixel position or grid placement
  -> GridraSnapGuide
  -> visual alignment line
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
