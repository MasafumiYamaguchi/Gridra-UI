import { useMemo, useState, type CSSProperties, type HTMLAttributes, type ReactNode } from "react";

export type GridraStepperOrientation = "horizontal" | "vertical";
export type GridraStepperSize = "sm" | "md" | "lg";
export type GridraStepperVariant = "cards" | "ruler" | "line" | "boxes";

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
  variant?: GridraStepperVariant;
  disabled?: boolean;
}

function CheckMark() {
  return <svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor"
    strokeWidth="2" aria-hidden="true"><path d="m3 8 3 3 7-7" /></svg>;
}

export function GridraStepper({
  "aria-label": ariaLabel = "Progress",
  "aria-labelledby": ariaLabelledBy,
  className,
  currentId: currentIdProp,
  defaultCurrentId,
  disabled = false,
  items,
  onStepChange,
  orientation = "horizontal",
  size = "md",
  style,
  variant = "boxes",
  ...props
}: GridraStepperProps) {
  const enabledIds = useMemo(() => items.filter((item) => !item.disabled).map((item) => item.id), [items]);
  const [internalCurrentId, setInternalCurrentId] = useState(() => defaultCurrentId ?? "");
  const rawCurrentId = currentIdProp ?? internalCurrentId;
  const currentId = enabledIds.includes(rawCurrentId) ? rawCurrentId : enabledIds[0] ?? null;
  const currentIndex = currentId == null ? -1 : items.findIndex((item) => item.id === currentId);
  const positionOf = (index: number) => index < 0 || items.length < 2 ? 0 : index / (items.length - 1) * 100;
  const progress = positionOf(currentIndex);
  const steps = items.map((item, index) => {
    const locked = Boolean(item.disabled);
    const completed = currentIndex >= 0 && index < currentIndex && !locked;
    const current = index === currentIndex;
    const pending = !locked && (currentIndex < 0 || index > currentIndex);
    const buttonDisabled = disabled || locked || pending || currentIndex < 0;
    return { item, index, locked, completed, current, pending, buttonDisabled, traversed: index < currentIndex,
      canGoBack: completed && !buttonDisabled };
  });

  const handleStepClick = (id: string) => {
    if (currentId == null) return;
    if (currentIdProp === undefined) setInternalCurrentId(id);
    onStepChange?.(id, currentId);
  };

  const rootClassName = ["gridra-stepper", `gridra-stepper--${orientation}`, `gridra-stepper--${size}`,
    `gridra-stepper--${variant}`, disabled && "gridra-stepper--disabled", className].filter(Boolean).join(" ");
  const rootStyle = {
    ...style,
    "--gridra-stepper-count": Math.max(1, items.length),
    "--gridra-stepper-progress": `${progress}%`,
    "--gridra-stepper-tick-gap": `${100 / Math.max(1, (items.length - 1) * 14)}%`,
  } as CSSProperties;

  return <nav {...props} aria-label={ariaLabel} aria-labelledby={ariaLabelledBy}
    className={rootClassName} style={rootStyle}>
    <ol className="gridra-stepper__list">
      {steps.map(({ item, index, locked, completed, current, pending, buttonDisabled, canGoBack, traversed }) => {
        const stateClasses = [completed && "completed", current && "current", pending && "pending",
          locked && "locked", buttonDisabled && "disabled"].filter(Boolean);
        const itemClassName = ["gridra-stepper__item", ...stateClasses.map((state) => `gridra-stepper__item--${state}`),
          traversed && "gridra-stepper__item--traversed"].filter(Boolean).join(" ");
        const buttonClassName = ["gridra-stepper__button", ...stateClasses.map((state) => `gridra-stepper__button--${state}`)].join(" ");
        const number = String(index + 1).padStart(2, "0");

        return <li key={item.id} className={itemClassName}>
          <button type="button" aria-current={current ? "step" : undefined}
            aria-disabled={buttonDisabled || undefined} disabled={buttonDisabled}
            className={buttonClassName} onClick={canGoBack ? () => handleStepClick(item.id) : undefined}>
            {completed && <span className="gridra-stepper__sr-only">Completed: </span>}
            {locked && <span className="gridra-stepper__sr-only">Locked: </span>}
            <span className="gridra-stepper__sr-only">{index + 1} </span>
            {variant === "boxes" ? <span className="gridra-stepper__marker" aria-hidden="true">
              {completed ? <CheckMark /> : index + 1}
            </span> : <span className="gridra-stepper__meta" aria-hidden="true">
              <span className="gridra-stepper__marker">{variant === "cards" ? `STEP ${number}` : number}</span>
              <span className="gridra-stepper__status">
                {locked ? "LOCKED" : completed ? <CheckMark /> : current ? (variant === "cards" ? "ACTIVE" : "NOW") : null}
              </span>
            </span>}
            <span className="gridra-stepper__content">
              <span className="gridra-stepper__label">{item.label}</span>
              {item.description != null && item.description !== "" && typeof item.description !== "boolean" &&
                <span className="gridra-stepper__description">{item.description}</span>}
            </span>
          </button>
          {index < items.length - 1 && <span aria-hidden="true" className={["gridra-stepper__connector",
            traversed && "gridra-stepper__connector--completed",
            current && "gridra-stepper__connector--current",
            (currentIndex < 0 || index > currentIndex) && "gridra-stepper__connector--pending",
            buttonDisabled && "gridra-stepper__connector--disabled"].filter(Boolean).join(" ")} />}
        </li>;
      })}
    </ol>
    {variant === "ruler" && items.length > 0 && <>
      <div className="gridra-stepper__ruler" role="progressbar"
        aria-labelledby={ariaLabelledBy} aria-label={`${ariaLabel} step progress`}
        aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress)}
        aria-valuetext={currentIndex < 0 ? "No current step" : `Step ${currentIndex + 1} of ${items.length}`}>
        <span className="gridra-stepper__ruler-track" aria-hidden="true" />
        {steps.map(({ item, index, completed, current }) => <span key={item.id}
          className={`gridra-stepper__ruler-tick${completed || current ? " gridra-stepper__ruler-tick--completed" : ""}`} aria-hidden="true"
          style={{ [orientation === "horizontal" ? "left" : "top"]:
            `${positionOf(index)}%` }} />)}
        {currentIndex >= 0 && <span className="gridra-stepper__ruler-thumb" aria-hidden="true" />}
      </div>
      {orientation === "horizontal" && <div className="gridra-stepper__summary" aria-hidden="true">
        <span>START</span><span>{currentIndex < 0 ? "0% · NO CURRENT STEP" : `${Math.round(progress)}% · STEP ${currentIndex + 1} OF ${items.length}`}</span><span>END</span>
      </div>}
    </>}
  </nav>;
}
