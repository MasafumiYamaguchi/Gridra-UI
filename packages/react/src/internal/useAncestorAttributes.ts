import { useRef, useState } from "react";
import { useClientLayoutEffect } from "./useClientLayoutEffect";

function attributeSignature(elements: HTMLElement[]): string {
  return JSON.stringify(elements.map((element) => [element.getAttribute("class"), element.getAttribute("style")]));
}

/** refと祖先の変更はcommit後に確認し、属性が変わったときだけ利用側を更新する。 */
export function useAncestorAttributes(resolveSource: () => HTMLElement | null, onChange: (source: HTMLElement) => void, enabled = true) {
  const [ancestors, setAncestors] = useState<HTMLElement[]>([]);
  const observedAttributes = useRef("");
  const refresh = useRef<(() => void) | null>(null);
  useClientLayoutEffect(() => {
    const next: HTMLElement[] = [];
    if (enabled) {
      for (let source = resolveSource(); source; source = source.parentElement) next.push(source);
    }
    if (ancestors.length !== next.length || ancestors.some((element, index) => element !== next[index])) setAncestors(next);
    else if (enabled && attributeSignature(next) !== observedAttributes.current) refresh.current?.();
  });
  useClientLayoutEffect(() => {
    const source = ancestors[0];
    if (!enabled || !source) return;
    const update = () => {
      observedAttributes.current = attributeSignature(ancestors);
      onChange(source);
    };
    const refreshIfChanged = () => {
      if (attributeSignature(ancestors) !== observedAttributes.current) update();
    };
    refresh.current = refreshIfChanged;
    update();
    const observer = new MutationObserver(refreshIfChanged);
    for (const ancestor of ancestors) observer.observe(ancestor, { attributes: true, attributeFilter: ["class", "style"] });
    return () => { observer.disconnect(); refresh.current = null; };
  }, [ancestors, enabled, onChange]);
}
