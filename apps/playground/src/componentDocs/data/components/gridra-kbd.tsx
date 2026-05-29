import { GridraInline, GridraKbd } from "@gridra-ui/react";
import type { ComponentDoc } from "../../types";

export const kbdDoc: ComponentDoc = {
  category: "Display",
  name: "GridraKbd",
  summary: "Keyboard key token for shortcuts and command hints.",
  description:
    "GridraKbd renders a semantic kbd element with Gridra keycap styling. It is display-only and does not attach keyboard listeners.",
  importExample: 'import { GridraKbd } from "@gridra-ui/react";',
  props: [
    { name: "size", type: '"sm" | "md"', default: '"md"', description: "Keycap size." },
    { name: "children", type: "ReactNode", description: "Key label." },
  ],
  options: [
    "size: sm | md",
    "HTML kbd attributes",
  ],
  features: [
    "Uses native kbd semantics.",
    "Compact keycap styling for shortcut hints.",
    "No listener or command behavior.",
  ],
  usage:
    "Use GridraKbd inside documentation, tooltips, command descriptions, and read-only shortcut hints.",
  avoid:
    "Avoid relying on GridraKbd to wire keyboard behavior. Bind shortcuts in the owning interaction layer.",
  accessibility:
    "GridraKbd renders kbd and relies on readable text content. Use aria-label only when a symbol needs a clearer spoken name.",
  examples: [
    {
      title: "Shortcut hint",
      code: `<GridraInline align="center" gap="xs">
  <GridraKbd>Ctrl</GridraKbd>
  <GridraKbd>K</GridraKbd>
</GridraInline>`,
    },
  ],
  preview: (
    <GridraInline align="center" gap="xs">
      <GridraKbd>Ctrl</GridraKbd>
      <GridraKbd>K</GridraKbd>
      <GridraKbd size="sm">Esc</GridraKbd>
    </GridraInline>
  ),
};
