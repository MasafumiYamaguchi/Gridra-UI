# Component Review Fixes

Fixed component-review findings split out from [COMPONENT_ROADMAP.md](./COMPONENT_ROADMAP.md). Keep this file focused on review outcomes and design cautions that should remain visible after the immediate backlog is closed.

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

## GridraCanvasArea Refactor Boundaries

`GridraCanvasArea` already has separate utility modules for geometry, hit testing, interaction, selection, snapping, and connections. The next refactor should avoid moving math for its own sake and instead isolate interaction state transitions that currently live inside the component.

Recommended extraction order:

1. Pointer normalization
   - Convert pointer coordinates into canvas/grid coordinates.
   - Keep DOM reads near the component boundary.
   - Return plain data that can be tested without React.
2. Range selection interaction
   - Own selection start, update, cancel, and commit transitions.
   - Keep modifier-key selection policy explicit.
3. Node drag interaction
   - Own drag start, movement, snap-guide derivation, and commit.
   - Emit previous and next placements through the existing callback contract.
4. Node resize interaction
   - Mirror the drag structure, but keep resize constraints and placement normalization separate.
5. Connection interaction
   - Own connection start, preview update, duplicate rejection, cancel, commit, and delete.
   - Preserve the current rule that `onNodeConnect` fires only for newly accepted connections.
6. Render-state derivation
   - Derive selected, dragging, resizing, connecting, and handle props from stable inputs.
   - Keep `renderNode` as a public rendering extension point, not an interaction owner.

Refactor acceptance checks:

- Existing public props and callbacks stay source compatible.
- Pointer capture behavior remains covered by component-level tests.
- Extracted functions receive and return plain data where possible.
- Selection, drag, resize, and connection regression tests remain focused on externally visible behavior.

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
