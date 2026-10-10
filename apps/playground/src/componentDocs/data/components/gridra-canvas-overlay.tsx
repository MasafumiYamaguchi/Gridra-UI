import type { ComponentDoc } from "../../types";
import { CanvasPreview } from "./use-gridra-canvas";

export const canvasOverlayDoc: ComponentDoc = {
  category: "Core", name: "GridraCanvasOverlay",
  summary: "Visual connection, selection and snap overlays from plain pixel geometry.",
  description: "Render inside your own grid container with the hook's overlayProps. This component owns no state or pointer operation; you can also build a custom renderer from the same data.",
  importExample: 'import { GridraCanvasOverlay } from "@gridra-ui/react";',
  props: [
    { name: "width / height", type: "number", required: true, description: "Container-content pixel dimensions." },
    { name: "segments", type: "GridraConnectionSegment[]", required: true, description: "Connection paths with selection state." },
    { name: "previewPath", type: "string", description: "Transient connection path." },
    { name: "selectionRect", type: "GridraRect", description: "Transient range-selection rectangle." },
    { name: "snapGuides", type: "GridraCanvasSnapGuide[]", required: true, description: "Transient alignment guide geometry." },
    { name: "gridLines", type: "GridraCanvasSnapGuide[]", description: "Dashed cell boundaries shown during dragging and resizing, including padding and gaps." },
    { name: "onConnectionSelect", type: "(connection) => void", description: "Provided by the hook for controlled connection selection." },
  ],
  options: ["overlayProps", "className", "style"],
  features: ["Rendering only.", "Padding and gap aware pixel paths.", "Custom CSS stroke width."],
  examples: [{ title: "Explicit overlay placement", code: '<GridraCanvasOverlay {...canvas.overlayProps} />' }],
  usage: "Place directly inside the same relative container as the nodes. Most overlay pixels ignore pointer input; connection strokes can be selected. Set --gridra-connection-line-width on the container to style stroke width.",
  preview: <CanvasPreview />,
};
