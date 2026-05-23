import { GridraBadge, GridraGridLayout } from "@gridra-ui/react";
import type { ComponentDoc } from "../../types";

export const gridLayoutDoc: ComponentDoc = {
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
  };
