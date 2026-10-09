import { cx } from "../../internal/classNames";
import { GridraBadge, type GridraBadgeProps, type GridraBadgeSize, type GridraBadgeTone } from "../GridraBadge";

/** @deprecated Use GridraBadgeSize. */
export type GridraTagSize = GridraBadgeSize;
/** @deprecated Use GridraBadgeTone. */
export type GridraTagTone = GridraBadgeTone;

/** @deprecated Use GridraBadgeProps with variant="outline". */
export type GridraTagProps = Omit<GridraBadgeProps, "shape" | "variant">;

/** @deprecated Use GridraBadge with variant="outline". */
export function GridraTag({
  className,
  size = "md",
  tone = "default",
  ...props
}: GridraTagProps) {
  // Tagは状態を持たず、sizeとtoneを見た目のmodifierへ変換する表示用要素。
  const rootClassName = cx(
    "gridra-tag",
    `gridra-tag--${size}`,
    `gridra-tag--${tone}`,
    className,
  );

  return <GridraBadge className={rootClassName} size={size} tone={tone} variant="outline" {...props} />;
}
