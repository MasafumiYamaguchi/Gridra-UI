import { useCallback, useMemo, useState, type CSSProperties, type HTMLAttributes, type ReactNode } from "react";

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
  const progress = currentIndex < 0 ? 0 : items.length === 1 ? 100 : currentIndex / (items.length - 1) * 100;
  const rulerPosition = orientation === "vertical" && currentIndex >= 0
    ? (currentIndex + 0.5) / items.length * 100 : progress;

  const handleStepClick = useCallback((id: string) => {
    if (disabled || currentId == null || !enabledIds.includes(id)) return;
    const index = items.findIndex((item) => item.id === id);
    if (index < 0 || index >= currentIndex) return;
    if (currentIdProp === undefined) setInternalCurrentId(id);
    onStepChange?.(id, currentId);
  }, [currentId, currentIdProp, currentIndex, disabled, enabledIds, items, onStepChange]);

  const rootClassName = ["gridra-stepper", `gridra-stepper--${orientation}`, `gridra-stepper--${size}`,
    `gridra-stepper--${variant}`, disabled && "gridra-stepper--disabled", className].filter(Boolean).join(" ");
  const rootStyle = {
    ...style,
    "--gridra-stepper-count": Math.max(1, items.length),
    "--gridra-stepper-progress": `${rulerPosition}%`,
    "--gridra-stepper-tick-gap": `${100 / Math.max(1, (items.length - 1) * 14)}%`,
  } as CSSProperties;

  return <nav {...props} aria-label={ariaLabel} className={rootClassName} style={rootStyle}>
    <ol className="gridra-stepper__list">
      {items.map((item, index) => {
        const locked = Boolean(item.disabled);
        const completed = currentIndex >= 0 && index < currentIndex && !locked;
        const current = index === currentIndex;
        const pending = !locked && (currentIndex < 0 || index > currentIndex);
        const buttonDisabled = disabled || locked || pending || currentIndex < 0;
        const stateClasses = [completed && "completed", current && "current", pending && "pending",
          locked && "locked", buttonDisabled && "disabled"].filter(Boolean);
        const itemClassName = ["gridra-stepper__item", ...stateClasses.map((state) => `gridra-stepper__item--${state}`)].join(" ");
        const buttonClassName = ["gridra-stepper__button", ...stateClasses.map((state) => `gridra-stepper__button--${state}`)].join(" ");
        const number = String(index + 1).padStart(2, "0");

        return <li key={item.id} className={itemClassName}>
          <button type="button" aria-current={current ? "step" : undefined}
            aria-disabled={buttonDisabled || undefined} disabled={buttonDisabled}
            className={buttonClassName} onClick={() => handleStepClick(item.id)}>
            {completed && <span className="gridra-stepper__sr-only">Completed: </span>}
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
              {item.description != null && <span className="gridra-stepper__description">{item.description}</span>}
            </span>
          </button>
          {index < items.length - 1 && <span aria-hidden="true" className={["gridra-stepper__connector",
            ...stateClasses.map((state) => `gridra-stepper__connector--${state}`)].join(" ")} />}
        </li>;
      })}
    </ol>
    {variant === "ruler" && items.length > 0 && <>
      <div className="gridra-stepper__ruler" role="progressbar" aria-label="Step progress"
        aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress)}
        aria-valuetext={currentIndex < 0 ? "No current step" : `Step ${currentIndex + 1} of ${items.length}`}>
        <span className="gridra-stepper__ruler-track" aria-hidden="true" />
        {orientation === "horizontal" && items.map((item, index) => <span key={item.id}
          className={`gridra-stepper__ruler-tick${currentIndex >= 0 && index <= currentIndex ? " gridra-stepper__ruler-tick--completed" : ""}`} aria-hidden="true"
          style={{ left: `${items.length === 1 ? 100 : index / (items.length - 1) * 100}%` }} />)}
        {currentIndex >= 0 && <span className="gridra-stepper__ruler-thumb" aria-hidden="true" />}
      </div>
      {orientation === "horizontal" && <div className="gridra-stepper__summary" aria-hidden="true">
        <span>START</span><span>{currentIndex < 0 ? "0% · NO CURRENT STEP" : `${Math.round(progress)}% · STEP ${currentIndex + 1} OF ${items.length}`}</span><span>END</span>
      </div>}
    </>}
  </nav>;
}
