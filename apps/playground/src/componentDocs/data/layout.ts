import type { ComponentDoc } from "../types";
import { boxDoc } from "./components/gridra-box";
import { gridLayoutDoc } from "./components/gridra-grid-layout";
import { sidebarDoc } from "./components/gridra-sidebar";
import { splitPaneDoc } from "./components/gridra-split-pane";
import { stackDoc } from "./components/gridra-stack";

export const layoutDocs: ComponentDoc[] = [
  boxDoc,
  stackDoc,
  sidebarDoc,
  splitPaneDoc,
  gridLayoutDoc,
];
