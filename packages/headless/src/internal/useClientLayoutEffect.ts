/** ブラウザでは描画前の処理を使い、DOMがない環境ではuseEffectへ切り替えるヘルパー。 */
import { useEffect, useLayoutEffect } from "react";

export const useClientLayoutEffect = typeof document === "undefined" ? useEffect : useLayoutEffect;
