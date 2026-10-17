export type Placement = "top" | "right" | "bottom" | "left";

export interface PositionCoords {
  top: number;
  left: number;
}

export function computeFloatingPosition(
  anchorRect: DOMRect,
  floatRect: DOMRect,
  placement: Placement,
  offset: number,
  alignment: "center" | "start" = "center",
): PositionCoords {
  if (placement === "top") {
    return {
      top: anchorRect.top - floatRect.height - offset,
      left: alignment === "start"
        ? anchorRect.left
        : anchorRect.left + (anchorRect.width - floatRect.width) / 2,
    };
  }
  if (placement === "right") {
    return {
      top: alignment === "start"
        ? anchorRect.top
        : anchorRect.top + (anchorRect.height - floatRect.height) / 2,
      left: anchorRect.right + offset,
    };
  }
  if (placement === "bottom") {
    return {
      top: anchorRect.bottom + offset,
      left: alignment === "start"
        ? anchorRect.left
        : anchorRect.left + (anchorRect.width - floatRect.width) / 2,
    };
  }
  return {
    top: alignment === "start"
      ? anchorRect.top
      : anchorRect.top + (anchorRect.height - floatRect.height) / 2,
    left: anchorRect.left - floatRect.width - offset,
  };
}

export function isOutOfViewport(
  coords: PositionCoords,
  rect: DOMRect,
): boolean {
  return (
    coords.top < 0 ||
    coords.left < 0 ||
    coords.top + rect.height > window.innerHeight ||
    coords.left + rect.width > window.innerWidth
  );
}

export function oppositePlacement(placement: Placement): Placement {
  if (placement === "top") return "bottom";
  if (placement === "bottom") return "top";
  if (placement === "left") return "right";
  return "left";
}
