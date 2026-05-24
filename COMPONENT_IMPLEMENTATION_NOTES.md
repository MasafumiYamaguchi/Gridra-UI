# Component Implementation Notes

Detailed implementation notes split out from [COMPONENT_ROADMAP.md](./COMPONENT_ROADMAP.md). Keep the roadmap focused on priority order; keep component-level behavior, deferred details, and research keywords here.

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

### GridraPagination

Current status: implemented.

Implemented:

- Button-based pagination component exported from `@gridra-ui/react`.
- Controlled/uncontrolled behavior for both `page` and `pageSize`.
- Props: `page`, `defaultPage`, `onPageChange`, `pageSize`, `defaultPageSize`, `onPageSizeChange`, `totalItems`, `pageSizeOptions`, `siblingCount`, `boundaryCount`, `size`, `showFirstLast`, `showPageSize`, `showSummary`, `disabled`.
- Pure utility functions in `paginationUtils.ts`: `normalizeTotalItems`, `normalizePageSize`, `normalizePage`, `normalizePageSizeOptions`, `normalizeSiblingOrBoundaryCount`, `generatePages`.
- Numeric input is normalized before rendering: pages clamp to the valid range, invalid totals become 0, invalid page sizes fall back to 25, and decimals are floored.
- Page range generation with siblingCount/boundaryCount-aware ellipsis.
- `pageSize` change automatically resets `page` to 1.
- Rendered as `nav` with `aria-label="Pagination"`, page buttons use `aria-current="page"`.
- First/Previous/Next/Last buttons disable at boundaries.
- `disabled` prop disables all buttons and the page size select.
- `totalItems=0` renders gracefully with page 1, disabled boundaries, and "No items" summary.
- Page size selector includes current value even if outside `pageSizeOptions`.

Not implemented yet:

- Link-based pagination (for SEO/URL-driven navigation).
- Compact variant without page numbers.
- Infinite scroll or load-more pattern integration.

Current data flow:

```text
totalItems + pageSize
  -> pageCount = Math.max(1, ceil(totalItems / pageSize))
  -> currentPage clamped to [1, pageCount]
  -> generatePages(currentPage, pageCount, siblingCount, boundaryCount)
  -> buttons + ellipsis rendered

user click page button
  -> goToPage(nextPage)
  -> setPage(clamped)
  -> onPageChange(clamped, previousPage)

user change pageSize select
  -> setPageSize(nextSize)
  -> onPageSizeChange(nextSize, previousSize)
  -> setPage(1) (page resets to first)
```

### GridraStepper

Current status: implemented.

Implemented:

- Linear step indicator component exported from `@gridra-ui/react`.
- Items-based API: `{ id, label, description?, disabled? }`.
- Controlled/uncontrolled currentId via `currentId` / `defaultCurrentId` / `onStepChange`.
- Step states: completed (before current), current, pending (after current), disabled (explicit or global).
- Completed steps are clickable buttons for backtracking; current step is a button with `aria-current="step"`; pending steps are disabled.
- Per-step `disabled` and global `disabled` prop.
- Rendered as `nav` with `aria-label="Progress"` and `ol > li` structure.
- Each step has a numbered marker, label, optional description, and a connector between steps.
- Connectors reflect state visually (completed/current/pending/disabled classes).
- Horizontal and vertical orientations, three sizes (sm/md/lg).
- Unknown, empty, or disabled currentId falls back to the first enabled step.
- If no enabled step exists, no step receives `aria-current` and all step buttons are disabled.

Not implemented yet:

- Step content panel switching (managed by parent in v1).
- Branching, non-linear, or skipped step states.
- Error state or custom icon rendering.
- Step completion animation.

Current data flow:

```text
items + currentId
  -> currentId falls back to the first enabled step
  -> currentIndex = findIndex(items, currentId), or -1 when no enabled step exists
  -> for each item at index i:
       i < currentIndex  -> completed (clickable, fires onStepChange)
       i == currentIndex -> current (aria-current="step", no callback)
       i > currentIndex  -> pending (disabled, no callback)
       no current         -> disabled, no callback

user click completed step
  -> handleStepClick(id)
  -> if controlled: onStepChange(id, currentId)
  -> if uncontrolled: setInternalCurrentId(id) + onStepChange(id, currentId)
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
