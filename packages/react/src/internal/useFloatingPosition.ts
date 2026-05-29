import { useEffect, useLayoutEffect, useState, type RefObject } from "react";
import {
  computeFloatingPosition,
  isOutOfViewport,
  oppositePlacement,
  type Placement,
  type PositionCoords,
} from "./floating";

export interface UseFloatingPositionOptions<TPlacement extends Placement> {
  open: boolean;
  disabled?: boolean;
  placement: TPlacement;
  offset: number;
  alignment?: "center" | "start";
  anchorRef: RefObject<HTMLElement | null>;
  floatingRef: RefObject<HTMLElement | null>;
  updateDeps?: readonly unknown[];
}

export interface UseFloatingPositionResult<TPlacement extends Placement> {
  resolvedPlacement: TPlacement;
  coords: PositionCoords;
}

const HIDDEN_COORDS: PositionCoords = { top: -9999, left: -9999 };

export function useFloatingPosition<TPlacement extends Placement>({
  alignment = "center",
  anchorRef,
  disabled = false,
  floatingRef,
  offset,
  open,
  placement,
  updateDeps = [],
}: UseFloatingPositionOptions<TPlacement>): UseFloatingPositionResult<TPlacement> {
  const [resolvedPlacement, setResolvedPlacement] = useState<TPlacement>(placement);
  const [coords, setCoords] = useState(HIDDEN_COORDS);

  useEffect(() => {
    setResolvedPlacement(placement);
  }, [placement]);

  useLayoutEffect(() => {
    if (!open || disabled) {
      return;
    }

    const updatePosition = () => {
      const anchor = anchorRef.current;
      const floating = floatingRef.current;
      if (!anchor || !floating) {
        return;
      }

      const anchorRect = anchor.getBoundingClientRect();
      const floatingRect = floating.getBoundingClientRect();
      const initial = computeFloatingPosition(
        anchorRect,
        floatingRect,
        placement,
        offset,
        alignment,
      );
      let nextPlacement = placement;
      let nextCoords = initial;

      if (isOutOfViewport(initial, floatingRect)) {
        nextPlacement = oppositePlacement(placement) as TPlacement;
        nextCoords = computeFloatingPosition(
          anchorRect,
          floatingRect,
          nextPlacement,
          offset,
          alignment,
        );
      }

      setResolvedPlacement(nextPlacement);
      setCoords(nextCoords);
    };

    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);
    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [alignment, anchorRef, disabled, floatingRef, offset, open, placement, ...updateDeps]);

  return { resolvedPlacement, coords };
}
