import type { ComponentDoc } from "../types";
import { badgeDoc } from "./components/gridra-badge";
import { buttonDoc } from "./components/gridra-button";
import { checkboxDoc } from "./components/gridra-checkbox";
import { fieldDoc } from "./components/gridra-field";
import { iconButtonDoc } from "./components/gridra-icon-button";
import { inputDoc } from "./components/gridra-input";
import { labelDoc } from "./components/gridra-label";
import { radioDoc } from "./components/gridra-radio";
import { selectDoc } from "./components/gridra-select";
import { sliderDoc } from "./components/gridra-slider";
import { switchDoc } from "./components/gridra-switch";
import { textareaDoc } from "./components/gridra-textarea";
import { toolbarDoc } from "./components/gridra-toolbar";

export const controlsDocs: ComponentDoc[] = [
  toolbarDoc,
  buttonDoc,
  iconButtonDoc,
  fieldDoc,
  inputDoc,
  selectDoc,
  textareaDoc,
  checkboxDoc,
  radioDoc,
  switchDoc,
  sliderDoc,
  labelDoc,
  badgeDoc,
];
