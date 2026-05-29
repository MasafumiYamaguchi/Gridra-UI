import { useEffect } from "react";

export function useDocumentEvent<K extends keyof DocumentEventMap>(
  type: K,
  handler: (event: DocumentEventMap[K]) => void,
  active: boolean,
  options?: boolean | AddEventListenerOptions,
) {
  useEffect(() => {
    if (!active) {
      return;
    }

    document.addEventListener(type, handler as EventListener, options);
    return () => {
      document.removeEventListener(type, handler as EventListener, options);
    };
  }, [active, handler, options, type]);
}
