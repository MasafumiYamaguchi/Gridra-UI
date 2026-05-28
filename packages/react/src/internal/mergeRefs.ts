export function mergeRefs<TValue>(
  originalRef: unknown,
  nextRef: (value: TValue | null) => void,
) {
  return (value: TValue | null) => {
    if (typeof originalRef === "function") {
      originalRef(value);
    } else if (originalRef && typeof originalRef === "object" && "current" in (originalRef as object)) {
      (originalRef as { current: TValue | null }).current = value;
    }
    nextRef(value);
  };
}
