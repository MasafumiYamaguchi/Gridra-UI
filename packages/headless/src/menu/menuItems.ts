import type { ReactNode } from "react";

/* DropdownMenuとContextMenuが共有するitem定義。どちらのhookからも参照するため、特定のhookのファイルに置かない。 */

export type GridraDropdownMenuCommandItem = {
  id: string;
  label: ReactNode;
  disabled?: boolean;
  destructive?: boolean;
};

// separatorは操作対象ではないため、idなしでも描画できる。
export type GridraDropdownMenuSeparatorItem = {
  type: "separator";
  id?: string;
};

export type GridraDropdownMenuItem =
  GridraDropdownMenuCommandItem | GridraDropdownMenuSeparatorItem;

/**
 * separator以外の実行できるitemかを判定する。
 * 描画時にseparatorとcommandを分岐させるため、hookの返り値ではなく純関数として公開する。
 */
export function isCommand<TItem extends object>(
  item: TItem,
): item is Exclude<TItem, { type: "separator" }> {
  return !("type" in item) || item.type !== "separator";
}
