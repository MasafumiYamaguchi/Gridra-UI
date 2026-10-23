import { getGridraAvatar } from "@gridra-ui/headless";
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
    typeof size === "string" && isPresetSize(size)
      ? `gridra-avatar--${size}`
      : null,
    monochrome ? "gridra-avatar--monochrome" : null,
    className,
  );
  const avatarStyle = {
    ...style,
    ...getCustomSizeStyle(size),
  } as CSSProperties;
  // 画像がない場合だけfallback側にアクセシブル名を付与し、imgのaltと名前が二重にならないようにする。
  const avatar = getGridraAvatar({ src, alt, fallback });

  return (
    <span
      className={avatarClassName}
      style={avatarStyle}
      {...avatar.rootProps}
      {...props}
    >
      {avatar.hasImage ? (
        <img {...avatar.imageProps} className="gridra-avatar__image" />
      ) : (
        <span className="gridra-avatar__fallback" {...avatar.fallbackProps}>
          {avatar.fallbackText}
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
    "--gridra-avatar-size": normalizedSize,
  } as CSSProperties;
}
