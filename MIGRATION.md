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

Enabled steps now accept clicks in either direction, including pending steps.
Uncontrolled steppers update their current step; controlled steppers only notify
`onStepChange(nextId, previousId)` and wait for the parent's `currentId` update.
Clicking the current step does not notify. To require validation, control
`currentId` and accept or reject navigation in `onStepChange`. Explicitly disabled
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
`useGridraPagination` returns state and handlers only, without prop getters. `aria-current`, `aria-label` and `disabled` stay in the markup you render.

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

`getRowProps(item, props)` returns the focusable row bindings (roving `tabIndex`, click,
and keyboard handlers) and derives whether the item is a branch from `item.children`.
The caller places `role="treeitem"`, `aria-level`, and `aria-expanded` on the element that
represents the tree item, because that element depends on the markup. Use
`isExpanded(id)` and `isFocused(id)` to read the state for those attributes and styles.

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

`useGridraPopover` does not return `popoverRef`, `popoverId`, or `coords`. Spread
`getContentProps()` on the floating element instead; it supplies the `id`, the ref, and the
structural `position: fixed` / `top` / `left` style. `GridraPopover` uses the same getter, so the
floating element now also carries an inline `position: fixed` that overrides `style.position`.

`@gridra-ui/headless` exports `useFloatingPosition` and `useDocumentEvent` by name only. Their
option/result types (`UseFloatingPositionOptions`, `UseFloatingPositionResult`) are not exported.

## Headless GridraTooltip

Import `useGridraTooltip` from `@gridra-ui/headless` for custom markup. The existing
`GridraTooltip` export keeps the Gridra design and delegates to the same behavior.
The component documentation includes a live custom-markup example.

`useGridraTooltip` does not return `tooltipRef`, `tooltipId`, or `coords`. Spread
`getContentProps()` on the tooltip element instead; it supplies the `id`, `role="tooltip"`, the
ref, and the structural `position: fixed` / `top` / `left` style. `GridraTooltip` uses the same
getter, so the tooltip element now also carries an inline `position: fixed` that overrides
`style.position`. The default `showDelay` (120 ms) is defined only by `useGridraTooltip`.

## Headless GridraHoverCard

Import `useGridraHoverCard` from `@gridra-ui/headless` for custom markup. The existing
`GridraHoverCard` export keeps the Gridra design and delegates to the same behavior.
The component documentation includes a live custom-markup example.

`useGridraHoverCard` does not return `cardRef`, `cardId`, `coords`, `handleCardBlur`,
`cancelHide`, or `startHide`. Spread `getContentProps()` on the card element instead; it supplies
the `id`, `role="dialog"`, the ref, the card's hover/focus handlers, and the structural
`position: fixed` / `top` / `left` style. `GridraHoverCard` uses the same getter, so the card
element now also carries an inline `position: fixed` that overrides `style.position`. The default
`showDelay` and `hideDelay` (120 ms each) are defined only by `useGridraHoverCard`.

## Headless GridraDialog

Import `useGridraDialog` from `@gridra-ui/headless` for custom markup. The existing
`GridraDialog` export keeps the Gridra design and delegates to the same behavior.
The component documentation includes a live custom-markup example.

Render the backdrop and close button with `getBackdropProps()` and `getCloseProps()`.
`useGridraDialog` no longer returns `handleBackdropPointerDown`; spread `getBackdropProps()`
on the backdrop element instead. Pass `id` to `useGridraDialog` to set the dialog id; the
trigger's `aria-controls` uses the same id. An `id` passed directly to `getDialogProps()` is
no longer overwritten. `GridraDialog` keeps an `id` prop on the dialog element.

## Headless GridraDropdownMenu

Import `useGridraDropdownMenu` from `@gridra-ui/headless` for custom markup. The existing
`GridraDropdownMenu` export keeps the Gridra design and delegates to the same behavior.
The component documentation includes a live custom-markup example.

Render the menu element with `getMenuProps()`. `useGridraDropdownMenu` no longer returns
`menuRef`, `handleMenuKeyDown` or `isCommand`; `getMenuProps()` attaches the ref and the
keyboard handler. Import `isCommand` from `@gridra-ui/headless` as a standalone function
to tell command items from separators. The item types (`GridraDropdownMenuItem`,
`GridraDropdownMenuCommandItem`, `GridraDropdownMenuSeparatorItem`) are still exported
from both packages. A consumer `onKeyDown` on `GridraDropdownMenu` now runs before the
menu keyboard handling instead of being replaced by it; call `preventDefault()` in it to
skip the built-in handling. The menu element also gets an inline `position: fixed`, which
matches the theme CSS.

## Headless GridraContextMenu

Import `useGridraContextMenu` from `@gridra-ui/headless` for custom markup. The existing
`GridraContextMenu` export keeps the Gridra design and delegates to the same behavior.
The component documentation includes a live custom-markup example.

Render the menu element with `getMenuProps()`; it attaches the `id`, `role="menu"`, the ref,
the keyboard handler, and the structural `position: fixed` / `top` / `left` style.
`useGridraContextMenu` does not return `menuRef`, `handleMenuKeyDown`, or `isCommand`; import
`isCommand` from `@gridra-ui/headless`. The item types are shared with `GridraDropdownMenu`, and
`GridraContextMenu` uses the same menu keyboard handling and Escape / outside-pointerdown dismissal.

Behavior changes in `GridraContextMenu`:

- The target gets `aria-controls` pointing to the menu while the menu is open.
- The menu element carries an inline `position: fixed`, which matches the theme CSS and overrides
  `style.position`. A consumer `onKeyDown` on the menu runs before the menu keyboard handling
  instead of being replaced by it; call `preventDefault()` in it to skip the built-in handling.
- The menu position is also recalculated when the menu element resizes (via `ResizeObserver`
  where available), and a recalculation that yields the same coordinates no longer re-renders.
  Because of this, changing `size`, `minWidth`, or `maxWidth` no longer triggers the
  recalculation directly. Without `ResizeObserver`, the menu is repositioned on the next window
  resize or scroll.

## Headless GridraCommandPalette

Import `useGridraCommandPalette` from `@gridra-ui/headless` for custom markup. The existing
`GridraCommandPalette` export keeps the Gridra design and delegates to the same behavior.
The component documentation includes a live custom-markup example.

Render the backdrop with `getBackdropProps()`. `useGridraCommandPalette` does not return
`dialogRef`, `inputRef`, `listRef`, `handleKeyDown`, `handleBackdropPointerDown`, or `setQuery`;
`getDialogProps()` and `getInputProps()` attach the refs and handlers, and the query is changed
through `getInputProps()` or the controlled `query` option. `setOpen` is still returned for
opening the palette from custom markup.

## Headless GridraToast

Import `useGridraToastQueue` from `@gridra-ui/headless` for custom markup. The existing
`GridraToast` export keeps the Gridra design and delegates to the same behavior.
The component documentation includes a live custom-markup example.
`useToast` and `GridraToastContext` are also exported from `@gridra-ui/headless` so that a
custom provider can supply the same `show` function that `useToast()` reads. `dismiss()` does
nothing while no toast is visible.

## Headless GridraField

Import `useGridraField` from `@gridra-ui/headless` for custom markup. The existing
`GridraField` export keeps the Gridra design and delegates to the same behavior.
The component documentation includes a live custom-markup example.
Spread `controlBindings` onto the control, and `labelProps` / `hintProps` / `errorProps` onto the
label, hint and error elements. The `controlProps` option carries the control's own explicit props;
the resolved output is named `controlBindings` so the two are not confused.

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

`visibleItems` is typed as `GridraBreadcrumbVisibleEntry[]`, a discriminated union exported from
`@gridra-ui/headless`: `{ type: "item"; item; index }` or `{ type: "ellipsis"; index }`. Check
`entry.type === "item"` before reading `entry.item`; the ellipsis entry has no `item` and its
`index` is `-1`.

## Headless GridraInspectorPanel

Import `useGridraInspectorPanel` from `@gridra-ui/headless` for custom markup. The existing
`GridraInspectorPanel` export keeps the Gridra design and delegates to the same behavior.
The component documentation includes a live custom-markup example.

`useGridraInspectorPanel` also returns `selectedNode`, the `selectedNode` option normalized to
`GridraInspectorValue | null` (`undefined` becomes `null`). Read the selected value from it after
checking `selectedNode != null`, instead of re-reading the option with a non-null assertion.

## Headless GridraPropertiesPanel

Import `useGridraPropertiesPanel` from `@gridra-ui/headless` for custom markup. The existing
`GridraPropertiesPanel` export keeps the Gridra design and delegates to the same behavior.
The component documentation includes a live custom-markup example.

## Headless GridraProgress

Import `getGridraProgress` from `@gridra-ui/headless` for custom markup. The existing
`GridraProgress` export keeps the Gridra design and delegates to the same behavior.
The component documentation includes a live custom-markup example.

## Headless GridraAvatar

Import `getGridraAvatar` from `@gridra-ui/headless` for custom markup. The existing
`GridraAvatar` export keeps the Gridra design and delegates to the same behavior.
The component documentation includes a live custom-markup example.

## Headless GridraMinimap

Import `getGridraMinimap` from `@gridra-ui/headless` for custom markup. The existing
`GridraMinimap` export keeps the Gridra design and delegates to the same behavior.
The component documentation includes a live custom-markup example.
