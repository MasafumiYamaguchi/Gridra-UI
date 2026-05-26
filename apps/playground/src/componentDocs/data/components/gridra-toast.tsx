import { GridraButton, GridraToastProvider, useToast } from "@gridra-ui/react";
import type { ComponentDoc } from "../../types";

function ToastPreview() {
  const { show } = useToast();

  return (
    <div style={{ display: "flex", gap: "var(--gridra-space-sm)", flexWrap: "wrap" }}>
      <GridraButton onClick={() => show("File saved successfully")}>
        Show toast
      </GridraButton>
      <GridraButton onClick={() => show("Connection lost. Retrying...")}>
        Show another
      </GridraButton>
    </div>
  );
}

export const toastDoc: ComponentDoc = {
  category: "Feedback",
  name: "GridraToast",
  summary:
    "Provider-based transient notification system that displays short messages at the top or bottom of the viewport with automatic dismissal.",
  description:
    "GridraToast provides a lightweight notification system inspired by Android Toast. Messages appear at the bottom or top center of the viewport and auto-dismiss after a configurable duration. Multiple calls are queued and shown one at a time in FIFO order. Toasts do not capture focus and are intended for non-blocking transient feedback.",
  importExample:
    'import { GridraToastProvider, useToast } from "@gridra-ui/react";',
  props: [
    {
      name: "GridraToastProvider > children",
      type: "ReactNode",
      description: "The subtree that has access to useToast().",
    },
    {
      name: "GridraToastProvider > position",
      type: '"top" | "bottom"',
      default: '"bottom"',
      description: "Controls where toasts appear on the screen.",
    },
    {
      name: "show(message, options?)",
      type: "function",
      description: "Queues a toast for display.",
    },
    {
      name: "message",
      type: "ReactNode",
      description: "The message to display.",
    },
    {
      name: "options.duration",
      type: "number",
      default: "3000",
      description: "How long the toast stays visible (ms).",
    },
    {
      name: "options.id",
      type: "string",
      description: "Optional identifier. Auto-generated if omitted.",
    },
    {
      name: "options.role",
      type: "string",
      default: '"status"',
      description: "ARIA role for the toast element.",
    },
    {
      name: "options.className",
      type: "string",
      description: "Additional CSS class for the toast surface.",
    },
  ],
  options: [
    "duration: configurable in ms (default 3000)",
    "id: optional custom identifier",
    "role: ARIA role override (default status)",
    "className: additional styling class",
    "position: top or bottom placement (default bottom)",
    "FIFO queue: one toast visible at a time",
    "Exit animation on dismissal",
    "prefers-reduced-motion support",
  ],
  features: [
    "Portal-based rendering to document.body with theme class inheritance.",
    "FIFO queuing — multiple show() calls display sequentially, never overlapping.",
    "Auto-dismiss after configurable duration, with smooth exit animation.",
    "Never captures focus — toast is purely a visual notification.",
    "Accessible default role=status with consumer override support.",
  ],
  usage: "Wrap your app (or a section) with GridraToastProvider and call useToast().show() from any descendant component. Best suited for lightweight confirmations (\"Saved\", \"Copied\") and transient status messages.",
  avoid: "Avoid using GridraToast for interactive or blocking feedback — use GridraAlert or GridraDialog instead. Toasts cannot contain buttons or links since they disappear automatically. Avoid chaining very long messages that need time to read.",
  compositions: [
    "GridraToastProvider + useToast: anywhere in the React tree.",
    "GridraToast + toolbars / action buttons: confirm an action silently.",
    "GridraToast + copy-to-clipboard: brief \"Copied\" confirmation.",
  ],
  examples: [
    {
      title: "Basic toast",
      code: `<GridraToastProvider>
  <App />
</GridraToastProvider>

// In any descendant:
const { show } = useToast();
show("File saved successfully");`,
    },
    {
      title: "With custom duration",
      code: `const { show } = useToast();
show("This stays longer", { duration: 5000 });`,
    },
    {
      title: "Quick burst (queued)",
      code: `const { show } = useToast();

// Each appears one at a time, FIFO order.
show("First");
show("Second");
show("Third");`,
    },
    {
      title: "Position at top",
      code: `<GridraToastProvider position="top">
  <App />
</GridraToastProvider>`,
    },
  ],
  preview: (
    <GridraToastProvider>
      <ToastPreview />
    </GridraToastProvider>
  ),
  accessibility:
    'Toasts use role="status" by default for polite announcement without interrupting the user. Consumers can override the role via options.role when more assertive behavior is needed. Toasts do not receive focus and are rendered into document.body via portal with inherited theme context.',
};
