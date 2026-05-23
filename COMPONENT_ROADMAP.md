# Component Roadmap

This file tracks the component surface for Gridra UI before adding more features.
Use it as the shared memory for what exists, what comes next, and what should wait.

Before changing implementation or tests, read [DEVELOPMENT_NOTES.md](./DEVELOPMENT_NOTES.md).

## Status Legend

- `[x]` Implemented enough to export from `@gridra-ui/react`
- `[~]` Partially implemented or needs design/API hardening
- `[ ]` Not started

## Current Implemented Surface

- [x] `GridraRoot`
- [x] `GridraCanvasArea`
- [x] `GridraSelectableGrid` (`GridraGrid` is a compatibility alias)
- [x] `GridraPanel`
- [x] `GridraNode`
- [x] `GridraMinimap`
- [x] `GridraInspectorPanel`
- [x] `GridraPropertiesPanel`
- [x] `GridraSelectionBox`
- [x] `GridraDragHandle`
- [x] `GridraResizeHandle`
- [x] `GridraConnectionHandle`
- [x] `GridraSnapGuide`
- [x] `GridraToolbar`
- [x] `GridraTooltip`
- [x] `GridraPopover`
- [x] `GridraDialog`
- [x] `GridraDropdownMenu`
- [x] `GridraContextMenu`
- [x] `GridraCommandPalette`
- [x] `GridraHoverCard`
- [x] `GridraAvatar`
- [x] `GridraBadge`
- [x] `GridraButton`
- [x] `GridraCheckbox`
- [x] `GridraDivider`
- [x] `GridraField`
- [x] `GridraIconButton`
- [x] `GridraInput`
- [x] `GridraLabel`
- [x] `GridraMenu`
- [x] `GridraRadio`
- [x] `GridraSelect`
- [x] `GridraSlider`
- [x] `GridraSidebar`
- [x] `GridraSpinner`
- [x] `GridraSwitch`
- [x] `GridraTextarea`
- [x] `GridraBox`
- [x] `GridraCluster`
- [x] `GridraGridLayout`
- [x] `GridraInline`
- [x] `GridraStack`
- [x] `GridraSplitPane`
- [x] `GridraAccordion`
- [x] `GridraBreadcrumb`
- [x] `GridraTabs`
- [x] `GridraTreeView`

## Priority 1: Gridra Core

These components define the library's identity as a dense, panel-based spatial UI toolkit.

- [x] Root / Provider
- [x] Canvas Area / Viewport Base
- [x] Grid
- [x] Panel
- [x] Node
- [x] Selection Box
- [x] Drag Handle
- [x] Resize Handle
- [x] Connection Handle
- [x] Snap Guide
- [x] Minimap
- [x] Inspector Panel
- [x] Properties Panel

## Priority 2: Basic Controls

These should stay small, predictable, and useful both inside Gridra components and in consumer apps.

- [x] Button
- [x] Icon Button
- [x] Input
- [x] Select
- [x] Textarea
- [x] Checkbox
- [x] Radio
- [x] Switch
- [x] Slider
- [x] Field
- [x] Label
- [x] Badge
- [x] Avatar
- [x] Spinner / Loader
- [x] Divider

## Priority 3: Layout

Layout components should support dense application surfaces rather than marketing-style pages.

- [x] Box
- [x] Stack
- [x] Inline
- [x] Cluster
- [x] Grid Layout
- [x] Container (Integrated into `GridraBox`)
- [x] Split Pane
- [x] Resizable Panel Group (Integrated into `GridraSplitPane` three-pane mode)
- [x] Sidebar
- [x] Header (Out of scope as library component; compose with `GridraBox` / `GridraInline` / `GridraStack`)
- [x] Footer (Out of scope as library component; compose with `GridraBox` / `GridraInline` / `GridraStack`)

## Priority 4: Overlays And Interaction

These need careful keyboard, focus, and layering behavior before they are considered stable.

- [x] Tooltip
- [x] Popover
- [x] Dialog / Modal
- [ ] Drawer (Deferred until a concrete overlay/mobile use case appears)
- [x] Dropdown Menu
- [x] Context Menu
- [x] Command Palette
- [x] Hover Card

## Priority 5: Navigation

Useful once the playground and documentation need more structure.

- [x] Tabs
- [x] Breadcrumb
- [x] Accordion
- [x] Tree View
- [x] GridraMenu
- [ ] Pagination
- [ ] Stepper

## Priority 6: Feedback

These communicate async state, validation, and empty/error states.

- [ ] Alert
- [ ] Toast
- [ ] Progress
- [ ] Skeleton
- [ ] Empty State
- [ ] Error Message
- [ ] Status Indicator

## Priority 7: Data Display

Keep these display-first at the beginning. Add stateful variants only when a real use case appears.

- [ ] Card
- [ ] List
- [ ] Table
- [ ] Data Table
- [ ] Description List
- [ ] Stat
- [ ] Tag
- [ ] Code Block
- [ ] Kbd
- [ ] Timeline

## Priority 8: Advanced Controls

These are useful but should wait until the lower-level primitives are stable.

- [ ] Combobox
- [ ] Autocomplete
- [ ] Date Picker
- [ ] Time Picker
- [ ] Color Picker
- [ ] File Upload
- [ ] Virtual List
- [ ] Rich Text Editor
- [ ] Code Editor
- [ ] Calendar

## Priority 9: Animation Integrations

These should keep animation libraries optional. Gridra UI should expose stable DOM, refs, and state hooks first, then provide thin integration examples or adapters where they reduce boilerplate.

- [ ] GSAP integration
- [ ] Framer Motion integration

## Priority 10: Theme And Color System

Theme work should make colors easier to author, swap, and document without forcing consumers to edit component CSS.

- [ ] Dedicated color token files
- [ ] Named color theme exports
- [ ] Runtime theme selection API/pattern
- [ ] Playground theme selector

## Suggested Implementation Order

1. Harden the current exported components and ensure their APIs feel consistent.
2. Add missing basic controls that the Gridra-specific components will need internally.
3. Add spatial editing components such as selection, handles, resize, snap, and inspector panels.
4. Add overlays only after focus management and portal strategy are decided.
5. Add data display and advanced controls after concrete product examples exist in the playground.
6. Add animation integrations after component DOM contracts, refs, and open/close state APIs are stable.
7. Split and document theme color tokens before adding many additional visual variants.

## Related Documents

- [COMPONENT_IMPLEMENTATION_NOTES.md](./COMPONENT_IMPLEMENTATION_NOTES.md): detailed component, animation, theme, naming, and research notes.
- [COMPONENT_REVIEW_FIXES.md](./COMPONENT_REVIEW_FIXES.md): fixed component-review findings and design cautions.
- [DOCUMENTATION_BACKLOG.md](./DOCUMENTATION_BACKLOG.md): documentation experience backlog.
