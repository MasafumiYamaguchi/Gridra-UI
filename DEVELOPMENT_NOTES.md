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
