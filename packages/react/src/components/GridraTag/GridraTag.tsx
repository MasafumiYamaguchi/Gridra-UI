import { cx } from "../../internal/classNames";
import { GridraBadge, type GridraBadgeProps, type GridraBadgeSize, type GridraBadgeTone } from "../GridraBadge";

/** @deprecated GridraBadgeSizeを使用してください。 */
export type GridraTagSize = GridraBadgeSize;
/** @deprecated GridraBadgeToneを使用してください。 */
export type GridraTagTone = GridraBadgeTone;

/** @deprecated GridraBadgePropsを使用し、variant="outline"を指定してください。 */
export type GridraTagProps = Omit<GridraBadgeProps, "shape" | "variant">;

/** @deprecated GridraBadgeにvariant="outline"を指定して使用してください。 */
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
