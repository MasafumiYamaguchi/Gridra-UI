// 計算ロジックとテストは core にある。react が core を直接参照せず headless 経由で使えるよう、窓口として再エクスポートする。
export {
  getGridraMinimap,
  type GridraMinimapOptions,
  type GridraMinimapNode,
  type GridraMinimapPlacement,
  type GridraMinimapViewport,
} from "@gridra-ui/core";
