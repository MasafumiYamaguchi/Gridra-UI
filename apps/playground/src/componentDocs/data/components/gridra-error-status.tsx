import {
  GridraBox,
  GridraButton,
  GridraCluster,
  GridraErrorMessage,
  GridraStack,
  GridraStatusIndicator,
} from "@gridra-ui/react";
import type { ComponentDoc } from "../../types";

export const errorMessageDoc: ComponentDoc = {
  category: "Feedback",
  name: "GridraErrorMessage",
  summary:
    "Lightweight inline error description with danger, warning, and muted tones. Not form-specific.",
  description:
    "GridraErrorMessage renders a compact inline error or warning message. Unlike GridraAlert it is intentionally light — no heading, no border panel, no action slot. It is designed for use below inputs, inside panels, or next to controls that need a short explanation. Use GridraAlert for prominent multi-line feedback blocks.",
  importExample:
    'import { GridraErrorMessage } from "@gridra-ui/react";',
  props: [
    {
      default: '"danger"',
      description: "Tone variant controlling text color and icon accent.",
      name: "tone",
      type: '"danger" | "warning" | "muted"',
    },
    {
      description:
        "Optional leading icon. Wrapped with aria-hidden by default.",
      name: "icon",
      type: "ReactNode",
    },
    {
      description: "Error message content.",
      name: "children",
      type: "ReactNode",
    },
  ],
  options: [
    "tones: danger | warning | muted",
    "optional icon slot",
    "no auto-assigned ARIA role — consumer controls it",
  ],
  features: [
    "Compact inline layout — no border panel, no heading.",
    "No auto role — consumer sets role=alert for immediate announcement when needed.",
    "Aligns visually with GridraField__error for consistent form UX.",
    "Accepts all standard HTML div attributes.",
  ],
  usage: "Use GridraErrorMessage below inputs, inside panels, or alongside controls for lightweight error and warning descriptions. For prominent multi-line feedback use GridraAlert. For form fields, wrap with GridraField which provides integrated error display via the error prop.",
  avoid: "Avoid using GridraErrorMessage as a multi-line notification banner — use GridraAlert instead. Avoid nesting interactive elements inside since the message is display-only.",
  compositions: [
    "GridraErrorMessage + GridraField: integrated form validation.",
    "GridraErrorMessage + GridraInput: custom error below an input.",
    "GridraErrorMessage + aria-describedby: accessible error association.",
  ],
  examples: [
    {
      title: "Basic danger error",
      code: '<GridraErrorMessage>This field is required</GridraErrorMessage>',
    },
    {
      title: "Warning validation",
      code: '<GridraErrorMessage tone="warning">Password strength is moderate</GridraErrorMessage>',
    },
    {
      title: "With alert role",
      code: '<GridraErrorMessage role="alert">Connection failed</GridraErrorMessage>',
    },
  ],
  preview: (
    <GridraStack gap="xs" style={{ maxWidth: 320 }}>
      <GridraErrorMessage>This field is required</GridraErrorMessage>
      <GridraErrorMessage tone="warning">
        Password strength is moderate
      </GridraErrorMessage>
      <GridraErrorMessage tone="muted">
        Username must be at least 3 characters
      </GridraErrorMessage>
    </GridraStack>
  ),
  accessibility:
    "GridraErrorMessage does not auto-assign an ARIA role. For immediate screen-reader announcement, set role=alert explicitly. Pair the message element with the target input's aria-describedby for accessible form error association. The icon slot is aria-hidden by default.",
};

export const statusIndicatorDoc: ComponentDoc = {
  category: "Feedback",
  name: "GridraStatusIndicator",
  summary:
    "Compact dot + label status display for connection, save, sync, and online states.",
  description:
    "GridraStatusIndicator renders a small colored dot with an optional label to convey a succinct status such as Online, Saving, Error, or Syncing. It is intentionally lightweight — no button behavior, no auto-announcement role. For richer status with description text or actions, use GridraAlert.",
  importExample:
    'import { GridraStatusIndicator } from "@gridra-ui/react";',
  props: [
    {
      default: '"neutral"',
      description: "Dot color variant.",
      name: "tone",
      type: '"neutral" | "success" | "warning" | "danger" | "info" | "accent"',
    },
    {
      default: '"md"',
      description: "Dot and label size.",
      name: "size",
      type: '"sm" | "md"',
    },
    {
      description: "Text displayed next to the dot.",
      name: "label",
      type: "ReactNode",
    },
    {
      default: "false",
      description: "Enables an expanding ring animation (e.g. syncing in progress).",
      name: "pulse",
      type: "boolean",
    },
  ],
  options: [
    "tones: neutral | success | warning | danger | info | accent",
    "sizes: sm | md",
    "pulse: expanding ring for in-progress states",
    "label optional — dot-only mode supported",
    "decorative dot with aria-hidden",
  ],
  features: [
    "Inline span element — sits naturally next to text or in toolbars.",
    "Six tone variants for semantic color coding.",
    "Expanding ring animation for transient states, respects prefers-reduced-motion.",
    "No auto role — consumer controls accessibility semantics.",
    "Accepts all standard HTML span attributes.",
  ],
  usage: "Use GridraStatusIndicator in toolbars, panel headers, or alongside item names to show connection state, save status, sync progress, or protocol types. Pair with descriptive text when the label alone isn't enough. For prominent multi-line status messages, use GridraAlert instead.",
  avoid: "Avoid using GridraStatusIndicator as a button or link — it is a display element. Avoid placing it inside interactive labels unless the dot itself is not interactive. If status requires a description or action, prefer GridraAlert.",
  compositions: [
    "GridraStatusIndicator + toolbar: connection health dot.",
    "GridraStatusIndicator + panel header: document saved state.",
    "GridraStatusIndicator + GridraCluster: multi-protocol status row.",
    "GridraStatusIndicator + GridraLabel: detailed status description.",
  ],
  examples: [
    {
      title: "Basic statuses",
      code: `<GridraStatusIndicator label="Online" tone="success" />
<GridraStatusIndicator label="Disconnected" tone="danger" />
<GridraStatusIndicator label="Pending" tone="warning" />`,
    },
    {
      title: "Expanding ring for syncing",
      code: '<GridraStatusIndicator label="Syncing" pulse size="sm" />',
    },
    {
      title: "Dot-only",
      code: '<GridraStatusIndicator tone="success" />',
    },
  ],
  preview: (
    <GridraCluster gap="md">
      <GridraStatusIndicator label="Saved" tone="success" />
      <GridraStatusIndicator label="Online" tone="info" />
      <GridraStatusIndicator label="Pending" tone="warning" />
      <GridraStatusIndicator label="Error" tone="danger" />
      <GridraStatusIndicator label="Syncing" pulse size="sm" />
    </GridraCluster>
  ),
  accessibility:
    "GridraStatusIndicator uses an inline span element without any auto-assigned ARIA role. The dot is aria-hidden since it is purely decorative. The label text carries the semantic meaning. If the status needs live-region announcement, wrap in a container with the appropriate role=status or role=alert.",
};
