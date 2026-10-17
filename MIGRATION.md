# Parent-free Gridra API migration

This is a breaking API change before 1.0. There are no compatibility wrappers.
The former `GridraRoot` and `GridraCanvasArea` exports have been removed.

## Styles and themes

### Headless Accordion

`GridraAccordion` keeps its existing import, props and CSS classes. Its behavior
now comes from `useGridraAccordion` in `@gridra-ui/headless`. The hook accepts
item metadata (`id`, optional `disabled`, plus your own fields), the single or
multiple mode, controlled/default values and the collapsible setting. It returns
`items`, `expandedIds`, `isExpanded`, `toggle`, `getTriggerProps` and `getPanelProps`.
Render native buttons in your own heading elements. Getters supply ARIA
relationships and keyboard focus handling, compose custom handlers and refs,
and mark closed panels with `hidden` if you keep them mounted.

The first occurrence of a duplicate id is retained and rendered once. Change
callbacks use the currently valid open ids as `previous`, excluding removed,
disabled or duplicate ids. A malformed default value resolves to no open panel.

### Headless Tabs

`GridraTabs` keeps its existing import, props and CSS classes. Its behavior now
comes from `useGridraTabs` in `@gridra-ui/headless`. The hook accepts item metadata
(`id`, optional `disabled`, plus your own fields), selection, orientation and
activation mode. It returns `items`, `selectedId`, `selectedItem`, `select`,
`getTabListProps`, `getTabProps` and `getPanelProps`.
Render native buttons for tabs; the hook supplies ARIA relationships and roving
focus. Pass custom handlers and refs into getters to compose them. Panels can
be unmounted or kept in the DOM using the returned `hidden` attribute.

The first occurrence of a duplicate id is retained. Selecting a removed or
disabled id is ignored. Change callbacks use the resolved current selection as
`previous`, including after an uncontrolled item's removal.

### Headless Canvas

`useGridraCanvas` and its interaction types now live in `@gridra-ui/headless`.
Imports from `@gridra-ui/react` still re-export the same implementation.
The controlled state contract and prop getters are unchanged. For a custom
design, import the hook directly and render your own container, buttons,
handles and overlay. No theme CSS is required for the hook; its grid placement
and pointer styles express structural geometry.
`GridraCanvasOverlay`, `GridraNode` and the decorated handles stay in
`@gridra-ui/react` and use the existing theme CSS.

```tsx
import { useGridraCanvas, type GridraCanvasState } from "@gridra-ui/headless";
import { GridraCanvasOverlay } from "@gridra-ui/react";
```

### Gridra design CSS

Keep importing `@gridra-ui/theme/base.css` and the palettes you need.
Components work without a Root. Apply `gridra-theme-*` classes to ordinary DOM
for scoped colors; your CSS owns page sizing, layout and padding.
The old root, shell, main and canvas-area CSS classes are removed.

Anchored portals inherit the anchor's Gridra tokens, including inline overrides,
and track ancestor class/style changes. Anchorless `GridraToastProvider` and
`GridraCommandPalette` accept `theme="forest"`; omission inherits body/html.
Themes elsewhere in the document are never used as fallback.

## Stepper designs

`GridraStepper` has a breaking visual change: the former rounded marker design
has been removed. Omitting `variant` now renders square `boxes`. Choose
`variant="cards"`, `"ruler"`, `"line"`, or `"boxes"` explicitly; each supports
both orientations and the existing sizes. No variant restores the former design.

```tsx
<GridraStepper variant="boxes" items={steps} currentId={currentId}
  onStepChange={setCurrentId} />
```

The items, controlled/uncontrolled state, and backtracking APIs remain unchanged.
Advance by updating `currentId` in the parent after validation. Explicitly disabled
items are locked, even before the current position, and cannot be current or
completed. Connectors describe the interval traversed, so an interval before the
current position remains filled even when its starting item is locked. Line uses
the same traversed-interval rule for its strokes; the item itself remains locked.
Ruler ticks also indicate reached positions along the axis, including locked
items before the current position; they do not announce item completion.

Unavailable steps now remain keyboard-focusable. They use `aria-disabled="true"`
without the native `disabled` attribute, and have no activation handler. This
lets Tab users read their number, label, and locked status. Update any custom
`:disabled` step-button styles to `[aria-disabled="true"]`.

Update custom CSS for the new variant layouts and square markers. Root modifiers
`.gridra-stepper--horizontal`, `--vertical`, `--sm`, `--md`, and `--lg` remain.
New root variant modifiers are `--cards`, `--ruler`, `--line`, and `--boxes`;
global disabling adds `.gridra-stepper--disabled`. Item and button state modifiers
include `--completed`, `--current`, `--pending`, `--locked`, and `--disabled`.
Items also have `--traversed` to color intervals before the current position
without announcing locked items as completed.
The `.gridra-stepper__connector--completed`, `--current`, `--pending`, and
`--disabled` classes remain, and future locked intervals use `--locked`.
Line and ruler hide connector elements and
draw their own axes. Marker geometry, text sizes, and spacing have changed, so
existing marker and connector overrides need review.

With multiple items, ruler percentage measures first-to-last position (0% to
100%), rather than completed work. A single current item is the terminal
position, so it reports 100%; no enabled current item reports 0%.
Horizontal and vertical rulers use the same value. `aria-labelledby`, when
provided, names the nav; the ruler appends `labels.progress` through a separate
label reference. Otherwise its name derives from `aria-label` and that suffix.
Give simultaneous steppers distinct labels. Step buttons announce their number,
label, description, and completed or locked state once, independently of the
variant's decorative markers. Global disabling preserves pending/locked visual
differences without multiplying parent and child opacity.

Use `labels: Partial<GridraStepperLabels>` to translate generated navigation and
status text, including `position(step, total)` and `summary(percentage, position)`
callbacks for ruler text. English remains the default. Cards and line preserve
minimum column widths and scroll inside the component for long horizontal
sequences. Set `--gridra-stepper-column-width` to adjust those minimum widths.

## Flex layouts

Use `GridraStack` for both inline rows and wrapping groups. `GridraInline`,
`GridraInlineItem`, `GridraCluster`, their types, and the old
`.gridra-inline*` / `.gridra-cluster*` CSS selectors have been removed.
Keep the other layout props and migrate as follows:

```tsx
// 横並び（旧GridraInline）
<GridraStack direction="horizontal" inline align="center" gap="sm" />
// 折り返し（旧GridraCluster）
<GridraStack direction="horizontal" wrap align="center" gap="sm" rowGap="md" />
// 残りの幅を埋める子要素（旧GridraInlineItem）
<GridraStackItem grow />
```

Replace custom inline/cluster CSS selectors with their Stack equivalents,
including `.gridra-stack__separator` and `.gridra-stack-item--grow`.

## Controlled canvas state

Use one `GridraCanvasState<TNode>` containing `nodes`, `connections`,
`selectedIds`, and `selectedConnections`. Each node owns its `placement`.
Remove the separate placement map, single-selection state, `default*` props,
render callback and per-operation callbacks. The selected node is
`state.selectedIds[0] ?? null`. Store history or reject edits in `onStateChange`.
The hook no longer returns `selectedId`. `GridraCanvasNode` requires only `id`
and `placement`; define display fields such as `label` in your own node type.
The getter returns connection handle attributes directly; the
`GridraConnectionHandleAttributes` export has been removed.

```tsx
import { useState } from "react";
import {
  useGridraCanvas, GridraCanvasOverlay, GridraNode, GridraDragHandle,
  type GridraCanvasNode, type GridraCanvasState,
} from "@gridra-ui/react";

type EditorNode = GridraCanvasNode & { label: string };

function Editor() {
  const [state, setState] = useState<GridraCanvasState<EditorNode>>({
    nodes: [{ id: "first", label: "First", placement: { column: 1, row: 1 } }],
    connections: [], selectedIds: [], selectedConnections: [],
  });
  const canvas = useGridraCanvas({
    state, onStateChange: setState,
    grid: { columns: 12, rows: 6 },
    interactions: { dragging: true },
  });
  return (
    <section {...canvas.getContainerProps({ style: { height: 360, padding: 10, gap: 10 } })}>
      {canvas.nodes.map(node => (
        <GridraNode key={node.id} {...canvas.getNodeProps(node.id)}
          dragHandle={<GridraDragHandle {...canvas.getDragHandleProps(node.id)} />}>
          {node.label}
        </GridraNode>
      ))}
      <GridraCanvasOverlay {...canvas.overlayProps} />
    </section>
  );
}
```

Plain buttons can replace `GridraNode` without changing the hook.
The node's required `id`, `placement`, `selected`, and domain `onSelect` props are
removed; use ordinary DOM props, `aria-pressed`, and the existing visual slots.
`GridraNodePlacement` remains the shared grid-coordinate type.
Use `GridraCanvasSnapGuide` for overlay guide data; the redundant `NodeSnapGuide`
type alias has been removed.

The hook sets a relative, equal-cell CSS grid on your container. Give it a definite
size and put nodes directly inside it. Padding, gaps and scroll are supported;
XY layout, transforms, zoom and unequal tracks are outside this API's contract.
Default grid size is 12 × 6. Range selection is enabled by default; dragging,
resizing and connecting are opt-in.

## Handle and overlay bindings

- `getResizeHandleProps(id)` starts resizing; enable `interactions.resizing`.
- `getConnectionHandleProps(id, "input" | "output")` starts/finishes connections;
  enable `interactions.connecting`. The visual handle's `kind`/`position` are separate.
- `getContainerProps(props?)` composes container events and ref.
- `getNodeProps(id, props?)` composes button click, ref, selection and placement.
- Pass your handlers, styles and refs into getters. Spreading another handler
  afterward replaces the composed handler. `preventDefault()` skips the hook handler.
- `overlayProps` contains container-content pixel dimensions, paths, selection
  rectangle, snap guides, dashed `gridLines` during dragging/resizing, and a
  connection-selection callback. Custom renderers can consume the same data
  without using `GridraCanvasOverlay`.
- Set `--gridra-connection-line-width` on your container for stroke width.

Selection modes remain `replace`, `additive`, and `toggle`. Configure range
modifiers in `interactions.selectionModifierKeys`. Connections reject identical
endpoints, same-kind endpoints and duplicate edges. Delete/Backspace deletes
selected connections when focus is outside text-editing controls.

Pointer cancellation, lost capture, node removal and unmount end transient operations.
Cancellation stops further edits; already accepted moves remain in caller state.
Multiple hook instances have isolated containers, even with matching node IDs.

## Headless GridraSelectableGrid

Import `useGridraSelectableGrid` from `@gridra-ui/headless` for custom markup. The existing
`GridraSelectableGrid` export keeps the Gridra design and delegates to the same behavior.
The component documentation includes a live custom-markup example.

## Headless GridraPagination

Import `useGridraPagination` from `@gridra-ui/headless` for custom markup. The existing
`GridraPagination` export keeps the Gridra design and delegates to the same behavior.
The component documentation includes a live custom-markup example.

## Headless GridraStepper

Import `useGridraStepper` from `@gridra-ui/headless` for custom markup. The existing
`GridraStepper` export keeps the Gridra design and delegates to the same behavior.
The component documentation includes a live custom-markup example.

## Headless GridraMenu

Import `useGridraMenu` from `@gridra-ui/headless` for custom markup. The existing
`GridraMenu` export keeps the Gridra design and delegates to the same behavior.
The component documentation includes a live custom-markup example.

## Headless GridraTreeView

Import `useGridraTreeView` from `@gridra-ui/headless` for custom markup. The existing
`GridraTreeView` export keeps the Gridra design and delegates to the same behavior.
The component documentation includes a live custom-markup example.

## Headless GridraSidebarToggle

Import `useGridraSidebarToggle` from `@gridra-ui/headless` for custom markup. The existing
`GridraSidebarToggle` export keeps the Gridra design and delegates to the same behavior.
State, handlers and semantic bindings are available without theme CSS.

## Headless GridraSidebar

Import `useGridraSidebar` from `@gridra-ui/headless` for custom markup. The existing
`GridraSidebar` export keeps the Gridra design and delegates to the same behavior.
The component documentation includes a live custom-markup example.

## Headless GridraSplitPane

Import `useGridraSplitPane` from `@gridra-ui/headless` for custom markup. The existing
`GridraSplitPane` export keeps the Gridra design and delegates to the same behavior.
The component documentation includes a live custom-markup example.

## Headless GridraPopover

Import `useGridraPopover` from `@gridra-ui/headless` for custom markup. The existing
`GridraPopover` export keeps the Gridra design and delegates to the same behavior.
The component documentation includes a live custom-markup example.

## Headless GridraTooltip

Import `useGridraTooltip` from `@gridra-ui/headless` for custom markup. The existing
`GridraTooltip` export keeps the Gridra design and delegates to the same behavior.
The component documentation includes a live custom-markup example.

## Headless GridraHoverCard

Import `useGridraHoverCard` from `@gridra-ui/headless` for custom markup. The existing
`GridraHoverCard` export keeps the Gridra design and delegates to the same behavior.
The component documentation includes a live custom-markup example.

## Headless GridraDialog

Import `useGridraDialog` from `@gridra-ui/headless` for custom markup. The existing
`GridraDialog` export keeps the Gridra design and delegates to the same behavior.
The component documentation includes a live custom-markup example.

## Headless GridraDropdownMenu

Import `useGridraDropdownMenu` from `@gridra-ui/headless` for custom markup. The existing
`GridraDropdownMenu` export keeps the Gridra design and delegates to the same behavior.
The component documentation includes a live custom-markup example.

## Headless GridraContextMenu

Import `useGridraContextMenu` from `@gridra-ui/headless` for custom markup. The existing
`GridraContextMenu` export keeps the Gridra design and delegates to the same behavior.
The component documentation includes a live custom-markup example.

## Headless GridraCommandPalette

Import `useGridraCommandPalette` from `@gridra-ui/headless` for custom markup. The existing
`GridraCommandPalette` export keeps the Gridra design and delegates to the same behavior.
The component documentation includes a live custom-markup example.

## Headless GridraToast

Import `useGridraToastQueue` from `@gridra-ui/headless` for custom markup. The existing
`GridraToast` export keeps the Gridra design and delegates to the same behavior.
The component documentation includes a live custom-markup example.

## Headless GridraField

Import `useGridraField` from `@gridra-ui/headless` for custom markup. The existing
`GridraField` export keeps the Gridra design and delegates to the same behavior.
The component documentation includes a live custom-markup example.

## Headless GridraCheckbox

Import `useGridraCheckbox` from `@gridra-ui/headless` for custom markup. The existing
`GridraCheckbox` export keeps the Gridra design and delegates to the same behavior.
The component documentation includes a live custom-markup example.

## Headless GridraRadio

Import `useGridraRadio` from `@gridra-ui/headless` for custom markup. The existing
`GridraRadio` export keeps the Gridra design and delegates to the same behavior.
The component documentation includes a live custom-markup example.

## Headless GridraSwitch

Import `getGridraSwitchProps` from `@gridra-ui/headless` for custom markup. The existing
`GridraSwitch` export keeps the Gridra design and delegates to the same behavior.
The component documentation includes a live custom-markup example.

## Headless GridraSlider

Import `useGridraSlider` from `@gridra-ui/headless` for custom markup. The existing
`GridraSlider` export keeps the Gridra design and delegates to the same behavior.
The component documentation includes a live custom-markup example.

## Headless GridraButton

Import `getGridraButtonProps` from `@gridra-ui/headless` for custom markup. The existing
`GridraButton` export keeps the Gridra design and delegates to the same behavior.
The component documentation includes a live custom-markup example.

## Headless GridraIconButton

Import `getGridraIconButtonProps` from `@gridra-ui/headless` for custom markup. The existing
`GridraIconButton` export keeps the Gridra design and delegates to the same behavior.
The component documentation includes a live custom-markup example.

## Headless GridraBreadcrumb

Import `useGridraBreadcrumb` from `@gridra-ui/headless` for custom markup. The existing
`GridraBreadcrumb` export keeps the Gridra design and delegates to the same behavior.
The component documentation includes a live custom-markup example.
