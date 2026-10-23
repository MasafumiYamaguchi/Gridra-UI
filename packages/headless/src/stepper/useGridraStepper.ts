import {
  useMemo,
  useState,
  type ReactNode,
  type ButtonHTMLAttributes,
} from "react";
import { composeHandlers } from "../internal/composeHandlers";

export interface GridraStepperItem {
  id: string;
  label: ReactNode;
  description?: ReactNode;
  disabled?: boolean;
}

export interface UseGridraStepperOptions {
  items: GridraStepperItem[];
  currentId?: string;
  defaultCurrentId?: string;
  disabled?: boolean;
  onStepChange?: (nextId: string, previousId: string) => void;
}

/** 手順の状態と前後への移動を共有し、表示・進捗文言・入力検証は利用側が担当する。 */
export function useGridraStepper({
  items,
  currentId: currentIdProp,
  defaultCurrentId,
  disabled = false,
  onStepChange,
}: UseGridraStepperOptions) {
  const enabledIds = useMemo(
    () => items.filter((item) => !item.disabled).map((item) => item.id),
    [items],
  );
  const [internalCurrentId, setInternalCurrentId] = useState(
    () => defaultCurrentId ?? "",
  );
  const rawCurrentId = currentIdProp ?? internalCurrentId;
  const currentId = enabledIds.includes(rawCurrentId)
    ? rawCurrentId
    : (enabledIds[0] ?? null);
  const currentIndex =
    currentId == null ? -1 : items.findIndex((item) => item.id === currentId);

  const positionOf = (index: number) =>
    index < 0
      ? 0
      : items.length === 1
        ? 100
        : (index / (items.length - 1)) * 100;

  const progress = positionOf(currentIndex);
  const steps = items.map((item, index) => {
    const locked = Boolean(item.disabled);
    const completed = currentIndex >= 0 && index < currentIndex && !locked;
    const current = index === currentIndex;
    const pending = !locked && (currentIndex < 0 || index > currentIndex);
    // pendingは未到達を表す表示状態。明示的に無効化しない限り、先の手順もクリックで選べる。
    const buttonDisabled = disabled || locked || currentIndex < 0;
    const traversed = index < currentIndex;
    const connectorState = traversed
      ? "completed"
      : current
        ? "current"
        : pending
          ? "pending"
          : "locked";

    return {
      item,
      index,
      locked,
      completed,
      current,
      pending,
      buttonDisabled,
      traversed,
      connectorState,
      canGoBack: completed && !buttonDisabled,
    };
  });

  const handleStepClick = (id: string) => {
    if (
      currentId == null ||
      id === currentId ||
      !steps.some((step) => step.item.id === id && !step.buttonDisabled)
    )
      return;

    // uncontrolledでは内部状態を更新し、controlledでは親への通知だけを行う。
    if (currentIdProp === undefined) setInternalCurrentId(id);

    onStepChange?.(id, currentId);
  };

  const getStepProps = (
    id: string,
    props: ButtonHTMLAttributes<HTMLButtonElement> = {},
  ): ButtonHTMLAttributes<HTMLButtonElement> => {
    const step = steps.find((step) => step.item.id === id);

    return {
      ...props,
      type: "button",
      "aria-current": step?.current ? "step" : undefined,
      "aria-disabled": !step || step.buttonDisabled || undefined,
      onClick: composeHandlers(props.onClick, () => handleStepClick(id)),
    };
  };

  return {
    currentId,
    currentIndex,
    progress,
    steps,
    positionOf,
    handleStepClick,
    getStepProps,
  };
}
