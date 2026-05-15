import type { ComponentDoc } from "../types";
import { controlsDocs } from "./controls";
import { coreDocs } from "./core";
import { displayDocs } from "./display";
import { layoutDocs } from "./layout";
import { overlaysDocs } from "./overlays";

export const componentDocs: ComponentDoc[] = [
  ...layoutDocs,
  ...coreDocs,
  ...controlsDocs,
  ...displayDocs,
  ...overlaysDocs
];
