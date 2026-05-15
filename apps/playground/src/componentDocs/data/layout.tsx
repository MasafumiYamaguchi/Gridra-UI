import { GridraBadge, GridraBox, GridraCluster, GridraContainer, GridraGridLayout, GridraInline, GridraInlineItem, GridraSplitPane, GridraStack } from "@gridra-ui/react";
import type { ComponentDoc } from "../types";
export const layoutDocs: ComponentDoc[] = [
  {
    category: "Layout",
    name: "GridraBox",
    summary: "Low-level layout primitive for padding, surface, border, scroll, and sizing.",
    description:
      "GridraBox is the foundational layout primitive of Gridra UI. It maps props like padding, surface, border, radius, and scroll directly to CSS modifier classes. Use it as a building block for custom layouts, or as a base for higher-level components like GridraStack.",
    importExample: 'import { GridraBox } from "@gridra-ui/react";',
    props: [
      { name: "as", type: "GridraBoxAs", default: "\"div\"", description: "Semantic HTML element to render." },
      { name: "padding", type: "\"none\" | \"xs\" | \"sm\" | \"md\" | \"lg\"", description: "Uniform padding using theme spacing tokens." },
      { name: "paddingX", type: "\"none\" | \"xs\" | \"sm\" | \"md\" | \"lg\"", description: "Horizontal padding override." },
      { name: "paddingY", type: "\"none\" | \"xs\" | \"sm\" | \"md\" | \"lg\"", description: "Vertical padding override." },
      { name: "surface", type: "\"none\" | \"surface\" | \"raised\" | \"input\" | \"selected\"", description: "Background surface token." },
      { name: "border", type: "\"none\" | \"default\" | \"strong\"", description: "Border style using theme border colors." },
      { name: "radius", type: "\"none\" | \"sm\" | \"md\"", description: "Border radius token." },
      { name: "display", type: "\"block\" | \"flex\" | \"grid\" | \"inline-flex\"", description: "CSS display value." },
      { name: "gap", type: "\"none\" | \"xs\" | \"sm\" | \"md\" | \"lg\"", description: "Gap between children when display is flex or grid." },
      { name: "fullWidth", type: "boolean", default: "false", description: "Sets width to 100%." },
      { name: "fullHeight", type: "boolean", default: "false", description: "Sets height to 100%." },
      { name: "scroll", type: "\"none\" | \"auto\" | \"x\" | \"y\"", description: "Overflow scroll behavior." },
      { name: "minWidthZero", type: "boolean", default: "false", description: "Sets min-width to 0 to prevent flex/grid blowout." },
      { name: "minHeightZero", type: "boolean", default: "false", description: "Sets min-height to 0 to prevent flex/grid blowout." },
      { name: "className", type: "string", description: "Additional CSS classes. Merged with internal classes." },
      { name: "style", type: "CSSProperties", description: "Inline styles applied directly to the element." },
      { name: "children", type: "ReactNode", description: "Box content." }
    ],
    options: [
      "as: div | section | article | aside | header | footer | main | span",
      "padding: none | xs | sm | md | lg",
      "paddingX / paddingY",
      "surface: none | surface | raised | input | selected",
      "border: none | default | strong",
      "radius: none | sm | md",
      "display: block | flex | grid | inline-flex",
      "gap: none | xs | sm | md | lg",
      "fullWidth / fullHeight",
      "scroll: none | auto | x | y",
      "minWidthZero / minHeightZero",
      "HTML element attributes"
    ],
    features: [
      "Renders a configurable box with semantic tag support.",
      "Maps layout props to CSS modifier classes.",
      "Supports surface, border, radius, and scroll tokens from the theme."
    ],
    usage:
      "Use GridraBox for generic structure and visual primitives (padding, surface, border, scroll, display). Choose GridraContainer when your main goal is consistent content width and horizontal alignment.",
    avoid:
      "Avoid using GridraBox alone as a team-wide width standard. Repeating one-off max-width and margin rules can drift across screens.",
    compositions: [
      "GridraContainer + GridraBox: apply width constraint first, then local surface/padding structure.",
      "GridraBox + GridraStack/Inline/GridLayout: use Box as a low-level wrapper around layout primitives."
    ],
    examples: [
      {
        title: "Basic padded surface",
        code: `<GridraBox padding="md" surface="raised" border="default">
  <GridraBadge>Content</GridraBadge>
</GridraBox>`
      },
      {
        title: "Flex container with gap",
        code: `<GridraBox display="flex" gap="sm" padding="sm" surface="input">
  <GridraBadge size="sm">A</GridraBadge>
  <GridraBadge size="sm">B</GridraBadge>
</GridraBox>`
      },
      {
        title: "Semantic section with scroll",
        code: `<GridraBox as="section" scroll="y" padding="lg" fullHeight>
  <p>Scrollable content...</p>
</GridraBox>`
      }
    ],
    preview: (
      <div className="docs-inline-preview">
        <GridraBox border="default" padding="md" surface="raised">
          <GridraBadge>Box</GridraBadge>
        </GridraBox>
        <GridraBox display="flex" gap="sm" padding="sm" surface="input">
          <GridraBadge size="sm">A</GridraBadge>
          <GridraBadge size="sm">B</GridraBadge>
        </GridraBox>
      </div>
    )
  },
  {
    category: "Layout",
    name: "GridraContainer",
    summary: "Width-constrained layout primitive with token-based max-width and horizontal alignment.",
    description:
      "GridraContainer is a width-constrained wrapper built on GridraBox. It provides max-width tokens and horizontal alignment so content stays readable in dense interfaces. Use maxWidth when token presets are not enough.",
    importExample: 'import { GridraContainer } from "@gridra-ui/react";',
    props: [
      { name: "size", type: "\"sm\" | \"md\" | \"lg\" | \"xl\" | \"full\"", default: "\"lg\"", description: "Width token for max-width." },
      { name: "maxWidth", type: "number | string", description: "Optional max-width override. Numbers are px." },
      { name: "align", type: "\"start\" | \"center\" | \"end\"", default: "\"center\"", description: "Horizontal alignment inside the parent." },
      { name: "padding", type: "\"none\" | \"xs\" | \"sm\" | \"md\" | \"lg\"", description: "Inherited from GridraBox." },
      { name: "surface", type: "\"none\" | \"surface\" | \"raised\" | \"input\" | \"selected\"", description: "Inherited from GridraBox." },
      { name: "border", type: "\"none\" | \"default\" | \"strong\"", description: "Inherited from GridraBox." },
      { name: "fullWidth", type: "boolean", default: "false", description: "Inherited from GridraBox." }
    ],
    options: [
      "size: sm | md | lg | xl | full",
      "maxWidth: number | string",
      "align: start | center | end",
      "padding / paddingX / paddingY / surface / border / radius / scroll",
      "HTML element attributes"
    ],
    features: [
      "Token-based max-width control.",
      "Optional maxWidth override.",
      "Start/center/end alignment without manual margins."
    ],
    usage:
      "Use GridraContainer when you need a canonical readable content width. Prefer it over ad-hoc max-width CSS when the intent is layout consistency across pages and panels.",
    avoid:
      "Avoid using GridraContainer as a general replacement for GridraBox. It is for width constraint and alignment, not for all structural layout concerns.",
    compositions: [
      "GridraContainer + GridraStack: common content column with stable width.",
      "GridraContainer + GridraGridLayout: constrained responsive card/forms area."
    ],
    examples: [
      {
        title: "Centered container",
        code: `<GridraContainer size="md" border="default" padding="sm">
  <GridraBadge>Centered content</GridraBadge>
</GridraContainer>`
      },
      {
        title: "End-aligned custom width",
        code: `<GridraContainer align="end" maxWidth={640} surface="input" padding="sm">
  <GridraBadge>Custom width</GridraBadge>
</GridraContainer>`
      }
    ],
    preview: (
      <div className="docs-inline-preview">
        <GridraBox border="default" padding="sm">
          <GridraContainer border="default" padding="sm" size="sm" surface="raised">
            <GridraBadge size="sm">SM centered</GridraBadge>
          </GridraContainer>
        </GridraBox>
        <GridraBox border="default" padding="sm">
          <GridraContainer align="end" border="default" maxWidth={220} padding="sm" surface="input">
            <GridraBadge size="sm" tone="accent">End aligned</GridraBadge>
          </GridraContainer>
        </GridraBox>
      </div>
    )
  },
  {
    category: "Layout",
    name: "GridraStack",
    summary: "Flex-based layout primitive for vertical and horizontal stacking with alignment.",
    description:
      "GridraStack builds on GridraBox with display=flex and adds direction, alignment, justification, and wrapping. It is the go-to primitive for arranging items in a column or row. All Box props like padding, surface, and border are inherited.",
    importExample: 'import { GridraStack } from "@gridra-ui/react";',
    props: [
      { name: "as", type: "GridraBoxAs", default: "\"div\"", description: "Semantic HTML element to render." },
      { name: "direction", type: "\"vertical\" | \"horizontal\"", default: "\"vertical\"", description: "Main axis direction." },
      { name: "gap", type: "\"none\" | \"xs\" | \"sm\" | \"md\" | \"lg\"", default: "\"md\"", description: "Gap between children." },
      { name: "align", type: "\"start\" | \"center\" | \"end\" | \"stretch\" | \"baseline\"", default: "\"stretch\"", description: "Cross-axis alignment (align-items)." },
      { name: "justify", type: "\"start\" | \"center\" | \"end\" | \"between\"", default: "\"start\"", description: "Main-axis distribution (justify-content)." },
      { name: "wrap", type: "boolean", default: "false", description: "Allow children to wrap to multiple lines." },
      { name: "reverse", type: "boolean", default: "false", description: "Reverse the order of children along the main axis." },
      { name: "padding", type: "\"none\" | \"xs\" | \"sm\" | \"md\" | \"lg\"", description: "Inherited from GridraBox." },
      { name: "surface", type: "\"none\" | \"surface\" | \"raised\" | \"input\" | \"selected\"", description: "Inherited from GridraBox." },
      { name: "border", type: "\"none\" | \"default\" | \"strong\"", description: "Inherited from GridraBox." },
      { name: "fullWidth", type: "boolean", default: "false", description: "Inherited from GridraBox." },
      { name: "fullHeight", type: "boolean", default: "false", description: "Inherited from GridraBox." }
    ],
    options: [
      "as",
      "direction: vertical | horizontal",
      "gap: none | xs | sm | md | lg",
      "align: start | center | end | stretch | baseline",
      "justify: start | center | end | between",
      "wrap",
      "reverse",
      "padding / paddingX / paddingY / surface / border / radius / scroll",
      "fullWidth / fullHeight / minWidthZero / minHeightZero",
      "HTML element attributes"
    ],
    features: [
      "Built on GridraBox with display flex.",
      "Supports direction, alignment, justification, and wrapping.",
      "Inherits Box surface, padding, border, radius, and scroll tokens."
    ],
    examples: [
      {
        title: "Vertical stack",
        code: `<GridraStack gap="sm" padding="sm" surface="raised" border="default">
  <GridraBadge size="sm">One</GridraBadge>
  <GridraBadge size="sm">Two</GridraBadge>
</GridraStack>`
      },
      {
        title: "Horizontal with justify between",
        code: `<GridraStack direction="horizontal" gap="md" justify="between" padding="sm" surface="input">
  <GridraBadge size="sm">Left</GridraBadge>
  <GridraBadge size="sm">Right</GridraBadge>
</GridraStack>`
      },
      {
        title: "Centered alignment",
        code: `<GridraStack align="center" justify="center" fullHeight>
  <GridraBadge>Centered</GridraBadge>
</GridraStack>`
      }
    ],
    preview: (
      <div className="docs-inline-preview">
        <GridraStack border="default" gap="sm" padding="sm" surface="raised">
          <GridraBadge size="sm">One</GridraBadge>
          <GridraBadge size="sm">Two</GridraBadge>
        </GridraStack>
        <GridraStack direction="horizontal" gap="md" justify="between" padding="sm" surface="input" wrap>
          <GridraBadge size="sm">A</GridraBadge>
          <GridraBadge size="sm">B</GridraBadge>
        </GridraStack>
      </div>
    )
  },
  {
    category: "Layout",
    name: "GridraInline",
    summary: "Inline-flex row layout for dense horizontal UI lines with separators and grow items.",
    description:
      "GridraInline is a horizontal-only layout primitive built on GridraBox with display=inline-flex. It is optimized for dense UI rows such as button groups, metadata lines, and label-action pairs. It supports gap, alignment, justification, and child separators. Use GridraInlineItem with grow to push content to the opposite side.",
    importExample: 'import { GridraInline, GridraInlineItem } from "@gridra-ui/react";',
    props: [
      { name: "as", type: "GridraBoxAs", default: "\"div\"", description: "Semantic HTML element to render." },
      { name: "gap", type: "\"none\" | \"xs\" | \"sm\" | \"md\" | \"lg\"", default: "\"sm\"", description: "Gap between children." },
      { name: "align", type: "\"start\" | \"center\" | \"end\" | \"stretch\" | \"baseline\"", default: "\"center\"", description: "Cross-axis alignment (align-items)." },
      { name: "justify", type: "\"start\" | \"center\" | \"end\" | \"between\"", default: "\"start\"", description: "Main-axis distribution (justify-content)." },
      { name: "separator", type: "ReactNode", description: "Element rendered between valid children only." },
      { name: "padding", type: "\"none\" | \"xs\" | \"sm\" | \"md\" | \"lg\"", description: "Inherited from GridraBox." },
      { name: "paddingX", type: "\"none\" | \"xs\" | \"sm\" | \"md\" | \"lg\"", description: "Inherited from GridraBox." },
      { name: "paddingY", type: "\"none\" | \"xs\" | \"sm\" | \"md\" | \"lg\"", description: "Inherited from GridraBox." },
      { name: "surface", type: "\"none\" | \"surface\" | \"raised\" | \"input\" | \"selected\"", description: "Inherited from GridraBox." },
      { name: "border", type: "\"none\" | \"default\" | \"strong\"", description: "Inherited from GridraBox." },
      { name: "radius", type: "\"none\" | \"sm\" | \"md\"", description: "Inherited from GridraBox." },
      { name: "fullWidth", type: "boolean", default: "false", description: "Inherited from GridraBox." },
      { name: "fullHeight", type: "boolean", default: "false", description: "Inherited from GridraBox." },
      { name: "scroll", type: "\"none\" | \"auto\" | \"x\" | \"y\"", description: "Inherited from GridraBox." },
      { name: "minWidthZero", type: "boolean", default: "false", description: "Inherited from GridraBox." },
      { name: "minHeightZero", type: "boolean", default: "false", description: "Inherited from GridraBox." }
    ],
    options: [
      "as",
      "gap: none | xs | sm | md | lg",
      "align: start | center | end | stretch | baseline",
      "justify: start | center | end | between",
      "separator",
      "padding / paddingX / paddingY / surface / border / radius / scroll",
      "fullWidth / fullHeight / minWidthZero / minHeightZero",
      "HTML element attributes"
    ],
    features: [
      "Built on GridraBox with display inline-flex.",
      "Renders separators only between valid children.",
      "GridraInlineItem grow pushes items with flex: 1 1 auto.",
      "Inherits Box surface, padding, border, radius, and scroll tokens."
    ],
    examples: [
      {
        title: "Basic inline row",
        code: `<GridraInline gap="sm">
  <GridraBadge size="sm">A</GridraBadge>
  <GridraBadge size="sm">B</GridraBadge>
</GridraInline>`
      },
      {
        title: "With separator",
        code: `<GridraInline gap="md" separator={<span>|</span>}>
  <span>First</span>
  <span>Second</span>
  <span>Third</span>
</GridraInline>`
      },
      {
        title: "Push actions to the right",
        description: "Use GridraInlineItem grow to fill remaining space and push trailing items.",
        code: `<GridraInline gap="sm" fullWidth>
  <GridraBadge size="sm">Label</GridraBadge>
  <GridraInlineItem grow />
  <GridraBadge size="sm" tone="accent">Action</GridraBadge>
</GridraInline>`
      }
    ],
    preview: (
      <div className="docs-inline-preview">
        <GridraInline gap="sm">
          <GridraBadge size="sm">A</GridraBadge>
          <GridraBadge size="sm">B</GridraBadge>
        </GridraInline>
        <GridraInline gap="md" separator={<span>|</span>}>
          <span>First</span>
          <span>Second</span>
          <span>Third</span>
        </GridraInline>
        <GridraInline gap="sm" fullWidth>
          <GridraBadge size="sm">Label</GridraBadge>
          <GridraInlineItem grow />
          <GridraBadge size="sm" tone="accent">Action</GridraBadge>
        </GridraInline>
      </div>
    )
  },
  {
    category: "Layout",
    name: "GridraCluster",
    summary: "Block flex wrapping layout for tag groups, action clusters, and filter rows.",
    description:
      "GridraCluster is a wrapping layout primitive built on GridraBox with display=flex and flex-wrap=wrap. It is the go-to component for tag clouds, mixed action groups, and filter rows that should naturally flow to multiple lines when space is tight. It supports independent rowGap for controlling vertical spacing between wrapped lines.",
    importExample: 'import { GridraCluster } from "@gridra-ui/react";',
    props: [
      { name: "as", type: "GridraBoxAs", default: "\"div\"", description: "Semantic HTML element to render." },
      { name: "gap", type: "\"none\" | \"xs\" | \"sm\" | \"md\" | \"lg\"", default: "\"sm\"", description: "Horizontal gap between children." },
      { name: "rowGap", type: "\"none\" | \"xs\" | \"sm\" | \"md\" | \"lg\"", description: "Vertical gap between wrapped lines. Defaults to gap when unset." },
      { name: "align", type: "\"start\" | \"center\" | \"end\" | \"stretch\" | \"baseline\"", default: "\"center\"", description: "Cross-axis alignment (align-items)." },
      { name: "justify", type: "\"start\" | \"center\" | \"end\" | \"between\"", default: "\"start\"", description: "Main-axis distribution (justify-content)." },
      { name: "padding", type: "\"none\" | \"xs\" | \"sm\" | \"md\" | \"lg\"", description: "Inherited from GridraBox." },
      { name: "paddingX", type: "\"none\" | \"xs\" | \"sm\" | \"md\" | \"lg\"", description: "Inherited from GridraBox." },
      { name: "paddingY", type: "\"none\" | \"xs\" | \"sm\" | \"md\" | \"lg\"", description: "Inherited from GridraBox." },
      { name: "surface", type: "\"none\" | \"surface\" | \"raised\" | \"input\" | \"selected\"", description: "Inherited from GridraBox." },
      { name: "border", type: "\"none\" | \"default\" | \"strong\"", description: "Inherited from GridraBox." },
      { name: "radius", type: "\"none\" | \"sm\" | \"md\"", description: "Inherited from GridraBox." },
      { name: "fullWidth", type: "boolean", default: "false", description: "Inherited from GridraBox." },
      { name: "fullHeight", type: "boolean", default: "false", description: "Inherited from GridraBox." },
      { name: "scroll", type: "\"none\" | \"auto\" | \"x\" | \"y\"", description: "Inherited from GridraBox." },
      { name: "minWidthZero", type: "boolean", default: "false", description: "Inherited from GridraBox." },
      { name: "minHeightZero", type: "boolean", default: "false", description: "Inherited from GridraBox." }
    ],
    options: [
      "as",
      "gap: none | xs | sm | md | lg",
      "rowGap: none | xs | sm | md | lg",
      "align: start | center | end | stretch | baseline",
      "justify: start | center | end | between",
      "padding / paddingX / paddingY / surface / border / radius / scroll",
      "fullWidth / fullHeight / minWidthZero / minHeightZero",
      "HTML element attributes"
    ],
    features: [
      "Built on GridraBox with display flex and flex-wrap: wrap.",
      "Supports independent rowGap for multi-line spacing.",
      "Inherits Box surface, padding, border, radius, and scroll tokens."
    ],
    examples: [
      {
        title: "Tag cluster",
        code: `<GridraCluster gap="xs">
  <GridraBadge size="sm">Tag A</GridraBadge>
  <GridraBadge size="sm">Tag B</GridraBadge>
  <GridraBadge size="sm">Tag C</GridraBadge>
</GridraCluster>`
      },
      {
        title: "Mixed actions with row gap",
        code: `<GridraCluster gap="sm" rowGap="md" justify="between">
  <GridraBadge size="sm">Filter</GridraBadge>
  <GridraBadge size="sm">Sort</GridraBadge>
  <GridraBadge size="sm">Export</GridraBadge>
</GridraCluster>`
      },
      {
        title: "Surface and padding",
        code: `<GridraCluster gap="sm" padding="md" surface="raised" border="default">
  <GridraBadge size="sm">One</GridraBadge>
  <GridraBadge size="sm">Two</GridraBadge>
</GridraCluster>`
      }
    ],
    preview: (
      <div className="docs-inline-preview">
        <GridraCluster gap="xs">
          <GridraBadge size="sm">Tag A</GridraBadge>
          <GridraBadge size="sm">Tag B</GridraBadge>
          <GridraBadge size="sm">Tag C</GridraBadge>
        </GridraCluster>
        <GridraCluster gap="sm" padding="md" surface="raised" border="default">
          <GridraBadge size="sm">One</GridraBadge>
          <GridraBadge size="sm">Two</GridraBadge>
        </GridraCluster>
      </div>
    )
  },
  {
    category: "Layout",
    name: "GridraSplitPane",
    summary: "Two-pane layout primitive with draggable separator and controlled/uncontrolled sizing.",
    description:
      "GridraSplitPane provides a 2-pane split layout with a draggable separator. It supports horizontal and vertical orientation, controlled or uncontrolled size, and percent-based min/max constraints. Use it for editor shells, inspector splits, and resizable work areas.",
    importExample: 'import { GridraSplitPane } from "@gridra-ui/react";',
    props: [
      { name: "orientation", type: "\"horizontal\" | \"vertical\"", default: "\"horizontal\"", description: "Split direction." },
      { name: "size", type: "number", description: "Controlled primary pane size in percent (0-100)." },
      { name: "defaultSize", type: "number", default: "50", description: "Uncontrolled initial primary pane size in percent." },
      { name: "minSize", type: "number", default: "10", description: "Minimum primary pane size in percent." },
      { name: "maxSize", type: "number", default: "90", description: "Maximum primary pane size in percent." },
      { name: "onSizeChange", type: "(next, previous) => void", description: "Called when pane size changes." },
      { name: "children", type: "ReactNode", description: "Exactly two panes (primary, secondary)." }
    ],
    options: [
      "orientation: horizontal | vertical",
      "size / defaultSize",
      "minSize / maxSize",
      "onSizeChange",
      "HTML div attributes"
    ],
    features: [
      "Draggable separator with pointer capture.",
      "Keyboard resize support on separator (Arrow/Home/End).",
      "Controlled and uncontrolled sizing with percent constraints."
    ],
    examples: [
      {
        title: "Horizontal split",
        code: `<GridraSplitPane defaultSize={60} minSize={20} maxSize={80}>
  <GridraBox padding="sm" surface="input">Pane A</GridraBox>
  <GridraBox padding="sm" surface="input">Pane B</GridraBox>
</GridraSplitPane>`
      },
      {
        title: "Vertical controlled split",
        code: `<GridraSplitPane orientation="vertical" size={size} onSizeChange={setSize}>
  <GridraBox padding="sm" surface="input">Top</GridraBox>
  <GridraBox padding="sm" surface="input">Bottom</GridraBox>
</GridraSplitPane>`
      }
    ],
    preview: (
      <div className="docs-inline-preview" style={{ height: 170 }}>
        <GridraSplitPane defaultSize={58} minSize={20} maxSize={80}>
          <GridraBox padding="sm" surface="input">
            <GridraBadge size="sm">Pane A</GridraBadge>
          </GridraBox>
          <GridraBox padding="sm" surface="input">
            <GridraBadge size="sm" tone="accent">Pane B</GridraBadge>
          </GridraBox>
        </GridraSplitPane>
      </div>
    )
  },
  {
    category: "Layout",
    name: "GridraGridLayout",
    summary: "CSS grid layout primitive for card grids and form columns.",
    description:
      "GridraGridLayout is a CSS grid layout primitive built on GridraBox with display=grid. It supports auto-fit columns with a minimum width, fixed column counts, and independent row/column gaps. Use it for settings cards, form columns, or any content that benefits from a stable grid container.",
    importExample: 'import { GridraGridLayout } from "@gridra-ui/react";',
    props: [
      { name: "as", type: "GridraBoxAs", default: "\"div\"", description: "Semantic HTML element to render." },
      { name: "columns", type: "number | \"auto\"", default: "\"auto\"", description: "Number of fixed columns or auto-fit based on minColumnWidth." },
      { name: "minColumnWidth", type: "number | string", default: "\"160px\"", description: "Minimum column width when columns is auto. Numbers are treated as px." },
      { name: "gap", type: "\"none\" | \"xs\" | \"sm\" | \"md\" | \"lg\"", default: "\"md\"", description: "Uniform gap between grid cells." },
      { name: "rowGap", type: "\"none\" | \"xs\" | \"sm\" | \"md\" | \"lg\"", description: "Vertical gap override." },
      { name: "columnGap", type: "\"none\" | \"xs\" | \"sm\" | \"md\" | \"lg\"", description: "Horizontal gap override." },
      { name: "align", type: "\"start\" | \"center\" | \"end\" | \"stretch\"", default: "\"stretch\"", description: "Cross-axis alignment (align-items)." },
      { name: "justify", type: "\"start\" | \"center\" | \"end\" | \"stretch\"", default: "\"stretch\"", description: "Main-axis cell alignment (justify-items)." },
      { name: "padding", type: "\"none\" | \"xs\" | \"sm\" | \"md\" | \"lg\"", description: "Inherited from GridraBox." },
      { name: "paddingX", type: "\"none\" | \"xs\" | \"sm\" | \"md\" | \"lg\"", description: "Inherited from GridraBox." },
      { name: "paddingY", type: "\"none\" | \"xs\" | \"sm\" | \"md\" | \"lg\"", description: "Inherited from GridraBox." },
      { name: "surface", type: "\"none\" | \"surface\" | \"raised\" | \"input\" | \"selected\"", description: "Inherited from GridraBox." },
      { name: "border", type: "\"none\" | \"default\" | \"strong\"", description: "Inherited from GridraBox." },
      { name: "radius", type: "\"none\" | \"sm\" | \"md\"", description: "Inherited from GridraBox." },
      { name: "fullWidth", type: "boolean", default: "false", description: "Inherited from GridraBox." },
      { name: "fullHeight", type: "boolean", default: "false", description: "Inherited from GridraBox." },
      { name: "scroll", type: "\"none\" | \"auto\" | \"x\" | \"y\"", description: "Inherited from GridraBox." },
      { name: "minWidthZero", type: "boolean", default: "false", description: "Inherited from GridraBox." },
      { name: "minHeightZero", type: "boolean", default: "false", description: "Inherited from GridraBox." }
    ],
    options: [
      "as",
      "columns: number | auto",
      "minColumnWidth: number | string",
      "gap: none | xs | sm | md | lg",
      "rowGap / columnGap",
      "align: start | center | end | stretch",
      "justify: start | center | end | stretch",
      "padding / paddingX / paddingY / surface / border / radius / scroll",
      "fullWidth / fullHeight / minWidthZero / minHeightZero",
      "HTML element attributes"
    ],
    features: [
      "Built on GridraBox with display grid.",
      "Supports auto-fit columns with minColumnWidth or fixed column counts.",
      "Independent rowGap and columnGap controls.",
      "Inherits Box surface, padding, border, radius, and scroll tokens."
    ],
    examples: [
      {
        title: "Auto-fit card grid",
        code: `<GridraGridLayout columns="auto" minColumnWidth={200} gap="sm">
  <GridraBadge size="sm">Card A</GridraBadge>
  <GridraBadge size="sm">Card B</GridraBadge>
  <GridraBadge size="sm">Card C</GridraBadge>
</GridraGridLayout>`
      },
      {
        title: "Fixed 2-column form",
        code: `<GridraGridLayout columns={2} gap="md">
  <GridraBadge size="sm">Field 1</GridraBadge>
  <GridraBadge size="sm">Field 2</GridraBadge>
</GridraGridLayout>`
      },
      {
        title: "Independent row and column gaps",
        code: `<GridraGridLayout columns={3} gap="sm" rowGap="lg" columnGap="xs">
  <GridraBadge size="sm">One</GridraBadge>
  <GridraBadge size="sm">Two</GridraBadge>
  <GridraBadge size="sm">Three</GridraBadge>
</GridraGridLayout>`
      }
    ],
    preview: (
      <div className="docs-inline-preview">
        <GridraGridLayout columns="auto" gap="sm" minColumnWidth={120}>
          <GridraBadge size="sm">Card A</GridraBadge>
          <GridraBadge size="sm">Card B</GridraBadge>
          <GridraBadge size="sm">Card C</GridraBadge>
        </GridraGridLayout>
        <GridraGridLayout columns={2} gap="md">
          <GridraBadge size="sm">Field 1</GridraBadge>
          <GridraBadge size="sm">Field 2</GridraBadge>
        </GridraGridLayout>
      </div>
    )
  },
];
