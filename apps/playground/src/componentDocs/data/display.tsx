import { GridraAvatar, GridraBadge, GridraCluster, GridraDivider, GridraInline, GridraLabel, GridraSpinner, GridraStack } from "@gridra-ui/react";
import type { ComponentDoc } from "../types";
const avatarImageUrl = "https://i.pravatar.cc/96?img=12";

export const displayDocs: ComponentDoc[] = [
  {
    category: "Display",
    name: "GridraLabel",
    summary: "Standalone label typography primitive.",
    description:
      "GridraLabel renders a styled label element that matches the Gridra uppercase panel typography. Use it to label controls or as a section header.",
    importExample: 'import { GridraLabel } from "@gridra-ui/react";',
    props: [
      { name: "htmlFor", type: "string", description: "ID of the associated form control." },
      { name: "children", type: "ReactNode", description: "Label text." },
      { name: "className", type: "string", description: "Additional CSS classes." }
    ],
    options: ["htmlFor", "children", "All label attributes"],
    features: ["Matches Gridra uppercase panel typography.", "Can label native or custom controls."],
    examples: [
      {
        title: "Basic label",
        code: `<GridraLabel>Properties</GridraLabel>`
      }
    ],
    preview: <GridraLabel>Properties</GridraLabel>
  },
  {
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
  },
  {
    category: "Display",
    name: "GridraAvatar",
    summary: "Image or fallback avatar for people, agents, or entities.",
    description:
      "GridraAvatar renders an image when src is provided, otherwise falls back to initials or the first two characters of alt. It supports preset sizes, custom pixel/string sizes, and three shape variants.",
    importExample: 'import { GridraAvatar } from "@gridra-ui/react";',
    props: [
      { name: "src", type: "string", description: "Image URL." },
      { name: "alt", type: "string", default: '""', description: "Image alt text. Used as fallback text source." },
      { name: "fallback", type: "string", description: "Fallback text when src is absent. Overrides alt slice." },
      { name: "size", type: "\"sm\" | \"md\" | \"lg\" | number | string", default: "\"md\"", description: "Preset size or custom CSS size value." },
      { name: "shape", type: "\"square\" | \"rounded\" | \"circle\"", default: "\"square\"", description: "Border radius shape." },
      { name: "monochrome", type: "boolean", default: "false", description: "Apply grayscale filter to the image." },
      { name: "className", type: "string", description: "Additional CSS classes." }
    ],
    options: [
      "src",
      "alt",
      "fallback",
      "size: sm | md | lg | number | string",
      "shape: square | rounded | circle",
      "monochrome",
      "HTML span attributes"
    ],
    features: [
      "Renders an image when src exists.",
      "Falls back to initials or the first two alt characters.",
      "Supports preset and custom CSS sizes.",
      "Can render square, softly rounded, or circular shapes.",
      "Can apply monochrome image treatment."
    ],
    examples: [
      {
        title: "Image avatars",
        code: `<GridraAvatar alt="User" shape="square" size="sm" src={avatarImageUrl} />
<GridraAvatar alt="User" shape="rounded" size="md" src={avatarImageUrl} />
<GridraAvatar alt="User" shape="circle" size="lg" src={avatarImageUrl} />`
      },
      {
        title: "Fallback and custom size",
        code: `<GridraAvatar fallback="UI" shape="circle" size={34} />
<GridraAvatar alt="User" monochrome shape="circle" size="lg" src={avatarImageUrl} />`
      }
    ],
    preview: (
      <GridraStack gap="sm">
        <GridraInline align="center" gap="sm">
          <GridraAvatar alt="Demo" shape="square" size="sm" src={avatarImageUrl} />
          <GridraAvatar alt="Demo" shape="rounded" size="md" src={avatarImageUrl} />
          <GridraAvatar alt="Demo" shape="circle" size="lg" src={avatarImageUrl} />
        </GridraInline>
        <GridraInline align="center" gap="sm">
          <GridraAvatar alt="Demo" monochrome shape="circle" size="md" src={avatarImageUrl} />
          <GridraAvatar fallback="FB" shape="square" size="md" />
        </GridraInline>
      </GridraStack>
    )
  },
  {
    category: "Display",
    name: "GridraSpinner",
    summary: "Small loading indicator.",
    description:
      "GridraSpinner renders an animated spinning indicator. It supports preset and custom sizes, tone variants, and animation speeds. The label prop sets the accessible name via aria-label.",
    importExample: 'import { GridraSpinner } from "@gridra-ui/react";',
    props: [
      { name: "label", type: "string", default: '"Loading"', description: "Accessible status name (aria-label)." },
      { name: "size", type: "\"sm\" | \"md\" | \"lg\" | number | string", default: "\"md\"", description: "Preset size or custom CSS size value." },
      { name: "tone", type: "\"default\" | \"muted\" | \"accent\"", default: "\"default\"", description: "Color tone of the spinner track." },
      { name: "speed", type: "\"slow\" | \"normal\" | \"fast\"", default: "\"normal\"", description: "Animation duration." },
      { name: "className", type: "string", description: "Additional CSS classes." }
    ],
    options: [
      "label",
      "size: sm | md | lg | number | string",
      "tone: default | muted | accent",
      "speed: slow | normal | fast",
      "HTML span attributes"
    ],
    features: [
      "Sets role status.",
      "Uses label as the accessible status name.",
      "Supports preset and custom CSS sizes.",
      "Supports muted/accent tone and animation speed changes."
    ],
    examples: [
      {
        title: "Sizes and tones",
        code: `<GridraSpinner label="Loading small" size="sm" tone="muted" />
<GridraSpinner label="Loading" />
<GridraSpinner label="Loading large" size="lg" speed="slow" tone="accent" />`
      }
    ],
    preview: (
      <div className="docs-inline-preview">
        <GridraSpinner label="Loading small" size="sm" tone="muted" />
        <GridraSpinner label="Loading" />
        <GridraSpinner label="Loading large" size="lg" speed="slow" tone="accent" />
        <GridraSpinner label="Loading custom" size={32} speed="fast" />
      </div>
    )
  },
  {
    category: "Display",
    name: "GridraDivider",
    summary: "Horizontal or vertical separator.",
    description:
      "GridraDivider renders a styled hr element for separating content. It supports horizontal and vertical orientations, spacing tokens, inset mode, and visual strength tones.",
    importExample: 'import { GridraDivider } from "@gridra-ui/react";',
    props: [
      { name: "orientation", type: "\"horizontal\" | \"vertical\"", default: "\"horizontal\"", description: "Layout direction." },
      { name: "tone", type: "\"default\" | \"strong\" | \"muted\"", default: "\"default\"", description: "Visual strength." },
      { name: "spacing", type: "\"none\" | \"sm\" | \"md\" | \"lg\"", default: "\"sm\"", description: "Margin around the divider." },
      { name: "inset", type: "boolean", default: "false", description: "Inset margin for a shorter divider." },
      { name: "className", type: "string", description: "Additional CSS classes." }
    ],
    options: [
      "orientation: horizontal | vertical",
      "tone: default | strong | muted",
      "spacing: none | sm | md | lg",
      "inset",
      "HTML hr attributes"
    ],
    features: [
      "Sets role separator.",
      "Maps orientation to aria-orientation.",
      "Supports spacing, inset, and visual strength options."
    ],
    examples: [
      {
        title: "Horizontal dividers",
        code: `<GridraDivider spacing="none" tone="muted" />
<GridraDivider inset spacing="md" tone="strong" />`
      },
      {
        title: "Vertical divider",
        code: `<GridraDivider orientation="vertical" spacing="lg" />`
      }
    ],
    preview: (
      <div className="docs-divider-preview">
        <GridraDivider spacing="none" tone="muted" />
        <GridraDivider inset spacing="md" tone="strong" />
        <GridraDivider orientation="vertical" spacing="lg" />
      </div>
    )
  }
];
