# Development Notes

## Testing Workflow

Codex should add or update tests together with implementation changes when the behavior is meaningful enough to verify.

When adding or changing functionality:

1. Codex implements the production code.
2. Codex adds focused tests for the changed behavior.
3. Codex runs the relevant test command.
4. Codex runs typecheck or build when the change affects exported APIs or application wiring.
5. Codex summarizes what was tested and any remaining risk.

Codex may add new test files or new test cases by default when adding a component or behavior.

Testing preferences:

- Keep tests focused on public behavior and stable DOM/API contracts.
- Put React component tests beside the component implementation, inside `packages/react/src/components/<ComponentName>`.
- Avoid over-testing implementation details that would make refactors noisy.
- Prefer adding narrow regression tests for interaction logic such as selection, dragging, resizing, and connections.
- If a test would require brittle browser geometry, explain the tradeoff and cover the stable part instead.

## Controlled State Contracts

Use controlled and uncontrolled APIs consistently when a component owns user-editable state.

- Prefer `value` / `defaultValue` / `onValueChange` for generic values.
- Prefer domain-specific names when they make the API clearer, such as `open` / `defaultOpen` / `onOpenChange`, `selectedId` / `defaultSelectedId` / `onSelectionChange`, or `expandedIds` / `defaultExpandedIds` / `onExpandedIdsChange`.
- Change callbacks should receive `(next, previous)` when the previous value is meaningful to consumers.
- Controlled props should be treated as the source of truth. Internal state should only update when the controlling prop is `undefined`.
- Do not fire change callbacks when the requested next value is equivalent to the current resolved value.
- Sanitize invalid, missing, disabled, or out-of-range values before rendering.
- When a component has both a raw prop value and a sanitized resolved value, emit callback `previous` values based on the public resolved behavior, not surprising internal fallback details.
- Keep sanitization in the component when it depends on component-specific data such as valid item ids, disabled items, page counts, or min/max ranges.
- Use `useControllableValue` for simple state contracts. Keep a local implementation only when resolved state needs component-specific fallback or validation before callback emission.

Test case coverage should include both expected paths and failure or edge paths.

When adding or changing behavior, consider these test angles:

- Normal path: the intended user action or API call produces the expected visible result or state update.
- Invalid input: missing, malformed, unsupported, or out-of-range values are ignored, clamped, rejected, or surfaced in the documented way.
- Boundary values: minimum, maximum, empty, single-item, and repeated-item cases behave consistently.
- Disabled or unavailable state: interactions do nothing, preserve state, or expose the expected disabled affordance.
- Conflicting interactions: overlapping actions such as drag while selected, resize after selection, cancel during an operation, or repeated pointer events do not leave stale state behind.
- Regression cases: a previously fixed bug gets a focused test that would fail if the bug returns.
- Error recovery: failures leave the component or API in a stable state and allow the user to continue where applicable.

For each meaningful behavior change, Codex should decide whether at least one negative or edge-case test is useful. If not adding one, summarize why the normal-path coverage is sufficient.

## Component Test Checklist

Use this checklist when adding a component or refactoring shared component behavior.

- Root contract: stable root element, base class name, variant/size class names, and `className` passthrough.
- Attribute passthrough: relevant native props, `style`, `id`, `aria-*`, and `data-*` land on the intended element.
- Accessibility: role, label, description, current/selected/expanded/disabled state, and decorative `aria-hidden` behavior match the public contract.
- Controlled state: controlled props do not mutate internal state directly, uncontrolled defaults initialize once, and callbacks receive `(next, previous)` where promised.
- Disabled state: pointer, keyboard, and callback behavior are inert or constrained as documented.
- Keyboard interaction: arrow keys, Home/End, Enter/Space, Escape, Tab, and focus return are covered for interactive widgets where applicable.
- Boundary values: empty arrays, single item, duplicate ids, missing ids, invalid numbers, min/max, and clamped values behave predictably.
- Composition: custom render props, custom children, existing event handlers, and refs compose without stealing consumer behavior.
- Portal/floating behavior: open/close state, outside pointerdown, Escape, scroll/resize repositioning, and theme inheritance are covered when relevant.
- Spatial interaction: pointer capture, drag/resize cancellation, snap guides, selection modifiers, duplicate connection rejection, and callback emission are covered for canvas-like components.
