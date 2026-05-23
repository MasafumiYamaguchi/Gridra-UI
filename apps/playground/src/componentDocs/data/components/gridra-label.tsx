import { GridraLabel } from "@gridra-ui/react";
import type { ComponentDoc } from "../../types";

export const labelDoc: ComponentDoc = {
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
  };
