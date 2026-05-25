import type { ComponentDoc } from "../types";
import { accordionDoc } from "./components/gridra-accordion";
import { breadcrumbDoc } from "./components/gridra-breadcrumb";
import { menuDoc } from "./components/gridra-menu";
import { paginationDoc } from "./components/gridra-pagination";
import { stepperDoc } from "./components/gridra-stepper";
import { tabsDoc } from "./components/gridra-tabs";
import { treeViewDoc } from "./components/gridra-tree-view";

export const navigationDocs: ComponentDoc[] = [
  menuDoc,
  accordionDoc,
  breadcrumbDoc,
  treeViewDoc,
  tabsDoc,
  paginationDoc,
  stepperDoc,
];
