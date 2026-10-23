# Headless and styled APIs

Gridra has four public workspace packages. The new headless package is not yet
published to npm; this guide describes the source in this PR stack.

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

Review [the package foundation](https://github.com/MasafumiYamaguchi/Gridra-UI/pull/20)
first, then these PRs in order. Each PR targets the previous branch so its diff
contains one component's extraction. Review and merge from the base upwards.
Do not change a later PR's base to main before its prerequisites have landed.

| Styled API | Headless API | Component PR |
| --- | --- | --- |
| Canvas / GridraCanvasOverlay | `useGridraCanvas` | [#21](https://github.com/MasafumiYamaguchi/Gridra-UI/pull/21) |
| GridraTabs | `useGridraTabs` | [#22](https://github.com/MasafumiYamaguchi/Gridra-UI/pull/22) |
| GridraAccordion | `useGridraAccordion` | [#23](https://github.com/MasafumiYamaguchi/Gridra-UI/pull/23) |
| GridraSelectableGrid | `useGridraSelectableGrid` | [#24](https://github.com/MasafumiYamaguchi/Gridra-UI/pull/24) |
| GridraPagination | `useGridraPagination` | [#25](https://github.com/MasafumiYamaguchi/Gridra-UI/pull/25) |
| GridraStepper | `useGridraStepper` | [#26](https://github.com/MasafumiYamaguchi/Gridra-UI/pull/26) |
| GridraMenu | `useGridraMenu` | [#27](https://github.com/MasafumiYamaguchi/Gridra-UI/pull/27) |
| GridraTreeView | `useGridraTreeView` | [#28](https://github.com/MasafumiYamaguchi/Gridra-UI/pull/28) |
| GridraSidebarToggle | `useGridraSidebarToggle` | [#29](https://github.com/MasafumiYamaguchi/Gridra-UI/pull/29) |
| GridraSidebar | `useGridraSidebar` | [#30](https://github.com/MasafumiYamaguchi/Gridra-UI/pull/30) |
| GridraSplitPane | `useGridraSplitPane` | [#31](https://github.com/MasafumiYamaguchi/Gridra-UI/pull/31) |
| GridraPopover | `useGridraPopover` | [#32](https://github.com/MasafumiYamaguchi/Gridra-UI/pull/32) |
| GridraTooltip | `useGridraTooltip` | [#33](https://github.com/MasafumiYamaguchi/Gridra-UI/pull/33) |
| GridraHoverCard | `useGridraHoverCard` | [#34](https://github.com/MasafumiYamaguchi/Gridra-UI/pull/34) |
| GridraDialog | `useGridraDialog` | [#35](https://github.com/MasafumiYamaguchi/Gridra-UI/pull/35) |
| GridraDropdownMenu | `useGridraDropdownMenu` | [#36](https://github.com/MasafumiYamaguchi/Gridra-UI/pull/36) |
| GridraContextMenu | `useGridraContextMenu` | [#37](https://github.com/MasafumiYamaguchi/Gridra-UI/pull/37) |
| GridraCommandPalette | `useGridraCommandPalette` | [#38](https://github.com/MasafumiYamaguchi/Gridra-UI/pull/38) |
| GridraToastProvider / useToast | `useGridraToastQueue` | [#39](https://github.com/MasafumiYamaguchi/Gridra-UI/pull/39) |
| GridraField | `useGridraField` | [#40](https://github.com/MasafumiYamaguchi/Gridra-UI/pull/40) |
| GridraCheckbox | `useGridraCheckbox` | [#41](https://github.com/MasafumiYamaguchi/Gridra-UI/pull/41) |
| GridraRadio | `useGridraRadio` | [#42](https://github.com/MasafumiYamaguchi/Gridra-UI/pull/42) |
| GridraSwitch | `getGridraSwitchProps` | [#43](https://github.com/MasafumiYamaguchi/Gridra-UI/pull/43) |
| GridraSlider | `useGridraSlider` | [#44](https://github.com/MasafumiYamaguchi/Gridra-UI/pull/44) |
| GridraButton | `getGridraButtonProps` | [#45](https://github.com/MasafumiYamaguchi/Gridra-UI/pull/45) |
| GridraIconButton | `getGridraIconButtonProps` | [#46](https://github.com/MasafumiYamaguchi/Gridra-UI/pull/46) |
| GridraBreadcrumb | `useGridraBreadcrumb` | [#47](https://github.com/MasafumiYamaguchi/Gridra-UI/pull/47) |
| GridraInspectorPanel | `useGridraInspectorPanel` | [#48](https://github.com/MasafumiYamaguchi/Gridra-UI/pull/48) |
| GridraPropertiesPanel | `useGridraPropertiesPanel` | [#49](https://github.com/MasafumiYamaguchi/Gridra-UI/pull/49) |
| GridraProgress | `getGridraProgress` | [#50](https://github.com/MasafumiYamaguchi/Gridra-UI/pull/50) |
| GridraAvatar | `getGridraAvatar` | [#51](https://github.com/MasafumiYamaguchi/Gridra-UI/pull/51) |
| GridraMinimap | `getGridraMinimap` | [#52](https://github.com/MasafumiYamaguchi/Gridra-UI/pull/52) |
| GridraInput | `useControlDescriptionIds` | [#53](https://github.com/MasafumiYamaguchi/Gridra-UI/pull/53) |
| GridraToolbar | `getGridraToolbar` | [#54](https://github.com/MasafumiYamaguchi/Gridra-UI/pull/54) |

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
classes remain available; this work does not publish new npm releases.

## Verification and outstanding visual review

Each component PR records its focused headless, styled and live-example tests,
build and typecheck. The final coverage PR records the combined workspace run
and standalone documentation-snippet compilation.

UI PRs remain Draft until real browser before/after mobile and desktop images
are attached using GitHub user-attachments and verified visible to reviewers.
The current environment has no connected browser, so screenshots, attachment
upload and GitHub image display verification are outstanding. Detailed missing
images, target sizes, states and exact commits are recorded in each PR body.
