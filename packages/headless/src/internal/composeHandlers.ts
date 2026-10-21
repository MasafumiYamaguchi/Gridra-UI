/** 利用側とコンポーネント側のイベント処理を合成するヘルパー。 */
/** 利用側の処理を先に実行し、preventDefaultされていない場合だけ後続の処理を実行する。 */
export function composeHandlers<TEvent>(
  existing: ((event: TEvent) => void) | undefined,
  next: (event: TEvent) => void,
) {
  return (event: TEvent) => {
    existing?.(event);
    if (!(event as unknown as { defaultPrevented: boolean }).defaultPrevented) {
      next(event);
    }
  };
}
