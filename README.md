# GRIDRA UI

GRIDRA UI is a React-first component library for building dense, panel-based GRIDRA-style interfaces.

## Packages

- `@gridra-ui/core`: framework-independent types and state/geometry helpers.
- `@gridra-ui/react`: React components.
- `@gridra-ui/theme`: CSS variable tokens and preset themes.
- `@gridra-ui/playground`: Vite app for local visual checks.

## Scripts

- `npm run build`: build all workspaces.
- `npm run typecheck`: type-check all workspaces.
- `npm run test`: run package tests.
- `npm run dev`: start the playground.

## Styling

Consumers import the base CSS explicitly, then add a theme class such as `gridra-theme-dark` or override the CSS variables.

```ts
import "@gridra-ui/theme/base.css";
import "@gridra-ui/theme/dark.css";
```

## Documentation And Syntax Highlighting

The component library packages should stay focused on runtime UI primitives. Documentation-only tooling, including syntax highlighting, belongs in `@gridra-ui/playground` or a future dedicated docs app rather than in `@gridra-ui/react` or `@gridra-ui/theme`.

Recommended direction:

- Keep code examples as plain source strings in the docs data model.
- Render them through a docs-only `CodeBlock` abstraction so the highlighter can be swapped without rewriting component docs.
- Prefer Shiki for the eventual docs implementation because it matches VS Code-style highlighting, supports ahead-of-time output, and offers fine-grained browser bundles when client-side highlighting is required.
- Avoid shipping a large all-language browser bundle by default. Restrict docs highlighting to the languages we actually show, initially `tsx`, `ts`, `css`, and `bash` if needed.
- Keep the published UI packages free of syntax-highlighting dependencies. Adding or changing the docs highlighter must not affect consumer bundle size.

Practical rollout:

1. Continue using the current plain `<pre><code>` renderer while the docs structure is still moving.
2. Introduce Shiki behind the docs `CodeBlock` boundary once the examples stabilize.
3. Prefer build-time or pre-rendered highlighting if the docs app gains a build pipeline suited for it.
4. If runtime highlighting remains necessary in the Vite playground, use a cached singleton highlighter and a fine-grained language/theme bundle rather than the full default bundle.

Prism remains a viable lightweight fallback for very small browser-only highlighting needs, but the default plan is Shiki for fidelity and future documentation depth.
