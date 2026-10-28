import type { ButtonHTMLAttributes, Ref } from "react";
import { useControllableValue } from "../useControllableValue";
import { composeHandlers } from "../internal/composeHandlers";

export interface UseGridraSidebarToggleOptions {
  open?: boolean;
  defaultOpen?: boolean;
  disabled?: boolean;
  onOpenChange?: (next: boolean, previous: boolean) => void;
}

/** 開閉状態とトグルボタンの意味属性を提供する。 */
export function useGridraSidebarToggle({
  open,
  defaultOpen = false,
  disabled = false,
  onOpenChange,
}: UseGridraSidebarToggleOptions = {}) {
  const [currentOpen, setCurrentOpen] = useControllableValue(
    open,
    defaultOpen,
    onOpenChange,
  );

  const getToggleProps = (
    props: ButtonHTMLAttributes<HTMLButtonElement> & {
      ref?: Ref<HTMLButtonElement>;
    } = {},
  ) => ({
    ...props,
    type: props.type ?? ("button" as const),
    disabled: disabled || props.disabled,
    "aria-expanded": currentOpen,
    onClick: composeHandlers(props.onClick, () => {
      if (!disabled && !props.disabled) setCurrentOpen(!currentOpen);
    }),
  });

  return { currentOpen, setCurrentOpen, getToggleProps };
}
