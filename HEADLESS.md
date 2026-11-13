# Headless and styled APIs

Gridra has four public workspace packages.

| Package | Responsibility | Runtime dependencies |
| --- | --- | --- |
| `@gridra-ui/core` | Framework-independent values, calculations and minimap layout | None |
| `@gridra-ui/headless` | React state, input handling, focus, lifecycle and semantic bindings | React peer and core |
| `@gridra-ui/react` | Gridra markup, component composition, variants and portal theme inheritance | React, React DOM, headless and core |
| `@gridra-ui/theme` | Gridra CSS and design tokens | None |

Use headless APIs with your own native elements and CSS. No Gridra provider,
styled component or theme stylesheet is required. The hooks return data and
prop getters; the caller renders the elements and decides whether to use a portal.
Floating and canvas bindings include structural positioning styles. Those
styles express geometry, not Gridra colors, spacing presets or visual variants.

## Migrated behavior and models

| Styled API | Headless API |
| --- | --- |
| Canvas / GridraCanvasOverlay | `useGridraCanvas` |
| GridraTabs | `useGridraTabs` |
| GridraAccordion | `useGridraAccordion` |
| GridraSelectableGrid | `useGridraSelectableGrid` |
| GridraPagination | `useGridraPagination` |
| GridraStepper | `useGridraStepper` |
| GridraMenu | `useGridraMenu` |
| GridraTreeView | `useGridraTreeView` |
| GridraSidebarToggle | `useGridraSidebarToggle` |
| GridraSidebar | `useGridraSidebar` |
| GridraSplitPane | `useGridraSplitPane` |
| GridraPopover | `useGridraPopover` |
| GridraTooltip | `useGridraTooltip` |
| GridraHoverCard | `useGridraHoverCard` |
| GridraDialog | `useGridraDialog` |
| GridraDropdownMenu | `useGridraDropdownMenu` |
| GridraContextMenu | `useGridraContextMenu` |
| GridraCommandPalette | `useGridraCommandPalette` |
| GridraToastProvider / useToast | `useGridraToastQueue` |
| GridraField | `useGridraField` |
| GridraCheckbox | `useGridraCheckbox` |
| GridraRadio | `useGridraRadio` |
| GridraSwitch | `getGridraSwitchProps` |
| GridraSlider | `useGridraSlider` |
| GridraButton | `getGridraButtonProps` |
| GridraIconButton | `getGridraIconButtonProps` |
| GridraBreadcrumb | `useGridraBreadcrumb` |
| GridraInspectorPanel | `useGridraInspectorPanel` |
| GridraPropertiesPanel | `useGridraPropertiesPanel` |
| GridraProgress | `getGridraProgress` |
| GridraAvatar | `getGridraAvatar` |
| GridraMinimap | `getGridraMinimap` |
| GridraInput | `useControlDescriptionIds` |
| GridraToolbar | `getGridraToolbar` |

`getGridraMinimap` is calculated in core and re-exported by headless. It returns
percentage rectangles suitable for custom SVG or HTML. `GridraToolbarButton`
composes the same button behavior as `GridraButton`.

Avatar exposes image/fallback selection and accessible names. It does not add
image loading or failure recovery. Toast exposes `useGridraToastQueue`,
`GridraToastContext` and `useToast`; custom providers can render notifications
without Gridra CSS. The styled provider supplies its 150 ms exit transition,
while the queue's default exit duration is zero. Toast's existing `className`
option is passed through as consumer metadata without selecting a design.

## Components that remain styled

Every existing component was checked for owned state, events, subscriptions,
validation, focus and data-model work. A separate headless wrapper is not useful
when there is only native semantics or decorative markup.

| Existing APIs | Why they remain in react |
| --- | --- |
| GridraSelect, GridraTextarea | Native select/textarea own editing and keyboard behavior; `resolveAriaInvalid` comes from headless. Use native elements and that helper for a custom design. |
| GridraLabel | Native label semantics; generated associations are handled by headless Field/Input helpers. |
| GridraNode, GridraDragHandle, GridraResizeHandle, GridraConnectionHandle | Visual elements and slots; canvas selection, pointer capture, dragging, resizing and connection behavior live in `useGridraCanvas`. |
| GridraSelectionBox, GridraSnapGuide, GridraSnapGuides | Render supplied rectangle/guide geometry; CSS conversion and decorative visibility remain presentation work. Snap detection is in the canvas hook. |
| GridraBox, GridraGridLayout, GridraStack, GridraStackItem | Layout element selection, CSS properties and separator composition; no owned interaction state. |
| GridraPanel, GridraCard, GridraEmptyState | Content/header/action slots and visual framing; applications own actions and visibility. |
| GridraList, GridraDescriptionList, GridraTimeline | Native list/time markup and content composition; no filtering, editing or selection state. |
| GridraAlert | Visual notification surface with a default role inferred from its design tone; applications may override the role. Queue and dismissal live in headless Toast. |
| GridraBadge, GridraDivider, GridraKbd, GridraErrorMessage, GridraSkeleton, GridraSpinner, GridraStat, GridraStatusIndicator | Native/static semantics and decoration. CSS animations, sizes, labels and content formatting do not need independent state hooks. |

Theme utilities and portal theme observation stay in react. Headless's general
ancestor observation utility does not know any Gridra theme class or token.
Unimplemented roadmap items such as Table/DataTable and date pickers are not
created by this migration.

## Composition contracts

- Use the native element type accepted by a getter. Native button/input semantics
  remain part of the contract; these APIs do not make arbitrary divs behave like buttons.
- Put existing event handlers and refs into getters. Handlers run first and
  `preventDefault()` cancels the added interaction. Keep the returned ref attached.
- Keep generated ids on the trigger, label, panel or description they identify.
  Render titles/descriptions matching the returned ARIA relationships.
- Controlled values remain caller-owned. Change callbacks keep existing public
  signatures; state APIs with a meaningful previous value emit `(next, previous)`.
  Native form events and existing single-value callbacks keep their signatures.
- Retain the returned geometry styles for floating/canvas elements, or reproduce
  the equivalent coordinate system in your own renderer.
- Stateful hooks always run unconditionally. Render returned state; do not copy
  it into a competing local state source.

The playground includes custom-markup examples beside the styled examples.
`MIGRATION.md` records individual import paths. Existing styled props and CSS
classes remain available.
