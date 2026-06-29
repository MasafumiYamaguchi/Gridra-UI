import type { CSSProperties, HTMLAttributes } from "react";
import { cx } from "../../internal/classNames";

export type GridraAvatarSize = "sm" | "md" | "lg" | number | string;
export type GridraAvatarShape = "square" | "rounded" | "circle";

export interface GridraAvatarProps extends HTMLAttributes<HTMLSpanElement> {
  alt?: string;
  fallback?: string;
  monochrome?: boolean;
  shape?: GridraAvatarShape;
  src?: string;
  size?: GridraAvatarSize;
}

export function GridraAvatar({
  alt = "",
  className,
  fallback,
  monochrome = false,
  shape = "square",
  size = "md",
  src,
  style,
  ...props
}: GridraAvatarProps) {
  const avatarClassName = cx(
    "gridra-avatar",
    `gridra-avatar--${shape}`,
    typeof size === "string" && isPresetSize(size) ? `gridra-avatar--${size}` : null,
    monochrome ? "gridra-avatar--monochrome" : null,
    className,
  );
  const avatarStyle = {
    ...style,
    ...getCustomSizeStyle(size)
  } as CSSProperties;
  // 画像がない場合だけfallback側にアクセシブル名を付与し、imgのaltと名前が二重にならないようにする。
  const fallbackAccessibleName = !src ? (alt || fallback || undefined) : undefined;

  return (
    <span
      className={avatarClassName}
      style={avatarStyle}
      role={fallbackAccessibleName ? "img" : undefined}
      aria-label={fallbackAccessibleName}
      {...props}
    >
      {src ? (
        <img alt={alt} className="gridra-avatar__image" src={src} />
      ) : (
        <span className="gridra-avatar__fallback" aria-hidden="true">
          {fallback ?? alt.slice(0, 2)}
        </span>
      )}
    </span>
  );
}

function isPresetSize(size: string): size is "sm" | "md" | "lg" {
  return size === "sm" || size === "md" || size === "lg";
}

// プリセット以外のサイズはCSS変数に逃がし、classの組み合わせ数を増やさない。
function getCustomSizeStyle(size: GridraAvatarSize): CSSProperties | undefined {
  if (typeof size === "string" && isPresetSize(size)) {
    return undefined;
  }

  const normalizedSize = typeof size === "number" ? `${size}px` : size;

  return {
    "--gridra-avatar-size": normalizedSize
  } as CSSProperties;
}
