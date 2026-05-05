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
