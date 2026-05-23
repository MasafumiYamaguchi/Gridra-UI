import { GridraDragHandle } from "@gridra-ui/react";
import type { ComponentDoc } from "../../types";

export const dragHandleDoc: ComponentDoc = {
    category: "Core",
    name: "GridraDragHandle",
    summary: "Decorative and interactive grip for node movement.",
    description:
      "GridraDragHandle is a small grip icon used to indicate draggable areas. It forwards pointer events and HTML span attributes so consumers can attach custom drag behavior. It can be rendered absolutely positioned inside a node or inline.",
    importExample: 'import { GridraDragHandle } from "@gridra-ui/react";',
    props: [
      { name: "position", type: "\"top-left\" | \"top-right\" | \"bottom-left\" | \"bottom-right\" | \"inline\"", default: "\"top-left\"", description: "Position modifier class." },
      { name: "children", type: "ReactNode", description: "Custom handle content. Defaults to a grip dot pattern." },
      { name: "className", type: "string", description: "Additional CSS classes." }
    ],
    options: ["position: top-left | top-right | bottom-left | bottom-right | inline", "HTML span attributes"],
    features: ["Forwards pointer handlers.", "Can be used inline or absolutely positioned inside a node."],
    examples: [
      {
        title: "Default grip",
        code: `<GridraDragHandle position="inline" />`
      }
    ],
    preview: <GridraDragHandle position="inline" />
  };
