import type { ComponentDoc } from "../types";
import { alertDoc } from "./components/gridra-alert";
import { errorMessageDoc, statusIndicatorDoc } from "./components/gridra-error-status";
import { emptyStateDoc, skeletonDoc } from "./components/gridra-skeleton-empty";
import { progressDoc } from "./components/gridra-progress";
import { toastDoc } from "./components/gridra-toast";

export const feedbackDocs: ComponentDoc[] = [
  alertDoc,
  errorMessageDoc,
  emptyStateDoc,
  progressDoc,
  skeletonDoc,
  statusIndicatorDoc,
  toastDoc,
];
