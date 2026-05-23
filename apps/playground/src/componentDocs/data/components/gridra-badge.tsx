import { GridraBadge, GridraInline, GridraStack } from "@gridra-ui/react";
import type { ComponentDoc } from "../../types";

export const badgeDoc: ComponentDoc = {
    category: "Display",
    name: "GridraBadge",
    summary: "Small status or metadata chip.",
    description:
      "GridraBadge is a compact inline chip for statuses, tags, and metadata. It supports multiple tones, sizes, and shapes, and uses uppercase typography.",
    importExample: 'import { GridraBadge } from "@gridra-ui/react";',
    props: [
      { name: "tone", type: "\"default\" | \"accent\" | \"muted\" | \"success\" | \"warning\" | \"danger\"", default: "\"default\"", description: "Color tone." },
      { name: "size", type: "\"sm\" | \"md\"", default: "\"md\"", description: "Badge size." },
      { name: "shape", type: "\"square\" | \"rounded\" | \"pill\"", default: "\"square\"", description: "Border radius shape." },
      { name: "children", type: "ReactNode", description: "Badge text." },
      { name: "className", type: "string", description: "Additional CSS classes." }
    ],
    options: [
      "tone: default | accent | muted | success | warning | danger",
      "size: sm | md",
      "shape: square | rounded | pill",
      "children",
      "HTML span attributes"
    ],
    features: [
      "Supports neutral, accent, muted, success, warning, and danger tones.",
      "Supports square, rounded, and pill shapes.",
      "Uses compact uppercase typography."
    ],
    examples: [
      {
        title: "Tones",
        code: `<GridraBadge>Default</GridraBadge>
<GridraBadge tone="accent">Accent</GridraBadge>
<GridraBadge tone="muted">Muted</GridraBadge>`
      },
      {
        title: "Shapes",
        code: `<GridraBadge shape="pill" size="sm" tone="success">Success</GridraBadge>
<GridraBadge shape="rounded" tone="warning">Warning</GridraBadge>
<GridraBadge tone="danger">Danger</GridraBadge>`
      }
    ],
    preview: (
      <GridraStack gap="sm">
        <GridraInline align="center" gap="sm">
          <GridraBadge tone="default">Default</GridraBadge>
          <GridraBadge tone="accent">Accent</GridraBadge>
          <GridraBadge tone="muted">Muted</GridraBadge>
        </GridraInline>
        <GridraInline align="center" gap="sm">
          <GridraBadge size="sm">Small</GridraBadge>
          <GridraBadge shape="pill">Pill</GridraBadge>
          <GridraBadge shape="pill" size="sm">Pill Small</GridraBadge>
        </GridraInline>
      </GridraStack>
    )
  };
