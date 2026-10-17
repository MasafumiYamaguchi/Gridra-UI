import { useRef } from "react";
import { useClientLayoutEffect } from "./useClientLayoutEffect";

function collectAncestors(source: HTMLElement): HTMLElement[] {
  const ancestors: HTMLElement[] = [];
  for (let element: HTMLElement | null = source; element; element = element.parentElement) ancestors.push(element);
  return ancestors;
}

interface Subscription {
  source: HTMLElement;
  observer: MutationObserver;
  refreshKey: unknown;
  flush: (records: MutationRecord[], force?: boolean) => void;
}

/**
 * 祖先の属性と移動を監視する。commit時はrefと未配信の変更だけを確認する。
 * onChangeの参照は自由に変更できる。計算条件の変更はrefreshKeyで明示する。
 */
export function useAncestorAttributes(
  resolveSource: () => HTMLElement | null,
  onChange: (source: HTMLElement) => void,
  enabled = true,
  refreshKey?: unknown,
) {
  const subscription = useRef<Subscription | null>(null);
  const callback = useRef(onChange);
  useClientLayoutEffect(() => {
    callback.current = onChange;
    const source = enabled ? resolveSource() : null;
    const previous = subscription.current;
    if (previous?.source === source) {
      const force = !Object.is(previous.refreshKey, refreshKey);
      previous.refreshKey = refreshKey;
      // Reactによるclass/style変更も、MutationObserverの配信を待たず反映する。
      previous.flush(previous.observer.takeRecords(), force);
      return;
    }
    previous?.observer.disconnect();
    subscription.current = null;
    if (!source) return;

    let ancestors = collectAncestors(source);
    const observe = () => {
      for (const ancestor of ancestors) observer.observe(ancestor, {
        attributes: true, attributeFilter: ["class", "style"], childList: true,
      });
    };
    const flush = (records: MutationRecord[], force = false) => {
      let moved = false;
      const ancestryChanged = records.some((record) => record.type === "childList" &&
        [...record.addedNodes, ...record.removedNodes].some((node) =>
          ancestors.includes(node as HTMLElement) || node.contains(source)));
      if (ancestryChanged) {
        const next = collectAncestors(source);
        moved = ancestors.length !== next.length || ancestors.some((element, index) => element !== next[index]);
        if (moved) {
          ancestors = next;
          observer.disconnect();
          observe();
        }
      }
      if (force || moved || records.some((record) => record.type === "attributes" && ancestors.includes(record.target as HTMLElement))) {
        callback.current(source);
      }
    };
    const observer = new MutationObserver((records) => flush(records));
    subscription.current = { source, observer, refreshKey, flush };
    observe();
    callback.current(source);
  });
  useClientLayoutEffect(() => () => {
    subscription.current?.observer.disconnect();
    subscription.current = null;
  }, []);
}
