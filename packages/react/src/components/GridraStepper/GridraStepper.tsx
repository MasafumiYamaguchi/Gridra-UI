import { useCallback, useMemo, useState, type HTMLAttributes, type ReactNode } from "react";

export type GridraStepperOrientation = "horizontal" | "vertical";
export type GridraStepperSize = "sm" | "md" | "lg";

export interface GridraStepperItem {
  id: string;
  label: ReactNode;
  description?: ReactNode;
  disabled?: boolean;
}

export interface GridraStepperProps extends HTMLAttributes<HTMLElement> {
  items: GridraStepperItem[];
  currentId?: string;
  defaultCurrentId?: string;
  onStepChange?: (nextId: string, previousId: string) => void;
  orientation?: GridraStepperOrientation;
  size?: GridraStepperSize;
  disabled?: boolean;
}

export function GridraStepper({
  "aria-label": ariaLabel = "Progress",
  className,
  currentId: currentIdProp,
  defaultCurrentId,
  disabled = false,
  items,
  onStepChange,
  orientation = "horizontal",
  size = "md",
  ...props
}: GridraStepperProps) {
  const enabledIds = useMemo(
    () => items.filter((item) => !item.disabled).map((item) => item.id),
    [items],
  );

  const [internalCurrentId, setInternalCurrentId] = useState(
    () => defaultCurrentId ?? "",
  );

  const rawCurrentId = currentIdProp ?? internalCurrentId;
  const fallbackId = enabledIds[0] ?? null;
  const currentId = enabledIds.includes(rawCurrentId) ? rawCurrentId : fallbackId;

  const currentIndex = currentId == null ? -1 : items.findIndex((item) => item.id === currentId);

  const handleStepClick = useCallback(
    (id: string) => {
      if (disabled) return;
      if (currentId == null) return;
      if (id === currentId) return;

      if (currentIdProp === undefined) {
        setInternalCurrentId(id);
      }

      onStepChange?.(id, currentId);
    },
    [currentId, currentIdProp, disabled, onStepChange],
  );

  const rootClassName = [
    "gridra-stepper",
    `gridra-stepper--${orientation}`,
    `gridra-stepper--${size}`,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <nav {...props} aria-label={ariaLabel} className={rootClassName}>
      <ol className="gridra-stepper__list">
        {items.map((item, index) => {
          const hasCurrent = currentIndex >= 0;
          const isBefore = hasCurrent && index < currentIndex;
          const isCurrent = hasCurrent && index === currentIndex;
          const isAfter = hasCurrent && index > currentIndex;
          const isExplicitlyDisabled = item.disabled || disabled;
          const isPending = (isAfter || !hasCurrent) && !isExplicitlyDisabled;
          const isInteractive = isBefore && !isExplicitlyDisabled;
          const isButtonDisabled = isExplicitlyDisabled || isPending || !hasCurrent;

          const itemClassName = [
            "gridra-stepper__item",
            isBefore ? "gridra-stepper__item--completed" : null,
            isCurrent ? "gridra-stepper__item--current" : null,
            isPending ? "gridra-stepper__item--pending" : null,
            isButtonDisabled ? "gridra-stepper__item--disabled" : null,
          ]
            .filter(Boolean)
            .join(" ");

          const buttonClassName = [
            "gridra-stepper__button",
            isBefore ? "gridra-stepper__button--completed" : null,
            isCurrent ? "gridra-stepper__button--current" : null,
            isPending ? "gridra-stepper__button--pending" : null,
            isButtonDisabled ? "gridra-stepper__button--disabled" : null,
          ]
            .filter(Boolean)
            .join(" ");

          return (
            <li key={item.id} className={itemClassName}>
              <button
                aria-current={isCurrent ? "step" : undefined}
                aria-disabled={isButtonDisabled || undefined}
                className={buttonClassName}
                disabled={isButtonDisabled}
                onClick={() => handleStepClick(item.id)}
                type="button"
              >
                <span className="gridra-stepper__marker">{index + 1}</span>
                <span className="gridra-stepper__content">
                  <span className="gridra-stepper__label">{item.label}</span>
                  {item.description ? (
                    <span className="gridra-stepper__description">{item.description}</span>
                  ) : null}
                </span>
              </button>
              {index < items.length - 1 ? (
                <span
                  aria-hidden="true"
                  className={[
                    "gridra-stepper__connector",
                    isBefore ? "gridra-stepper__connector--completed" : null,
                    isCurrent ? "gridra-stepper__connector--current" : null,
                    isPending ? "gridra-stepper__connector--pending" : null,
                    isButtonDisabled ? "gridra-stepper__connector--disabled" : null,
                  ]
                    .filter(Boolean)
                    .join(" ")}
                />
              ) : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
