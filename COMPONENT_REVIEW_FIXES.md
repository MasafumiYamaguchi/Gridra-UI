# Component Review Fixes

Fixed component-review findings split out from [COMPONENT_ROADMAP.md](./COMPONENT_ROADMAP.md). Keep this file focused on review outcomes and design cautions that should remain visible after the immediate backlog is closed.

## Hardening Backlog From Component Review

### High Priority

- [x] `useGridraCanvas`: duplicate edges do not produce a connections update.
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

## Canvas Interaction Boundaries

`useGridraCanvas` owns transient operations and emits complete controlled state changes.
Geometry, hit testing, selection and snapping remain independent utility modules.
The caller owns rendering and persistent state; `GridraCanvasOverlay` renders hook-provided pixels.
No required component class or React provider identifies the interaction container.

Acceptance checks:

- Plain DOM containers and buttons support the same spatial operations.
- Input state is not mutated; callbacks provide next and previous state.
- Pointer capture is released on cancellation, element changes, node removal and unmount.
- Multiple canvas instances and theme regions remain isolated.

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
  - `GridraGrid` was the previous name and has been removed; use `GridraSelectableGrid`
- `useGridraCanvas`
  - Controlled spatial editing hook
  - Handles node placement, range selection, drag, resize, and connections
  - Attaches DOM props to a caller-owned equal-cell grid
