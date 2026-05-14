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
- [x] `GridraSelectableGrid` (`GridraGrid` is a compatibility alias)
- [x] `GridraPanel`
- [x] `GridraNode`
- [x] `GridraSelectionBox`
- [x] `GridraDragHandle`
- [x] `GridraResizeHandle`
- [x] `GridraConnectionHandle`
- [x] `GridraSnapGuide`
- [x] `GridraToolbar`
- [x] `GridraAvatar`
- [x] `GridraBadge`
- [x] `GridraButton`
- [x] `GridraCheckbox`
- [x] `GridraDivider`
- [x] `GridraField`
- [x] `GridraIconButton`
- [x] `GridraInput`
- [x] `GridraLabel`
- [x] `GridraRadio`
- [x] `GridraSelect`
- [x] `GridraSlider`
- [x] `GridraSpinner`
- [x] `GridraSwitch`
- [x] `GridraTextarea`
- [x] `GridraBox`
- [x] `GridraCluster`
- [x] `GridraGridLayout`
- [x] `GridraInline`
- [x] `GridraStack`

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
- [x] Icon Button
- [x] Input
- [x] Select
- [x] Textarea
- [x] Checkbox
- [x] Radio
- [x] Switch
- [x] Slider
- [x] Field
- [x] Label
- [x] Badge
- [x] Avatar
- [x] Spinner / Loader
- [x] Divider

## Priority 3: Layout

Layout components should support dense application surfaces rather than marketing-style pages.

- [x] Box
- [x] Stack
- [x] Inline
- [x] Cluster
- [x] Grid Layout
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

### GridraInline

Current status: implemented and reviewed. No blocking defect identified in the current exported surface.

Implemented:

- Horizontal-only inline layout primitive built on `GridraBox` with `inline-flex`.
- Supports `gap`, `align`, and `justify` modifiers aligned with the existing layout vocabulary.
- Supports `separator` rendering between direct, valid children only.
- Exports `GridraInlineItem` with `grow` for filling available horizontal space.
- Playground docs cover basic rows, separators, and trailing-action layouts.

Review notes:

- `justify="between"` only becomes visually meaningful when `GridraInline` has available width, such as `fullWidth` or a constrained parent layout.
- `GridraInlineItem grow` follows the same rule: it can only push later content when the inline row has horizontal space to distribute.
- `GridraInline` is not the wrapping primitive. Multi-line loose grouping should remain a `Cluster` concern.
- `separator` is a direct-child visual aid. It does not split inside fragments or provide semantic grouping on its own.

Potential follow-ups:

- Keep the docs explicit that spacing distribution examples assume `fullWidth` or equivalent parent width.
- Re-check `GridraInline` versus `Cluster` responsibilities when the wrapping layout primitive is designed.
- Add separator semantics and accessibility guidance if separators are promoted beyond purely decorative usage.

## Hardening Backlog From Component Review

### High Priority

- [x] `GridraCanvasArea`: duplicate node connections are not inserted twice, but `onNodeConnect` still fires for an already-existing edge. ~~Treat the callback contract as "new connection accepted" or rename/document it explicitly before connection validation expands.~~ Fixed: `onNodeConnect` now only fires when the connection is actually new.
- [x] `GridraAvatar`: image mode keeps `alt`, but fallback mode renders text inside a plain `span`. ~~Preserve an equivalent accessible name for fallback avatars so image and fallback states expose the same identity.~~ Fixed: fallback mode now exposes `role="img"` and `aria-label` derived from `alt` or `fallback`, matching the accessible surface of image mode.

### Medium Priority

- [x] `GridraGrid`: the empty state drops the normal `gridra-grid` root/className contract and returns only `gridra-grid__empty`. ~~Keep the outer component contract stable so layout selectors and sizing do not change when items become empty.~~ Fixed: empty state now preserves the `gridra-grid` wrapper with `gridra-grid__empty` nested inside.
- [x] `GridraToolbar`: `renderAction` returns list items without a component-owned key boundary, making React key warnings easy for consumers to trigger. ~~Decide whether the toolbar should wrap custom actions or document a stricter render contract.~~ Fixed: each rendered action is now wrapped in a `Fragment` keyed by `action.id`, and `renderAction` receives a `context: { key: string }` so consumers can assign keys explicitly if they return arrays.

### Follow-up Review

- [x] `GridraCheckbox` / `GridraRadio`: `description` is rendered inside the label content, so it behaves closer to accessible-name text than `aria-describedby` help text. ~~Revisit this when form accessibility semantics are hardened.~~ Fixed: `description` now receives a unique `id`, the control uses `aria-describedby` to reference it, and the description text is hidden from the accessible name via `aria-hidden="true"` so it is announced as supplementary help text rather than part of the label.

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

## Grid Naming Contract

To avoid confusion between the three grid-related surfaces:

- `GridraGridLayout`
  - CSS grid layout primitive
  - Renders children in a CSS grid container
  - No selection state, no item rendering API
- `GridraSelectableGrid`
  - Selectable item collection
  - Renders `items` as buttons with `aria-selected` support
  - Manages controlled/uncontrolled selection state
  - `GridraGrid` is a compatibility alias for this component
- `GridraCanvasArea`
  - Spatial editing canvas
  - Handles node placement, range selection, drag, resize, and connections
  - Not a general-purpose grid layout component

## Documentation Experience Backlog

The playground docs should become a component guide that helps users decide when, why, and how to use each component, not only an API reference.

### P0: Navigation And Scroll

- [x] Reset the `.docs-detail` scroll position to the top whenever a component is selected.
- [x] Reset the detail scroll position when a category change selects a new first component.
- [x] Ensure hash-based direct access opens the matching component from the top of the detail pane.
- [x] Add component-name search to the docs navigation.
- [x] Combine search results with the active category filter.
- [x] Show an empty state when no components match the current search/category combination.

### P1: Information Architecture

- [x] Extend `ComponentDoc` with optional guide fields: `usage`, `avoid`, `compositions`, `accessibility`, `notes`, and `states`.
- [x] Reorder detail pages around the reader's decision flow: Overview, Usage, Import, Preview, States, Props, Examples, Notes, Accessibility.
- [x] Keep `description` as the Overview text while the schema migrates.
- [x] Move `features` and `options` into Notes section grouped by label.
- [ ] Migrate individual component docs to use new guide fields over time.

### P2: Preview Quality

- [ ] Treat Preview as a comparison surface, not only a render smoke check.
- [ ] Prioritize richer state previews for `GridraButton`, `GridraBadge`, `GridraAvatar`, `GridraField`, `GridraSlider`, `GridraSelectableGrid`, and `GridraCanvasArea`.
- [ ] Increase preview space where needed so variant, state, and density differences are visible.
- [ ] Keep decision-oriented Preview/States content before Props and Examples.

### P3: Mobile Docs UX

- [ ] Avoid showing the full component list before the detail content on narrow screens.
- [ ] Group category, search, and selected component controls near the top on mobile.
- [ ] Collapse the component list or replace it with a compact selector/listbox pattern below 760px.
- [ ] Reduce the distance from page top to the active component detail on mobile.

### P4: Visual Hierarchy

- [x] Dogfood Gridra UI components in the docs UI itself (search input, copy button, headers, example headers).
- [ ] Differentiate section weight for Overview, Preview, Props, Examples, Accessibility, and Notes.
- [ ] Make lower-priority technical blocks such as Import visually quieter.
- [ ] Reduce repeated high-contrast borders where they make all sections feel equally important.
- [ ] Make Preview, Usage, and Accessibility the strongest reading anchors.

Acceptance checks:

- Component nav click starts the detail pane at the component title.
- Category change starts the new detail pane at the component title.
- Search filters by component name and works together with category filters.
- Mobile docs do not require scrolling through a long component list before reaching content.
- Existing docs data continues to type-check while new guide fields are adopted incrementally.

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
