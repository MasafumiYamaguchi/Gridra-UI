import { GridraBadge, GridraBox } from "@gridra-ui/react";
import type { ComponentDoc } from "../../types";

export const boxDoc: ComponentDoc = {
    category: "Layout",
    name: "GridraBox",
    summary: "Low-level layout primitive for padding, surface, border, scroll, and sizing.",
    description:
      "GridraBox is the foundational layout primitive of Gridra UI. It maps props like padding, surface, border, radius, and scroll directly to CSS modifier classes. Use it as a building block for custom layouts, or as a base for higher-level components like GridraStack.",
    importExample: 'import { GridraBox } from "@gridra-ui/react";',
    propsDescription: "Also accepts any native HTML attributes for the rendered element.",
    props: [
      { name: "as", group: "Element", values: ["div", "section", "article", "aside", "header", "footer", "main", "span"], type: "GridraBoxAs", default: "\"div\"", description: "Semantic HTML element to render." },
      { name: "padding", group: "Spacing", type: "\"none\" | \"xs\" | \"sm\" | \"md\" | \"lg\"", description: "Uniform padding using theme spacing tokens." },
      { name: "paddingX", group: "Spacing", type: "\"none\" | \"xs\" | \"sm\" | \"md\" | \"lg\"", description: "Horizontal padding override." },
      { name: "paddingY", group: "Spacing", type: "\"none\" | \"xs\" | \"sm\" | \"md\" | \"lg\"", description: "Vertical padding override." },
      { name: "surface", group: "Appearance", type: "\"none\" | \"surface\" | \"raised\" | \"input\" | \"selected\"", description: "Background surface token." },
      { name: "border", group: "Appearance", type: "\"none\" | \"default\" | \"strong\"", description: "Border style using theme border colors." },
      { name: "radius", group: "Appearance", type: "\"none\" | \"sm\" | \"md\"", description: "Border radius token." },
      { name: "display", group: "Layout", type: "\"block\" | \"flex\" | \"grid\" | \"inline-flex\"", description: "CSS display value." },
      { name: "gap", group: "Spacing", type: "\"none\" | \"xs\" | \"sm\" | \"md\" | \"lg\"", description: "Gap between children when display is flex or grid." },
      { name: "fullWidth", group: "Layout", type: "boolean", default: "false", description: "Sets width to 100%." },
      { name: "fullHeight", group: "Layout", type: "boolean", default: "false", description: "Sets height to 100%." },
      { name: "scroll", group: "Layout", type: "\"none\" | \"auto\" | \"x\" | \"y\"", description: "Overflow scroll behavior." },
      { name: "minWidthZero", group: "Layout", type: "boolean", default: "false", description: "Sets min-width to 0 to prevent flex/grid blowout." },
      { name: "minHeightZero", group: "Layout", type: "boolean", default: "false", description: "Sets min-height to 0 to prevent flex/grid blowout." },
      { name: "className", group: "Element", type: "string", description: "Additional CSS classes. Merged with internal classes." },
      { name: "style", group: "Element", type: "CSSProperties", description: "Inline styles applied directly to the element." },
      { name: "children", group: "Element", type: "ReactNode", description: "Box content." }
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
      "Use GridraBox for both visual primitives and width-constrained layout. For a readable content width recipe, combine maxWidth with marginInline in style.",
    avoid:
      "Avoid using GridraBox alone as a team-wide width standard. Repeating one-off max-width and margin rules can drift across screens.",
    compositions: [
      "GridraBox + GridraStack / GridraGridLayout: use Box as a low-level wrapper around layout primitives.",
      "GridraBox + style({ maxWidth, marginInline }): canonical width-constrained content area."
    ],
    examples: [
      {
        title: "Basic padded surface",
        preview: <GridraBox padding="md" surface="raised" border="default"><GridraBadge>Content</GridraBadge></GridraBox>,
        code: `<GridraBox padding="md" surface="raised" border="default">
  <GridraBadge>Content</GridraBadge>
</GridraBox>`
      },
      {
        title: "Flex container with gap",
        preview: <GridraBox display="flex" gap="sm" padding="sm" surface="input">
          <GridraBadge size="sm">A</GridraBadge><GridraBadge size="sm">B</GridraBadge>
        </GridraBox>,
        code: `<GridraBox display="flex" gap="sm" padding="sm" surface="input">
  <GridraBadge size="sm">A</GridraBadge>
  <GridraBadge size="sm">B</GridraBadge>
</GridraBox>`
      },
      {
        title: "Semantic section with scroll",
        preview: <GridraBox as="section" scroll="y" padding="lg" style={{ height: 96, maxWidth: 280 }}>
          <p style={{ margin: 0 }}>Scrollable content...</p>
          <p>GridraBox keeps scrolling inside its own surface.</p>
          <p>More content below the visible area.</p>
        </GridraBox>,
        code: `<GridraBox as="section" scroll="y" padding="lg" fullHeight>
  <p>Scrollable content...</p>
</GridraBox>`
      },
      {
        title: "Width-constrained content recipe",
        preview: <div style={{ width: "100%", maxWidth: 360 }}>
          <GridraBox border="default" padding="sm" style={{ maxWidth: 720, marginInline: "auto" }} surface="input">
            <GridraBadge>Readable content width</GridraBadge>
          </GridraBox>
        </div>,
        code: `<GridraBox
  border="default"
  padding="sm"
  style={{ maxWidth: 720, marginInline: "auto" }}
  surface="input"
>
  <GridraBadge>Readable content width</GridraBadge>
</GridraBox>`
      }
    ],
    preview: (
      <div className="docs-inline-preview">
        <GridraBox border="default" padding="md" surface="raised">
          <GridraBadge>Content</GridraBadge>
        </GridraBox>
        <GridraBox display="flex" gap="sm" padding="sm" surface="input">
          <GridraBadge size="sm">A</GridraBadge>
          <GridraBadge size="sm">B</GridraBadge>
        </GridraBox>
        <GridraBox border="default" padding="sm" style={{ width: "100%", maxWidth: 360 }} surface="input">
          <GridraBadge>Readable content width</GridraBadge>
        </GridraBox>
      </div>
    ),
    previewCode: `<div className="docs-inline-preview">
  <GridraBox border="default" padding="md" surface="raised">
    <GridraBadge>Content</GridraBadge>
  </GridraBox>
  <GridraBox display="flex" gap="sm" padding="sm" surface="input">
    <GridraBadge size="sm">A</GridraBadge>
    <GridraBadge size="sm">B</GridraBadge>
  </GridraBox>
  <GridraBox border="default" padding="sm"
    style={{ width: "100%", maxWidth: 360 }} surface="input">
    <GridraBadge>Readable content width</GridraBadge>
  </GridraBox>
</div>`
  };
