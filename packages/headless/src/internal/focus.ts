export const FOCUSABLE_SELECTOR =
  'a[href]:not([tabindex="-1"]), button:not([disabled]):not([tabindex="-1"]), textarea:not([disabled]):not([tabindex="-1"]), input:not([disabled]):not([tabindex="-1"]), select:not([disabled]):not([tabindex="-1"]), [tabindex]:not([tabindex="-1"])';

export function getFocusableElements(root: ParentNode): HTMLElement[] {
  return Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));
}

/**
 * trapTabFocusが参照するキーボードイベントの最小形。
 * documentに登録するDOMのKeyboardEventと、要素のonKeyDownで受けるReactのKeyboardEventの両方を渡せるようにする。
 */
export interface TabFocusKeyboardEvent {
  key: string;
  shiftKey: boolean;
  preventDefault: () => void;
}

/**
 * Tab / Shift+Tabでのfocus移動をcontainer内で循環させ、背後のページへfocusが抜けないようにする。
 * Tab以外のキーでは何もしない。伝播の停止は呼び出し側の都合なので、ここでは行わない。
 */
export function trapTabFocus(
  container: HTMLElement,
  event: TabFocusKeyboardEvent,
): void {
  if (event.key !== "Tab") {
    return;
  }

  const focusable = getFocusableElements(container);

  // 移動先がないままブラウザ既定のTab移動を許すとcontainerの外へ出るため、移動自体を止める。
  if (focusable.length === 0) {
    event.preventDefault();

    return;
  }

  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  const active = container.ownerDocument.activeElement;
  const isOutside = !container.contains(active);

  // 端以外ではブラウザ既定の順送りに任せ、端かcontainer外にfocusがある時だけ反対端へ回す。
  if (event.shiftKey) {
    if (active === first || isOutside) {
      event.preventDefault();
      last.focus();
    }

    return;
  }

  if (active === last || isOutside) {
    event.preventDefault();
    first.focus();
  }
}
