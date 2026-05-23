import { GridraResizeHandle } from "@gridra-ui/react";
import type { ComponentDoc } from "../../types";

export const resizeHandleDoc: ComponentDoc = {
    category: "Core",
    name: "GridraResizeHandle",
    summary: "Handle used to resize grid nodes.",
    description:
      "GridraResizeHandle is a small corner/edge handle used to indicate resizable areas. It forwards pointer events and can be placed inline or absolutely inside a node.",
    importExample: 'import { GridraResizeHandle } from "@gridra-ui/react";',
    props: [
      { name: "position", type: "\"right\" | \"bottom\" | \"bottom-right\" | \"inline\"", default: "\"bottom-right\"", description: "Position modifier class." },
      { name: "children", type: "ReactNode", description: "Custom handle content. Defaults to an L-shaped corner." },
      { name: "className", type: "string", description: "Additional CSS classes." }
    ],
    options: ["position: right | bottom | bottom-right | inline", "HTML span attributes"],
    features: ["Forwards pointer handlers.", "Supports right, bottom, corner, and inline rendering."],
    examples: [
      {
        title: "Corner handle",
        code: `<GridraResizeHandle position="inline" />`
      }
    ],
    preview: <GridraResizeHandle position="inline" />
  };
