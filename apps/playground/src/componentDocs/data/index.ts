import type { ComponentDoc } from "../types";
import { controlsDocs } from "./controls";
import { coreDocs } from "./core";
import { displayDocs } from "./display";
import { feedbackDocs } from "./feedback";
import { layoutDocs } from "./layout";
import { navigationDocs } from "./navigation";
import { overlaysDocs } from "./overlays";
import { examplePreviews } from "../example-scenes";

const docs: ComponentDoc[] = [
  ...layoutDocs,
  ...coreDocs,
  ...controlsDocs,
  ...displayDocs,
  ...overlaysDocs,
  ...navigationDocs,
  ...feedbackDocs,
];

export const componentDocs: ComponentDoc[] = docs.map((doc) => ({
  ...doc,
  examples: doc.examples.map((example) => {
    const preview = example.preview ?? examplePreviews[doc.name]?.[example.title];
    if (preview == null) throw new Error(`Missing live example: ${doc.name} / ${example.title}`);
    return { ...example, preview };
  }),
}));
