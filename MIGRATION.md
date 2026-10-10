# Parent-free Gridra API migration

This is a breaking API change before 1.0. There are no compatibility wrappers.
The former `GridraRoot` and `GridraCanvasArea` exports have been removed.

## Styles and themes

Keep importing `@gridra-ui/theme/base.css` and the palettes you need.
Components work without a Root. Apply `gridra-theme-*` classes to ordinary DOM
for scoped colors; your CSS owns page sizing, layout and padding.
The old root, shell, main and canvas-area CSS classes are removed.

Anchored portals inherit the anchor's Gridra tokens, including inline overrides,
and track ancestor class/style changes. Anchorless `GridraToastProvider` and
`GridraCommandPalette` accept `theme="forest"`; omission inherits body/html.
Themes elsewhere in the document are never used as fallback.

## Controlled canvas state

Use one `GridraCanvasState<TNode>` containing `nodes`, `connections`,
`selectedIds`, and `selectedConnections`. Each node owns its `placement`.
Remove the separate placement map, single-selection state, `default*` props,
render callback and per-operation callbacks. The selected node is
`state.selectedIds[0] ?? null`. Store history or reject edits in `onStateChange`.

```tsx
import { useState } from "react";
import {
  useGridraCanvas, GridraCanvasOverlay, GridraNode, GridraDragHandle,
  type GridraCanvasState,
} from "@gridra-ui/react";

function Editor() {
  const [state, setState] = useState<GridraCanvasState>({
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
  rectangle, snap guides and a connection-selection callback. Custom renderers can
  consume the same data without using `GridraCanvasOverlay`.
- Set `--gridra-connection-line-width` on your container for stroke width.

Selection modes remain `replace`, `additive`, and `toggle`. Configure range
modifiers in `interactions.selectionModifierKeys`. Connections reject identical
endpoints, same-kind endpoints and duplicate edges. Delete/Backspace deletes
selected connections when focus is outside text-editing controls.

Pointer cancellation, lost capture, node removal and unmount end transient operations.
Cancellation stops further edits; already accepted moves remain in caller state.
Multiple hook instances have isolated containers, even with matching node IDs.
