import type { ComponentDoc } from "../types";
import { avatarDoc } from "./components/gridra-avatar";
import { cardDoc } from "./components/gridra-card";
import { descriptionListDoc } from "./components/gridra-description-list";
import { dividerDoc } from "./components/gridra-divider";
import { kbdDoc } from "./components/gridra-kbd";
import { listDoc } from "./components/gridra-list";
import { spinnerDoc } from "./components/gridra-spinner";
import { statDoc } from "./components/gridra-stat";
import { tagDoc } from "./components/gridra-tag";

export const displayDocs: ComponentDoc[] = [
  cardDoc,
  listDoc,
  descriptionListDoc,
  statDoc,
  tagDoc,
  kbdDoc,
  avatarDoc,
  spinnerDoc,
  dividerDoc,
];
