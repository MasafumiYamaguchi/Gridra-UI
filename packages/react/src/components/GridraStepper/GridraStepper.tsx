import { useId, useMemo, useState, type CSSProperties, type HTMLAttributes, type ReactNode } from "react";

export type GridraStepperOrientation = "horizontal" | "vertical";
export type GridraStepperSize = "sm" | "md" | "lg";
export type GridraStepperVariant = "cards" | "ruler" | "line" | "boxes";

export interface GridraStepperLabels {
  navigation: string;
  progress: string;
  completed: string;
  locked: string;
  lockedStatus: string;
  step: string;
  active: string;
  now: string;
  start: string;
  end: string;
  noCurrentStep: string;
  position: (step: number, total: number) => string;
  summary: (percentage: number, position: string) => string;
}

const defaultLabels: GridraStepperLabels = {
  navigation: "Progress", progress: "step progress", completed: "Completed:", locked: "Locked:", lockedStatus: "LOCKED",
  step: "STEP", active: "ACTIVE", now: "NOW", start: "START", end: "END", noCurrentStep: "No current step",
  position: (step, total) => `Step ${step} of ${total}`,
  summary: (percentage, position) => `${percentage}% · ${position.toUpperCase()}`,
};

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
  labels?: Partial<GridraStepperLabels>;
}

function CheckMark() {
  return <svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor"
    strokeWidth="2" aria-hidden="true"><path d="m3 8 3 3 7-7" /></svg>;
}

export function GridraStepper({
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  className,
  currentId: currentIdProp,
  defaultCurrentId,
  disabled = false,
  items,
  labels,
  onStepChange,
  orientation = "horizontal",
  size = "md",
  style,
  variant = "boxes",
  ...props
}: GridraStepperProps) {
  const text = { ...defaultLabels, ...labels };
  const navLabel = ariaLabel ?? text.navigation;
  const progressLabelId = useId();
  const enabledIds = useMemo(() => items.filter((item) => !item.disabled).map((item) => item.id), [items]);
  const [internalCurrentId, setInternalCurrentId] = useState(() => defaultCurrentId ?? "");
  const rawCurrentId = currentIdProp ?? internalCurrentId;
  const currentId = enabledIds.includes(rawCurrentId) ? rawCurrentId : enabledIds[0] ?? null;
  const currentIndex = currentId == null ? -1 : items.findIndex((item) => item.id === currentId);
  const positionOf = (index: number) => index < 0 ? 0 : items.length === 1 ? 100 : index / (items.length - 1) * 100;
  const progress = positionOf(currentIndex);
  const positionText = currentIndex < 0 ? text.noCurrentStep : text.position(currentIndex + 1, items.length);
  const steps = items.map((item, index) => {
    const locked = Boolean(item.disabled);
    const completed = currentIndex >= 0 && index < currentIndex && !locked;
    const current = index === currentIndex;
    const pending = !locked && (currentIndex < 0 || index > currentIndex);
    const buttonDisabled = disabled || locked || pending || currentIndex < 0;
    const traversed = index < currentIndex;
    const connectorState = traversed ? "completed" : current ? "current" : pending ? "pending" : "locked";
    return { item, index, locked, completed, current, pending, buttonDisabled, traversed, connectorState,
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

  return <nav {...props} aria-label={navLabel} aria-labelledby={ariaLabelledBy}
    className={rootClassName} style={rootStyle}>
    <ol className="gridra-stepper__list">
      {steps.map(({ item, index, locked, completed, current, pending, buttonDisabled, canGoBack, traversed, connectorState }) => {
        const stateClasses = [completed && "completed", current && "current", pending && "pending",
          locked && "locked", buttonDisabled && "disabled"].filter(Boolean);
        const itemClassName = ["gridra-stepper__item", ...stateClasses.map((state) => `gridra-stepper__item--${state}`),
          traversed && "gridra-stepper__item--traversed"].filter(Boolean).join(" ");
        const buttonClassName = ["gridra-stepper__button", ...stateClasses.map((state) => `gridra-stepper__button--${state}`)].join(" ");
        const number = String(index + 1).padStart(2, "0");

        return <li key={item.id} className={itemClassName}>
          <button type="button" aria-current={current ? "step" : undefined}
            aria-disabled={buttonDisabled || undefined}
            className={buttonClassName} onClick={canGoBack ? () => handleStepClick(item.id) : undefined}>
            {completed && <span className="gridra-stepper__sr-only">{text.completed} </span>}
            {locked && <span className="gridra-stepper__sr-only">{text.locked} </span>}
            <span className="gridra-stepper__sr-only">{index + 1} </span>
            {variant === "boxes" ? <span className="gridra-stepper__marker" aria-hidden="true">
              {completed ? <CheckMark /> : index + 1}
            </span> : <span className="gridra-stepper__meta" aria-hidden="true">
              <span className="gridra-stepper__marker">{variant === "cards" ? `${text.step} ${number}` : number}</span>
              <span className="gridra-stepper__status">
                {locked ? text.lockedStatus : completed ? <CheckMark /> : current ? (variant === "cards" ? text.active : text.now) : null}
              </span>
            </span>}
            <span className="gridra-stepper__content">
              <span className="gridra-stepper__label">{item.label}</span>
              {item.description != null && item.description !== "" && typeof item.description !== "boolean" &&
                <span className="gridra-stepper__description">{item.description}</span>}
            </span>
          </button>
          {index < items.length - 1 && <span aria-hidden="true" className={["gridra-stepper__connector",
            `gridra-stepper__connector--${connectorState}`,
            buttonDisabled && "gridra-stepper__connector--disabled"].filter(Boolean).join(" ")} />}
        </li>;
      })}
    </ol>
    {variant === "ruler" && items.length > 0 && <>
      <span id={progressLabelId} hidden>{text.progress}</span>
      <div className="gridra-stepper__ruler" role="progressbar"
        aria-labelledby={ariaLabelledBy ? `${ariaLabelledBy} ${progressLabelId}` : undefined}
        aria-label={`${navLabel} ${text.progress}`}
        aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress)}
        aria-valuetext={positionText}>
        <span className="gridra-stepper__ruler-track" aria-hidden="true" />
        {steps.map(({ item, index, traversed, current }) => <span key={item.id}
          className={`gridra-stepper__ruler-tick${traversed || current ? " gridra-stepper__ruler-tick--reached" : ""}`} aria-hidden="true"
          style={{ [orientation === "horizontal" ? "left" : "top"]:
            `${positionOf(index)}%` }} />)}
        {currentIndex >= 0 && <span className="gridra-stepper__ruler-thumb" aria-hidden="true" />}
      </div>
      {orientation === "horizontal" && <div className="gridra-stepper__summary" aria-hidden="true">
        <span>{text.start}</span><span>{text.summary(Math.round(progress), positionText)}</span><span>{text.end}</span>
      </div>}
    </>}
  </nav>;
}
