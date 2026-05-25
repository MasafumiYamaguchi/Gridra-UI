import type { ComponentDoc } from "../types";
import { controlsDocs } from "./controls";
import { coreDocs } from "./core";
import { displayDocs } from "./display";
import { feedbackDocs } from "./feedback";
import { layoutDocs } from "./layout";
import { navigationDocs } from "./navigation";
import { overlaysDocs } from "./overlays";

export const componentDocs: ComponentDoc[] = [
  ...layoutDocs,
  ...coreDocs,
  ...controlsDocs,
  ...displayDocs,
  ...overlaysDocs,
  ...navigationDocs,
  ...feedbackDocs,
];
