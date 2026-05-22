# GRIDRA UI

[English](README.md) | [日本語](README.ja.md)

GRIDRA UI is a React-first component library for building dense, panel-based GRIDRA-style interfaces.

## Architecture

GRIDRA UI is organized as an npm workspaces monorepo. The runtime packages are kept small and layered so the React components can stay focused on rendering and interaction, while framework-neutral primitives and styling tokens remain reusable.

```text
apps/playground
  uses @gridra-ui/react + @gridra-ui/theme for local visual checks and docs

packages/react
  exports React components and interaction wiring

packages/core
  provides framework-independent IDs, geometry types, and small state helpers

packages/theme
  publishes base CSS variables plus light/dark theme presets
```

The main dependency direction is:

```text
@gridra-ui/playground
  -> @gridra-ui/react
      -> @gridra-ui/core
  -> @gridra-ui/theme
```

`@gridra-ui/theme` is consumed through explicit CSS imports rather than a JavaScript dependency. This keeps visual tokens opt-in for application consumers.

## Runtime Layers

- **Core layer**: `packages/core/src/index.ts` defines shared identifiers, geometry primitives, selection state helpers, and simple point/rect utilities.
- **React component layer**: `packages/react/src/components/*` contains the public UI primitives. Components are exported from `packages/react/src/index.ts`.
- **Canvas interaction layer**: `GridraCanvasArea` coordinates node selection, drag, resize, range selection, and node-to-node connections.
- **Connection rendering layer**: `GridraConnectionLayer` receives normalized nodes and connection records, converts them into SVG paths, and renders selected/preview connection lines.
- **Theme layer**: `packages/theme/src/base.css` defines the CSS variable contract and structural classes. `light.css` and `dark.css` provide preset values.
- **Playground/docs layer**: `apps/playground/src/main.tsx` mounts the demo app. `/docs` is routed to component documentation from `apps/playground/src/componentDocs`.

## Canvas And Connection Model

The canvas is grid-based. A node has an ID and a grid placement:

```text
node
  id
  placement
    column
    row
    columnSpan
    rowSpan
```

Connections are stored as lightweight records:

```text
connection
  sourceId -> targetId
```

The interaction flow is:

```text
pointer down on handle
  -> GridraCanvasArea stores connection state
  -> pointer move updates a preview grid point
  -> GridraConnectionLayer draws a preview SVG path
  -> pointer up over a compatible handle creates sourceId -> targetId
  -> onNodeConnectionsChange / onNodeConnect notify the consumer
```

The connection path calculation lives with the canvas geometry helpers. Node placement is normalized against the current grid size, then converted into input/output anchor points. The SVG connection layer uses the same grid coordinate space as the canvas:

```text
node placement
  -> input/output anchor point
  -> cubic Bezier path
  -> SVG path in grid viewBox
```

This keeps the connection layer mostly presentational: it does not own node state, placement state, or connection mutation. It receives data, computes drawable segments, and raises selection events for existing lines.

## Controlled State Pattern

Interactive canvas state supports both controlled and uncontrolled usage through `useControllableValue`.

- `selectedId` / `defaultSelectedId`
- `selectedIds` / `defaultSelectedIds`
- `nodeConnections` / `defaultNodeConnections`
- `nodePlacements` / `defaultNodePlacements`

When a controlled prop is provided, GRIDRA UI calls the corresponding change callback and expects the consumer to pass the next value back in. When only a default value is provided, the component owns the state internally.

## Packages

- `@gridra-ui/core`: framework-independent types and state/geometry helpers.
- `@gridra-ui/react`: React components.
- `@gridra-ui/theme`: CSS variable tokens and preset themes.
- `@gridra-ui/playground`: Vite app for local visual checks.

## File Structure

```text
.
|-- apps/
|   `-- playground/
|       |-- src/main.tsx                  # demo app and /docs route switch
|       |-- src/styles.css                # playground-only styles
|       `-- src/componentDocs/            # docs data, previews, and code examples
|-- packages/
|   |-- core/
|   |   `-- src/index.ts                  # shared IDs, geometry types, state helpers
|   |-- react/
|   |   `-- src/
|   |       |-- index.ts                  # public React package exports
|   |       |-- hooks/                    # shared React hooks
|   |       `-- components/
|   |           |-- GridraCanvasArea/     # grid canvas, hit testing, geometry, connections
|   |           |-- GridraNode/           # grid-positioned node primitive
|   |           |-- GridraConnectionHandle/
|   |           |-- GridraDragHandle/
|   |           |-- GridraResizeHandle/
|   |           `-- ...                   # panels, inputs, menus, layout primitives
|   `-- theme/
|       `-- src/
|           |-- base.css                  # base class styles and CSS variable contract
|           |-- dark.css                  # dark theme tokens
|           `-- light.css                 # light theme tokens
|-- COMPONENT_ROADMAP.md                  # component planning notes
|-- DEVELOPMENT_NOTES.md                  # development and testing workflow
|-- package.json                          # workspace scripts
`-- tsconfig.base.json                    # shared TypeScript compiler options
```

Generated `dist` files may exist after builds, but source changes should usually happen under `src`.

## Technology Stack

- **Language**: TypeScript
- **UI runtime**: React 19 in the workspace, with `@gridra-ui/react` declaring React `>=18.2.0` as a peer dependency
- **Build tooling**: TypeScript project references and Vite for the playground
- **Testing**: Vitest, jsdom, and Testing Library for React component tests
- **Styling**: CSS variables and package-level CSS exports from `@gridra-ui/theme`
- **Documentation/demo**: Vite playground with docs data colocated under `apps/playground/src/componentDocs`

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
