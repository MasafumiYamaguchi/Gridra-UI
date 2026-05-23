import { GridraAvatar, GridraInline, GridraStack } from "@gridra-ui/react";
import type { ComponentDoc } from "../../types";

const avatarImageUrl = "https://i.pravatar.cc/96?img=12";

export const avatarDoc: ComponentDoc = {
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
  };
