import { useEffect, useLayoutEffect } from "react";

export const useClientLayoutEffect = typeof document === "undefined" ? useEffect : useLayoutEffect;
