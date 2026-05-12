import type { ComponentDoc } from "../types";
import { controlsDocs } from "./controls";
import { coreDocs } from "./core";
import { displayDocs } from "./display";
import { layoutDocs } from "./layout";

export const componentDocs: ComponentDoc[] = [
  ...layoutDocs,
  ...coreDocs,
  ...controlsDocs,
  ...displayDocs
];
