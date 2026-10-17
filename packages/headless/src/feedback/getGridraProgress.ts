import type {HTMLAttributes} from "react";
import {clampNumber} from "@gridra-ui/core";
export interface GridraProgressOptions {value?:number;max?:number;label?:string}
function normalizeMax(max: number): number {
  return Number.isFinite(max) && max > 0 ? max : 100;
}

function normalizeValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}


/** 進捗の正規化とアクセシビリティ属性を返す。 */
export function getGridraProgress({value,max=100,label}:GridraProgressOptions={}){
  // value未指定は、完了量を特定できないindeterminate表示として扱う。
  const isIndeterminate = value === undefined;
  const normalizedMax = normalizeMax(max);
  const normalizedValue = isIndeterminate ? 0 : normalizeValue(value);
  const clampedValue = isIndeterminate
    ? 0
    : clampNumber(normalizedValue, 0, normalizedMax);
  const fraction = isIndeterminate ? 0 : clampedValue / normalizedMax;
  // 確定値がある場合だけ、maxに対する割合を表示幅へ変換する。
  const percent = fraction * 100;


return {isIndeterminate,normalizedMax,clampedValue,fraction,percent,rootProps:{role:"progressbar","aria-label":label||undefined,"aria-valuemax":isIndeterminate?undefined:normalizedMax,"aria-valuemin":isIndeterminate?undefined:0,"aria-valuenow":isIndeterminate?undefined:clampedValue} satisfies HTMLAttributes<HTMLElement>};
}
