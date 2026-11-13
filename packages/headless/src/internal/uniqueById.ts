/**
 * 重複idは最初の項目だけを残す。
 * 開閉・選択状態、focus移動、ARIAの参照先が重複idで分裂しないようにするため。
 */
export function uniqueById<TItem extends { id: string }>(
  items: readonly TItem[],
): TItem[] {
  const seen = new Set<string>();

  return items.filter((item) => {
    if (seen.has(item.id)) return false;

    seen.add(item.id);

    return true;
  });
}
