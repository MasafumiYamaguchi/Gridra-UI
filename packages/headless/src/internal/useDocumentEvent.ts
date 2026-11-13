import { useEffect } from "react";

/**
 * `active` が true の間だけ `document` にイベントリスナーを登録する。
 * 開いている間だけEscapeや外側クリックを監視するoverlay向けのhook。
 * `handler` と `options` は依存配列に含まれるため、再登録を避けたい場合は `useCallback` などで参照を安定させる。
 */
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
