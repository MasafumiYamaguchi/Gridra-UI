import type { ComponentDoc } from "../types";
import { commandPaletteDoc } from "./components/gridra-command-palette";
import { contextMenuDoc } from "./components/gridra-context-menu";
import { dialogDoc } from "./components/gridra-dialog";
import { dropdownMenuDoc } from "./components/gridra-dropdown-menu";
import { hoverCardDoc } from "./components/gridra-hover-card";
import { popoverDoc } from "./components/gridra-popover";
import { tooltipDoc } from "./components/gridra-tooltip";

export const overlaysDocs: ComponentDoc[] = [
  tooltipDoc,
  popoverDoc,
  dialogDoc,
  dropdownMenuDoc,
  contextMenuDoc,
  commandPaletteDoc,
  hoverCardDoc,
];
