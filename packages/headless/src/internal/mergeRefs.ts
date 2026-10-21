/** 利用側のrefと内部のref更新を、一つのrefコールバックへまとめるヘルパー。 */
/** 関数ref・オブジェクトrefへ値を渡し、関数refが返すクリーンアップと内部refの解除も引き継ぐ。 */
export function mergeRefs<TValue>(
  originalRef: unknown,
  nextRef: (value: TValue | null) => void,
) {
  return (value: TValue | null) => {
    if (typeof originalRef === "function") {
      const cleanup = originalRef(value);
      if (typeof cleanup === "function") {
        nextRef(value);
        return () => { cleanup(); nextRef(null); };
      }
    } else if (originalRef && typeof originalRef === "object" && "current" in (originalRef as object)) {
      (originalRef as { current: TValue | null }).current = value;
    }
    nextRef(value);
  };
}
