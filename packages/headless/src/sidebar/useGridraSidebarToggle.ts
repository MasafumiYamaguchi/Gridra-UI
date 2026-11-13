import type { ButtonHTMLAttributes, Ref } from "react";
import { useControllableValue } from "../useControllableValue";
import { composeHandlers } from "../internal/composeHandlers";

export interface UseGridraSidebarToggleOptions {
  open?: boolean;
  defaultOpen?: boolean;
  disabled?: boolean;
  onOpenChange?: (next: boolean, previous: boolean) => void;
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  ref?: Ref<HTMLButtonElement>;
};

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

  const getToggleProps = (props: ButtonProps = {}) => {
    const isDisabled = disabled || props.disabled;

    return {
      ...props,
      type: props.type ?? ("button" as const),
      disabled: isDisabled,
      "aria-expanded": currentOpen,
      onClick: composeHandlers(props.onClick, () => {
        if (!isDisabled) setCurrentOpen(!currentOpen);
      }),
    };
  };

  return { currentOpen, setCurrentOpen, getToggleProps };
}
