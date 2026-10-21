/** コンポーネントの有効期間に合わせてdocumentのイベント購読を管理するヘルパー。 */
import { useEffect } from "react";

/** activeの間だけリスナーを登録し、依存値の変更時やアンマウント時に解除する。 */
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
