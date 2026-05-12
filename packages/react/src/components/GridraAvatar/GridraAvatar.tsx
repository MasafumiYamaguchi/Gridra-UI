import type { HTMLAttributes } from "react";

export interface GridraAvatarProps extends HTMLAttributes<HTMLSpanElement> {
  alt?: string;
  fallback?: string;
  src?: string;
}

export function GridraAvatar({
  alt = "",
  className,
  fallback,
  src,
  ...props
}: GridraAvatarProps) {
  const avatarClassName = ["gridra-avatar", className].filter(Boolean).join(" ");

  return (
    <span className={avatarClassName} {...props}>
      {src ? (
        <img alt={alt} className="gridra-avatar__image" src={src} />
      ) : (
        <span className="gridra-avatar__fallback" aria-hidden={alt ? undefined : true}>
          {fallback ?? alt.slice(0, 2)}
        </span>
      )}
    </span>
  );
}
