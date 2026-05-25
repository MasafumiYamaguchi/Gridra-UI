import type { ComponentDoc } from "../types";
import { canvasAreaDoc } from "./components/gridra-canvas-area";
import { connectionHandleDoc } from "./components/gridra-connection-handle";
import { dragHandleDoc } from "./components/gridra-drag-handle";
import { inspectorPanelDoc } from "./components/gridra-inspector-panel";
import { minimapDoc } from "./components/gridra-minimap";
import { nodeDoc } from "./components/gridra-node";
import { panelDoc } from "./components/gridra-panel";
import { propertiesPanelDoc } from "./components/gridra-properties-panel";
import { resizeHandleDoc } from "./components/gridra-resize-handle";
import { rootDoc } from "./components/gridra-root";
import { selectableGridDoc } from "./components/gridra-selectable-grid";
import { selectionBoxDoc } from "./components/gridra-selection-box";
import { snapGuideDoc } from "./components/gridra-snap-guide";

export const coreDocs: ComponentDoc[] = [
  rootDoc,
  canvasAreaDoc,
  minimapDoc,
  selectableGridDoc,
  panelDoc,
  inspectorPanelDoc,
  propertiesPanelDoc,
  nodeDoc,
  selectionBoxDoc,
  dragHandleDoc,
  resizeHandleDoc,
  connectionHandleDoc,
  snapGuideDoc,
];
