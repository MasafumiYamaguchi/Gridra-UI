import { GridraSidebarToggle } from "@gridra-ui/react";
import { useEffect, useRef, useState, type ReactNode, type RefObject } from "react";

// styles.css のモバイル境界と揃える。
export const MOBILE_DOCS_QUERY = "(max-width: 760px)";

export function useMobileDocs() {
  const [mobile, setMobile] = useState(() => window.matchMedia?.(MOBILE_DOCS_QUERY).matches ?? false);
  useEffect(() => {
    const media = window.matchMedia?.(MOBILE_DOCS_QUERY);
    if (!media) return;
    const update = () => setMobile(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);
  return mobile;
}

export function MobileNavigation({ children, open, onDismiss, returnFocusRef, fallbackFocusRef, initialFocusRef, search }: {
  children: ReactNode;
  open: boolean;
  onDismiss: () => void;
  returnFocusRef: RefObject<HTMLElement | null>;
  fallbackFocusRef: RefObject<HTMLElement | null>;
  initialFocusRef?: RefObject<HTMLElement | null>;
  search: ReactNode;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    if (!open) return;
    const dialog = dialogRef.current!;
    const previousOverflow = document.body.style.overflow;
    dialog.showModal();
    initialFocusRef?.current?.focus();
    document.body.style.overflow = "hidden";
    return () => {
      dialog.close();
      document.body.style.overflow = previousOverflow;
      // 遷移時は本文、それ以外は開いたボタンへ操作の文脈を戻す。
      const target = returnFocusRef.current?.isConnected ? returnFocusRef.current : fallbackFocusRef.current;
      target?.focus({ preventScroll: true });
    };
  }, [open, returnFocusRef, fallbackFocusRef, initialFocusRef]);

  return <dialog ref={dialogRef} id="docs-mobile-navigation" className="docs-drawer"
    aria-label="Documentation navigation" onKeyDown={(event) => {
      if (event.key !== "Tab" || event.defaultPrevented) return;
      // Native dialogの背景分離に加え、Tabの端ではブラウザUIへ抜けず循環する。
      const focusable = Array.from(event.currentTarget.querySelectorAll<HTMLElement>(
        'button, input, select, textarea, a[href], [tabindex]',
      )).filter((element) => element.tabIndex >= 0 && !element.matches(":disabled") && element.getClientRects().length > 0);
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    }} onCancel={(event) => {
      event.preventDefault();
      onDismiss();
    }} onClick={(event) => {
      if (event.target === event.currentTarget) onDismiss();
    }}>
    <div className="docs-drawer__panel">
      <div className="docs-drawer__header">
        <span className="docs-eyebrow">Documentation</span>
        <GridraSidebarToggle open aria-label="Close navigation" onOpenChange={onDismiss} />
      </div>
      {search}
      {children}
    </div>
  </dialog>;
}
