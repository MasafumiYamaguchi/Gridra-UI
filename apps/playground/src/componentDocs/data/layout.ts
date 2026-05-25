import type { ComponentDoc } from "../types";
import { boxDoc } from "./components/gridra-box";
import { clusterDoc } from "./components/gridra-cluster";
import { gridLayoutDoc } from "./components/gridra-grid-layout";
import { inlineDoc } from "./components/gridra-inline";
import { sidebarDoc } from "./components/gridra-sidebar";
import { splitPaneDoc } from "./components/gridra-split-pane";
import { stackDoc } from "./components/gridra-stack";

export const layoutDocs: ComponentDoc[] = [
  boxDoc,
  stackDoc,
  inlineDoc,
  clusterDoc,
  sidebarDoc,
  splitPaneDoc,
  gridLayoutDoc,
];
