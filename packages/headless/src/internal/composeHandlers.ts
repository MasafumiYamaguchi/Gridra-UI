export function composeHandlers<TEvent>(
  existing: ((event: TEvent) => void) | undefined,
  next: (event: TEvent) => void,
) {
  return (event: TEvent) => {
    existing?.(event);
    if (!(event as unknown as { defaultPrevented: boolean }).defaultPrevented) {
      next(event);
    }
  };
}
