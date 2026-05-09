# Development Notes

## Testing Workflow

The user wants to write test code themselves to learn the implementation deeply.

When adding or changing functionality:

1. Codex implements the production code.
2. Codex stops before adding new tests.
3. Codex tells the user: "The implementation is ready for tests."
4. Codex lists the concrete test targets and expected behavior.
5. The user writes the test code.
6. Codex can help read test failures, explain causes, and adjust implementation.

Codex should not add new test files or new test cases by default.

Allowed Codex support:

- Run existing tests when useful.
- Explain what should be tested.
- Provide generalized testing examples that are not copied from project-specific code.
- Debug failing tests after the user writes them.

Exception:

- If the user explicitly asks Codex to write tests, Codex may do so.
