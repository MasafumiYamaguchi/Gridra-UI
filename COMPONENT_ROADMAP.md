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
- [x] `GridraTooltip`
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
- [x] `GridraSidebar`
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
- [x] Minimap
- [x] Inspector Panel
- [x] Properties Panel

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
- [x] Container (Integrated into `GridraBox`)
- [x] Split Pane
- [x] Resizable Panel Group (Integrated into `GridraSplitPane` three-pane mode)
- [x] Sidebar
- [x] Header (Out of scope as library component; compose with `GridraBox` / `GridraInline` / `GridraStack`)
- [x] Footer (Out of scope as library component; compose with `GridraBox` / `GridraInline` / `GridraStack`)

## Priority 4: Overlays And Interaction

These need careful keyboard, focus, and layering behavior before they are considered stable.

- [x] Tooltip
- [x] Popover
- [x] Dialog / Modal
- [ ] Drawer (Deferred until a concrete overlay/mobile use case appears)
- [x] Dropdown Menu
- [x] Context Menu
- [x] Command Palette
- [x] Hover Card

## Priority 5: Navigation

Useful once the playground and documentation need more structure.

- [x] Tabs
- [x] Breadcrumb
- [x] Accordion
- [x] Tree View
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

## Priority 9: Animation Integrations

These should keep animation libraries optional. Gridra UI should expose stable DOM, refs, and state hooks first, then provide thin integration examples or adapters where they reduce boilerplate.

- [ ] GSAP integration
- [ ] Framer Motion integration

## Priority 10: Theme And Color System

Theme work should make colors easier to author, swap, and document without forcing consumers to edit component CSS.

- [ ] Dedicated color token files
- [ ] Named color theme exports
- [ ] Runtime theme selection API/pattern
- [ ] Playground theme selector

## Suggested Implementation Order

1. Harden the current exported components and ensure their APIs feel consistent.
2. Add missing basic controls that the Gridra-specific components will need internally.
3. Add spatial editing components such as selection, handles, resize, snap, and inspector panels.
4. Add overlays only after focus management and portal strategy are decided.
5. Add data display and advanced controls after concrete product examples exist in the playground.
6. Add animation integrations after component DOM contracts, refs, and open/close state APIs are stable.
7. Split and document theme color tokens before adding many additional visual variants.

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

### GridraInspectorPanel

Current status: implemented.

Implemented:

- Controlled inspector panel component exported from `@gridra-ui/react`.
- Supports selected-node editing for `label` and placement (`x`, `y`, `w`, `h`) in v1.
- Shows a built-in empty state when no node is selected.
- Emits partial updates through `onChange` so parent state owns normalization and persistence.
- Supports optional `onCommit` callback from Enter key in the label field.
- The playground integrates the inspector in the side panel and syncs edits with canvas state.

Not implemented yet:

- Multi-node editing.
- Node-type-specific properties (belongs to `Properties Panel`).
- Connection editing from inspector.

Current data flow:

```text
canvas selection change
  -> parent resolves selected node
  -> GridraInspectorPanel receives selectedNode
  -> user edits fields
  -> onChange emits patch
  -> parent normalizes and updates node label/placement state
  -> GridraCanvasArea re-renders updated node
```

### GridraPropertiesPanel

Current status: implemented.

Implemented:

- Controlled properties panel component exported from `@gridra-ui/react`.
- Schema-driven rendering by node type with field kinds: `text`, `number`, `select`, and `toggle`.
- Emits partial updates through `onChange` so parent state owns normalization and persistence.
- Shows a built-in empty state when selection, schema, or value is missing.
- Playground side panel integrates `GridraPropertiesPanel` below `GridraInspectorPanel`.
- Playground keeps per-node property state and switches field sets by selected node type.
- Canvas node labels reflect key property values so edits are visible in the main surface.

Not implemented yet:

- Multi-node property editing.
- Cross-field validation rules and dependent-field behavior.
- Node-type-specific custom editors beyond the base schema field kinds.

Current data flow:

```text
canvas selection change
  -> parent resolves selected node id and type
  -> GridraPropertiesPanel receives selectedNodeId, selectedNodeType, schema, and value
  -> user edits a property field
  -> onChange emits partial property patch
  -> parent merges patch into nodePropertiesById[selectedNodeId]
  -> GridraCanvasArea re-renders node with updated visible property detail
```

### GridraSplitPane

Current status: implemented.

Implemented:

- Two-pane split layout component exported from `@gridra-ui/react`.
- Three-pane layout mode integrated from the Resizable Panel Group requirement.
- Supports `horizontal` and `vertical` orientations.
- Supports controlled and uncontrolled pane size using percent (`size` / `defaultSize`).
- Supports controlled and uncontrolled three-pane sizes (`sizes` / `defaultSizes`).
- Supports `minSize` and `maxSize` constraints in percent.
- Resizes via pointer drag using pointer capture to continue tracking outside the handle bounds.
- Exposes keyboard resizing on separator (`Arrow` keys, `Home`, `End`).
- Playground includes an orientation toggle and live size readout demo.

Not implemented yet:

- Collapsible panes.
- Pixel-based sizing.
- Built-in persistence.
- Nested split-pane orchestration helpers.
- Four-or-more-pane orchestration as first-class API.

Current data flow:

```text
pointer drag or keyboard input on separator
  -> derive next percent size
  -> clamp with min/max and 0-100 bounds
  -> update internal state (or controlled value via onSizeChange)
  -> CSS variable --gridra-split-pane-size updates
  -> pane layout reflows
```

### GridraSidebar

Current status: implemented.

Implemented:

- App-shell sidebar component exported from `@gridra-ui/react`.
- Supports `left`/`right` side placement.
- Supports controlled/uncontrolled open state (`open` / `defaultOpen` / `onOpenChange`).
- Supports `width` and `collapsedWidth` based open/closed sizing.
- Optional `resizable` mode with `minWidth` / `maxWidth` constraints.
- Resizable separator supports pointer drag and keyboard control (`ArrowLeft/ArrowRight`, `Home`, `End`).
- Root exposes open state through `aria-expanded`.
- Playground includes a live sidebar demo (side toggle, open toggle, resizable toggle).

Not implemented yet:

- Overlay drawer behavior, backdrop, and focus trap.
- Breakpoint-aware mode switching (desktop sidebar vs mobile drawer).
- Built-in persistence for width/open state.

Decision note:

- Do not add `GridraDrawer` as a near-term component just because `GridraSidebar` exists.
- `GridraSidebar` remains the app-shell layout primitive: persistent side regions, layout reflow, optional resize.
- A future `GridraDrawer` should only be added when there is a concrete temporary overlay or mobile use case.
- If added, `GridraDrawer` should follow `GridraDialog` overlay responsibilities: portal, backdrop, Escape dismissal, focus trap, and focus restore.
- Drawer resizing should stay out of scope; persistent/resizable side panels remain `GridraSidebar` responsibility.

Current data flow:

```text
open/defaultOpen and width props
  -> resolve active sidebar width (open or collapsed)
  -> optional separator drag/keyboard updates width in resizable mode
  -> optional open state toggles
  -> CSS variable --gridra-sidebar-width updates
  -> shell layout reflows
```

### GridraTooltip

Current status: implemented.

Implemented:

- Lightweight tooltip component exported from `@gridra-ui/react`.
- Supports `top` / `right` / `bottom` / `left` placement.
- Supports controlled/uncontrolled open state (`open` / `defaultOpen` / `onOpenChange`).
- Opens by `hover` and `focus`, closes on `mouseleave` and `blur`.
- Supports configurable `showDelay`.
- Supports `size` tokens (`sm` / `md` / `lg`) and `maxWidth` override (`number | string`).
- Applies simple viewport collision handling by flipping to the opposite side.

Not implemented yet:

- Start/end aligned placements.
- Arrow rendering.
- Advanced collision strategy beyond opposite-side flip.
- Interactive tooltip content.

Current data flow:

```text
anchor hover/focus
  -> optional showDelay timer
  -> open state update (internal or controlled callback)
  -> measure anchor + tooltip rect
  -> compute placement and optional opposite-side flip
   -> render tooltip with fixed coordinates
```

### GridraPopover

Current status: implemented.

Implemented:

- Click-triggered non-modal overlay component exported from `@gridra-ui/react`.
- Supports `top` / `right` / `bottom` / `left` placement.
- Supports controlled/uncontrolled open state (`open` / `defaultOpen` / `onOpenChange`).
- Opens on trigger click, closes on Escape key or outside pointerdown (both configurable).
- Supports `size` tokens (`sm` / `md` / `lg`) and `maxWidth` override (`number | string`).
- Applies viewport collision handling by flipping to the opposite side.
- Wires `aria-expanded` and `aria-controls` on the trigger.
- Composes with existing trigger `onClick` and `ref` without breaking them.

Not implemented yet:

- Portal rendering.
- Focus trap and automatic focus management.
- Arrow rendering.
- Start/end aligned placements.
- Modal/backdrop behavior.
- Nested popover coordination.
- Arrow-key item navigation (out of scope for this component).

Current data flow:

```text
trigger click
  -> open state update (internal or controlled callback)
  -> measure anchor + popover rect
  -> compute placement and optional opposite-side flip
  -> render popover with fixed coordinates
  -> outside pointerdown / Escape key
  -> close
```

### GridraDialog

Current status: implemented.

Implemented:

- Modal dialog component exported from `@gridra-ui/react`.
- Renders into `document.body` via `createPortal` — first portal-based component.
- Optional trigger element with `aria-haspopup="dialog"` and `aria-expanded`.
- `role="dialog"`, `aria-modal="true"`, `aria-labelledby` to title, `aria-describedby` to optional description.
- Supports controlled/uncontrolled open state (`open` / `defaultOpen` / `onOpenChange`).
- Backdrop with optional pointer-down dismissal (`closeOnBackdropPointerDown`).
- Escape key dismissal (`closeOnEscape`).
- Close button with configurable accessible label (`showCloseButton`, `closeLabel`).
- Focus trap: `Tab` and `Shift+Tab` cycle through focusable elements inside the dialog.
- Focus restore: returns focus to the previously focused element or trigger on close.
- Supports `initialFocusRef` for custom initial focus target.
- Size variants: `sm` (360px), `md` (480px), `lg` (640px), `fullscreen`.

Not implemented yet:

- Body scroll locking.
- Nested dialog orchestration.
- Compound component parts (header, body, footer slots).
- Animated open/close transitions.

Current data flow:

```text
trigger click / open prop
  -> document.body portal render
  -> backdrop + dialog surface visible
  -> initial focus moved into dialog
  -> Tab focus trap active
  -> Escape / backdrop click / close button
  -> close
   -> focus restored to trigger
```

### GridraDropdownMenu

Current status: implemented.

Implemented:

- Command dropdown menu component exported from `@gridra-ui/react`.
- Items-based API with command items (`id`, `label`, `disabled?`, `destructive?`) and separator items (`{ type: "separator" }`).
- Trigger receives `aria-haspopup="menu"`, `aria-expanded`, and `aria-controls`.
- Menu root uses `role="menu"`; items use `role="menuitem"`; separators use `role="separator"`.
- Supports controlled/uncontrolled open state (`open` / `defaultOpen` / `onOpenChange`).
- Fixed positioning engine shared with `GridraPopover` with viewport collision flip.
- Full keyboard navigation: `ArrowDown`/`ArrowUp` cycle enabled items, `Home`/`End` jump to first/last, `Enter`/`Space` activate, `Escape` closes, `Tab` closes.
- Trigger keyboard: `ArrowDown`/`Enter`/`Space` open menu, `ArrowUp` opens and focuses last item.
- Disabled items are rendered, skipped by keyboard, and never invoke `onAction`.
- Destructive items receive visual accent treatment.
- Supports `size` tokens (`sm`/`md`/`lg`) and `minWidth`/`maxWidth` overrides.
- Outside pointer-down and Escape close (configurable). `closeOnAction` controls auto-close on activation.

Not implemented yet:

- Checkbox, radio, submenu, or typeahead items.
- Portal rendering (stays inline fixed-positioned like Popover).
- Nested menu coordination.
- Context menu trigger mode.

Current data flow:

```text
trigger click / ArrowDown
  -> open menu
  -> compute fixed position near trigger
  -> focus first enabled menuitem
  -> arrow keys move active item
  -> Enter/Space/click selects item
  -> onAction(id)
  -> close (or stay open if closeOnAction=false)
```

### GridraContextMenu

Current status: implemented.

Implemented:

- Right-click / keyboard context menu component exported from `@gridra-ui/react`.
- Wraps a target element and composes with existing `onContextMenu`, `onKeyDown`, and `ref`.
- Reuses `GridraDropdownMenuItem` type — same command/separator item model.
- Opens on native `contextmenu` event with `preventDefault()` to suppress browser menu.
- Opens on `ContextMenu` key or `Shift+F10` keyboard triggers.
- Fixed positioning at pointer coordinates for mouse, near target bottom-left for keyboard.
- Viewport clamping keeps the menu fully inside the screen.
- Reuses `GridraDropdownMenu` CSS classes for visual consistency.
- Full keyboard navigation: `ArrowDown`/`ArrowUp`, `Home`/`End`, `Enter`/`Space`, `Escape`, `Tab`.
- WAI-ARIA: `role="menu"`, `role="menuitem"`, `role="separator"`, `aria-haspopup="menu"`, `aria-expanded`.
- Supports controlled/uncontrolled open state, `disabled`, `closeOnAction`, `closeOnEscape`, `closeOnOutsidePointerDown`.
- Size tokens (`sm`/`md`/`lg`) and `minWidth`/`maxWidth` overrides.

Not implemented yet:

- Coordinate-controlled API (no `position` prop).
- Arbitrary context payload (v1 returns only action `id`).
- Checkbox, radio, or submenu items.

Current data flow:

```text
pointer contextmenu / ContextMenu key / Shift+F10
  -> prevent native menu
  -> capture pointer coordinate or target position
  -> open menu with viewport-clamped fixed position
  -> focus first enabled menuitem
  -> keyboard/click activates command
  -> onAction(id)
  -> close (or stay open if closeOnAction=false)
```

### GridraCommandPalette

Current status: implemented.

Implemented:

- Modal command palette component exported from `@gridra-ui/react`.
- Portal-based rendering with backdrop — same overlay strategy as `GridraDialog`.
- Search input focused on open; filters commands by case-insensitive substring across plain string/number `label` and `description` values, plus `group` and `keywords`.
- Group rendering: items with `group` are shown under compact group labels (no caller pre-sort required).
- Item type extends DropdownMenu's command model with `description?`, `group?`, and `keywords?`.
- Supports controlled/uncontrolled `open` and `query` state (`open`/`defaultOpen`/`onOpenChange`, `query`/`defaultQuery`/`onQueryChange`).
- Full keyboard navigation: `ArrowDown`/`ArrowUp`, `Home`/`End`, `Enter` to activate, `Escape` to close, and modal `Tab` focus trapping.
- Disabled commands are rendered, skipped by keyboard, and never invoke `onAction`.
- `closeOnAction` (default true), `closeOnEscape`, backdrop-pointer-down close, close button.
- Size variants: `sm` (400px), `md` (560px), `lg` (720px).
- Configurable `title`, `placeholder`, `emptyLabel`.
- Focus restores to the previously focused element on close.
- Query resets on close in uncontrolled mode.
- JSX labels/descriptions should provide searchable terms through `keywords`.

Not implemented yet:

- Global hotkey registration (apps control `open` externally).
- Fuzzy ranking or weighted search.
- Nested pages, async loading, recent commands, checkbox/radio commands, or custom item rendering.
- Separator items rendered in the filtered list (accepted in items but not separately rendered in v1).

Current data flow:

```text
open
  -> portal modal surface with backdrop
  -> focus search input
  -> query filters commands (plain label/desc text, group, keywords)
  -> arrow keys move active result through enabled matches
  -> Enter/click activates command
  -> onAction(id)
   -> close by default
```

### GridraHoverCard

Current status: implemented.

Implemented:

- Interactive hover card component exported from `@gridra-ui/react`.
- Opens on `mouseenter` and `focus` after configurable `showDelay`.
- Closes after `hideDelay` on `mouseleave` / `blur` from both trigger and card.
- Interactive: pointer move from trigger to card cancels the hide timer.
- Escape key closes immediately.
- Fixed positioning with viewport collision flip — same engine as `GridraTooltip` and `GridraPopover`.
- Supports controlled/uncontrolled open state, `disabled`, `placement`, and `size` tokens (`sm`/`md`/`lg`).
- Supports string-only CSS length sizing: `width`, `minWidth`, `maxWidth`, `height`, `minHeight`, and `maxHeight`.
- Sizing values are passed as CSS strings such as `"320px"`, `"32vw"`, `"50%"`, `"40vh"`, or `"calc(100vh - 48px)"`; numeric px shorthand is intentionally not supported.
- ARIA: trigger has `aria-expanded` and `aria-controls` while open.
- Composes with existing trigger `onMouseEnter`, `onMouseLeave`, `onFocus`, `onBlur`, and `ref`.

Not implemented yet:

- Portal rendering (inline fixed-positioned like Popover).
- Arrow rendering.
- Start/end aligned placements.
- Touch device-specific behavior.

Current data flow:

```text
trigger mouseenter/focus
  -> showDelay timer
  -> open
  -> fixed-position card near trigger
  -> card mouseenter cancels hide
  -> trigger/card mouseleave
  -> hideDelay timer
   -> close
```

### GridraTabs

Current status: implemented.

Implemented:

- Tabbed content switching component exported from `@gridra-ui/react`.
- Items-based API: `{ id, label, content, disabled? }`.
- Controlled/uncontrolled selection via `selectedId` / `defaultSelectedId` / `onSelectionChange`.
- Default selection falls back to the first enabled item.
- Disabled tabs are non-interactive (`disabled`, `aria-disabled="true"`), skipped by keyboard and click.
- ARIA tab pattern: `role="tablist"` with `aria-orientation`, `role="tab"` with `aria-controls`/`aria-selected`, `role="tabpanel"` with `aria-labelledby`.
- Roving tabindex keyboard navigation: `ArrowLeft`/`ArrowRight` (horizontal), `ArrowUp`/`ArrowDown` (vertical), `Home`/`End`.
- Two activation modes: `automatic` (focus selects), `manual` (`Enter`/`Space` selects).
- Two visual variants: `line` (accent underline) and `boxed` (bordered box).
- Three sizes: `sm`, `md`, `lg`.
- Only the active panel is rendered.

Not implemented yet:

- Compound (children-as-tabs) API.
- Lazy loading or caching of panel content.
- Closable tabs, reorderable tabs, nested tabs.
- Responsive overflow menu for the tab list.

Current data flow:

```text
click / keyboard arrow / Home / End
  -> roving tabindex moves focus within enabled tabs
  -> automatic mode: selection updates on focus move
  -> manual mode: Enter/Space triggers selection
  -> onSelectionChange(nextId, previousId)
  -> panel content swaps to selected tab
```

### GridraMinimap

Current status: implemented.

Implemented:

- Visual minimap component exported from `@gridra-ui/react`.
- Renders normalized node rectangles from grid placement data.
- Highlights selected nodes via `selectedIds`.
- Supports optional viewport rectangle overlay.
- Uses grid-based background lines derived from `gridColumns` and `gridRows`.
- Playground side panel includes a minimap preview tied to current canvas nodes.

Not implemented yet:

- Interactive pan/zoom control from minimap.
- Connection line preview in minimap.
- Bidirectional viewport sync with canvas scroll/zoom.

Current data flow:

```text
nodes + grid dimensions + selection ids
  -> normalize placement to percent coordinates
  -> render minimap node rectangles
  -> optional viewport rect overlay
```

### GridraContainer

Current status: integrated into `GridraBox` (API removed).

Integrated rationale:

- Responsibility overlapped with `GridraBox` + standard style props.
- Reduced cognitive load by avoiding near-duplicate layout primitives.
- Width-constrained patterns now documented as `GridraBox` recipes (`maxWidth` + `marginInline`).

Current data flow:

```text
GridraBox props + style (maxWidth/marginInline)
  -> standard box rendering
  -> constrained-width wrapper behavior when needed
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

## Animation Integration Notes

### GSAP Integration

Current status: not started.

Goal:

- Let consumers animate Gridra surfaces with GSAP without making GSAP a required runtime dependency.
- Prioritize examples and small helper patterns before adding a public adapter package.
- Keep imperative animation ownership outside core components; components should expose stable refs, class names, data attributes, and state callbacks.

Candidate integration surfaces:

- Overlay enter/exit transitions for `GridraPopover`, `GridraHoverCard`, `GridraTooltip`, `GridraDialog`, and menu surfaces.
- Canvas editing feedback such as node move/resize emphasis, connection line draw-in, and snap guide pulse.
- Playground demos that show `gsap.context()` cleanup with component refs.

Not implemented yet:

- A dedicated `@gridra-ui/gsap` package.
- Built-in timeline props on core components.
- Animation lifecycle callbacks beyond existing open/close and interaction callbacks.

Design constraints:

- GSAP must remain an optional peer/example dependency, not a dependency of `@gridra-ui/react`.
- Integration examples must include cleanup to avoid leaked tweens/timelines.
- Animation should respect disabled/reduced-motion decisions made by the host app.

### Framer Motion Integration

Current status: not started.

Goal:

- Make Gridra components easy to wrap with Framer Motion while preserving accessibility and controlled state contracts.
- Prefer composition through `motion(...)`, `as`/wrapper patterns, and stable class names over adding motion-specific props to every component.
- Document recommended variants for overlays, panels, nodes, and command surfaces.

Candidate integration surfaces:

- Presence-based overlay transitions with `AnimatePresence` for hover cards, popovers, dialogs, and command palette.
- Motion-enhanced nodes and panels for layout transitions in canvas/workspace UIs.
- Playground examples that show controlled `open` state paired with `AnimatePresence`.

Not implemented yet:

- A dedicated `@gridra-ui/framer-motion` package.
- Motion component exports such as `MotionGridraBox`.
- Built-in `initial` / `animate` / `exit` props on Gridra components.

Design constraints:

- Framer Motion must remain optional and should not be imported by `@gridra-ui/react`.
- Wrappers must preserve refs and ARIA attributes from the underlying Gridra component.
- Exit animations must not break focus restore, Escape handling, or outside-click behavior for overlays.

## Theme And Color System Notes

Current status: partially implemented.

Existing state:

- `@gridra-ui/theme` exports `base.css`, `dark.css`, and `light.css`.
- Core component CSS consumes `--gridra-color-*` custom properties.
- The playground already imports `base.css` plus theme CSS and toggles `gridra-theme-dark` / `gridra-theme-light`.

Goal:

- Move color values into dedicated color theme files so palettes can be authored and reviewed independently from component layout CSS.
- Support multiple named color themes that consumers can select by importing a CSS file and applying a theme class.
- Keep `base.css` responsible for component structure, spacing, typography, and default token fallbacks rather than owning every color value.

Candidate file structure:

- `packages/theme/src/colors/dark.css`
- `packages/theme/src/colors/light.css`
- `packages/theme/src/colors/<theme-name>.css`
- Keep compatibility exports for `@gridra-ui/theme/dark.css` and `@gridra-ui/theme/light.css`.

Candidate theme selection patterns:

- CSS class selection: apply `gridra-theme-dark`, `gridra-theme-light`, or another named theme class to `GridraRoot`.
- App-level state selection in playground docs with a theme selector control.
- Optional future helper docs for persisting the selected theme in local storage.

Not implemented yet:

- Dedicated `colors/` files separate from current `dark.css` and `light.css`.
- A documented list of required color tokens for third-party themes.
- Additional built-in palettes beyond light and dark.
- A public React theme provider; current preferred path remains CSS custom properties plus classes.

Design constraints:

- Color theme files must define the same required `--gridra-color-*` and shadow tokens.
- New color themes should not change component sizing, spacing, typography, or interaction behavior.
- Theme switching must not require remounting components.
- Avoid hard-coded component colors in `base.css`; promote repeated literals into tokens over time.

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

- [x] Treat Preview as a comparison surface, not only a render smoke check.
- [x] Prioritize richer state previews for `GridraButton`, `GridraBadge`, `GridraAvatar`, `GridraField`, `GridraSlider`, `GridraSelectableGrid`, and `GridraCanvasArea`.
- [x] Increase preview space where needed so variant, state, and density differences are visible.
- [x] Keep decision-oriented Preview/States content before Props and Examples.

### P3: Mobile Docs UX

- [x] Avoid showing the full component list before the detail content on narrow screens.
- [x] Group category, search, and selected component controls near the top on mobile.
- [x] Collapse the component list or replace it with a compact selector/listbox pattern below 760px.
- [x] Reduce the distance from page top to the active component detail on mobile.

### P4: Visual Hierarchy

- [x] Dogfood Gridra UI components in the docs UI itself (search input, copy button, headers, example headers).
- [x] Differentiate section weight for Overview, Preview, Props, Examples, Accessibility, and Notes.
- [x] Make lower-priority technical blocks such as Import visually quieter.
- [x] Reduce repeated high-contrast borders where they make all sections feel equally important.
- [x] Make Preview, Usage, and Accessibility the strongest reading anchors.

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
