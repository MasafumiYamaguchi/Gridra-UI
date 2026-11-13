import type { ReactElement, Ref } from "react";

/**
 * cloneElementでrefを合成するために、子要素へ渡されたrefを取り出す。
 * React 19ではrefがpropsに含まれ、React 18ではelement.refに置かれるため、propsを優先して両方を参照する。
 */
export function getChildRef<T>(child: ReactElement): Ref<T> | undefined {
  return (
    (child.props as { ref?: Ref<T> }).ref ??
    (child as ReactElement & { ref?: Ref<T> }).ref
  );
}
