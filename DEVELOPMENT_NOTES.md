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
