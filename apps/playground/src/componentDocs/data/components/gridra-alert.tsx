import { useEffect, useRef, useState } from "react";
import { GridraAlert, GridraButton } from "@gridra-ui/react";
import type { GridraAlertTone } from "@gridra-ui/react";
import type { ComponentDoc } from "../../types";

interface AlertToast {
  id: number;
  body: string;
  heading: string;
  tone: GridraAlertTone;
}

const alertToastMessages: Record<GridraAlertTone, Omit<AlertToast, "id">> = {
  info: {
    body: "Nodes can now be linked from output handles to input handles.",
    heading: "Connection ready",
    tone: "info",
  },
  success: {
    body: "The current canvas layout has been persisted.",
    heading: "Layout saved",
    tone: "success",
  },
  warning: {
    body: "Some nodes are still using stale connection metadata.",
    heading: "Partial sync",
    tone: "warning",
  },
  danger: {
    body: "The connection layer could not refresh. Check the source node and retry.",
    heading: "Sync failed",
    tone: "danger",
  },
};

function GridraAlertPreview() {
  const nextToastIdRef = useRef(0);
  const [toasts, setToasts] = useState<AlertToast[]>([]);

  useEffect(() => {
    if (toasts.length === 0) {
      return;
    }

    const oldestToast = toasts[0];
    const timeoutId = window.setTimeout(() => {
      setToasts((current) => current.filter((toast) => toast.id !== oldestToast.id));
    }, 4200);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [toasts]);

  const showToast = (tone: GridraAlertTone) => {
    const nextToast = {
      ...alertToastMessages[tone],
      id: nextToastIdRef.current,
    };

    nextToastIdRef.current += 1;
    setToasts((current) => [...current.slice(-2), nextToast]);
  };

  const dismissToast = (id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  };

  return (
    <div className="docs-alert-toast-preview">
      <div className="docs-alert-toast-preview__controls">
        <GridraButton onClick={() => showToast("info")}>Info toast</GridraButton>
        <GridraButton onClick={() => showToast("success")}>Success toast</GridraButton>
        <GridraButton onClick={() => showToast("warning")}>Warning toast</GridraButton>
        <GridraButton onClick={() => showToast("danger")}>Danger toast</GridraButton>
      </div>
      <div className="docs-alert-toast-preview__surface" aria-label="Toast preview surface">
        <div className="docs-alert-toast-preview__hint">Toast viewport</div>
        <div className="docs-alert-toast-preview__viewport">
          {toasts.map((toast) => (
            <GridraAlert
              action={
                <GridraButton
                  onClick={() => dismissToast(toast.id)}
                  size="sm"
                  variant="ghost"
                >
                  Dismiss
                </GridraButton>
              }
              className="docs-alert-toast-preview__toast"
              heading={toast.heading}
              key={toast.id}
              tone={toast.tone}
            >
              {toast.body}
            </GridraAlert>
          ))}
        </div>
      </div>
    </div>
  );
}

export const alertDoc: ComponentDoc = {
  category: "Feedback",
  name: "GridraAlert",
  summary: "Alert message that can be mounted inline or inside a toast viewport.",
  description:
    "GridraAlert renders a feedback message for status messages, warnings, errors, and success confirmations. It supports four tone variants with automatic ARIA role assignment (status for info/success, alert for warning/danger). Optional heading, icon, and action slots allow it to be mounted inline or inside a toast-style viewport.",
  importExample: 'import { GridraAlert } from "@gridra-ui/react";',
  props: [
    { name: "tone", type: '"info" | "success" | "warning" | "danger"', default: '"info"', description: "Visual variant and default ARIA role." },
    { name: "heading", type: "ReactNode", description: "Optional heading text." },
    { name: "icon", type: "ReactNode", description: "Optional leading icon." },
    { name: "action", type: "ReactNode", description: "Optional trailing action element (e.g. button)." },
    { name: "children", type: "ReactNode", description: "Body text content." },
  ],
  options: [
    "tones: info | success | warning | danger",
    "heading slot",
    "icon slot (no built-in icons)",
    "action slot",
    "role override support",
  ],
  features: [
    "Automatic ARIA role: warning/danger -> alert, info/success -> status.",
    "Consumer can override role explicitly.",
    "Grid layout: icon, body (heading + text), action aligned horizontally.",
    "Tone-specific border, background, and heading accent.",
    "Accepts all standard HTML div attributes (className, data-*, etc.).",
  ],
  usage:
    "Use GridraAlert as the message surface for inline feedback or for toast-style notifications mounted in an app-level viewport. The surrounding app owns visibility, queueing, and auto-dismiss behavior.",
  avoid:
    "Avoid putting queue, portal, and timer behavior directly into GridraAlert. Keep those concerns in the toast viewport or notification manager that renders it.",
  compositions: [
    "GridraAlert + toast viewport: transient notifications.",
    "GridraAlert + GridraButton: actionable notification with retry/dismiss.",
  ],
  examples: [
    {
      title: "Toast-style alert",
      code: `const [toast, setToast] = useState(false);

<>
  <GridraButton onClick={() => setToast(true)}>
    Show alert toast
  </GridraButton>
  <div className="toast-viewport">
    {toast && (
      <GridraAlert
        action={<GridraButton size="sm" variant="ghost" onClick={() => setToast(false)}>Dismiss</GridraButton>}
        heading="Update available"
        tone="info"
      >
        A new version v2.1.0 is ready to install.
      </GridraAlert>
    )}
  </div>
</>`,
    },
    {
      title: "Danger toast with action",
      code: `const [error, setError] = useState(false);

<>
  <GridraButton onClick={() => setError(true)}>
    Simulate error
  </GridraButton>
  <div className="toast-viewport">
    {error && (
      <GridraAlert
        action={<GridraButton size="sm" variant="ghost" onClick={() => setError(false)}>Dismiss</GridraButton>}
        heading="Connection lost"
        tone="danger"
      >
        Unable to reach the server. Check your network connection.
      </GridraAlert>
    )}
  </div>
</>`,
    },
    {
      title: "All tones",
      code: `{["info", "success", "warning", "danger"].map((tone) => (
  <GridraAlert key={tone} tone={tone as any}>
    {tone} message content
  </GridraAlert>
))}`,
    },
  ],
  preview: <GridraAlertPreview />,
  accessibility:
    "Info and success tones use role=status for polite announcement. Warning and danger tones use role=alert for immediate announcement. Consumers can override role explicitly. The action slot should contain accessible controls (e.g., buttons with labels).",
};
