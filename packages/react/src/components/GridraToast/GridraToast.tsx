import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import type { ReactNode } from "react";
import { useGridraThemeClassName } from "../../internal/themeContext";

export type GridraToastPosition = "top" | "bottom";

export interface GridraToastOptions {
  duration?: number;
  id?: string;
  role?: string;
  className?: string;
}

export interface GridraToastContextValue {
  show: (message: ReactNode, options?: GridraToastOptions) => void;
}

interface QueuedToast {
  message: ReactNode;
  // キューへ入れる時点で既定値を補い、表示処理では未定義を扱わない。
  options: Required<GridraToastOptions>;
}

const DEFAULT_DURATION = 3000;
const DEFAULT_ROLE = "status";
const EXIT_ANIMATION_DURATION = 150;

let nextId = 0;

// Provider配下の任意の子孫から、Toast表示関数だけを参照できるようにする。
const ToastContext = createContext<GridraToastContextValue | null>(null);

export function useToast(): GridraToastContextValue {
  const context = useContext(ToastContext);
  // Provider外での利用を早期に検出し、表示されないまま進む状態を防ぐ。
  if (!context) {
    throw new Error("useToast must be used within a <GridraToastProvider>");
  }
  return context;
}

export function GridraToastProvider({
  children,
  position = "bottom",
}: {
  children: ReactNode;
  position?: GridraToastPosition;
}) {
  const [currentToast, setCurrentToast] = useState<QueuedToast | null>(null);
  const [exiting, setExiting] = useState(false);
  // 待機キューとタイマーは再描画の対象ではないためrefで保持する。
  const queueRef = useRef<QueuedToast[]>([]);
  const timerRef = useRef<number | null>(null);
  const exitTimerRef = useRef<number | null>(null);
  // show内から最新の表示有無を同期的に判定するため、stateと同じ値をrefにも持つ。
  const currentRef = useRef<QueuedToast | null>(null);

  const portalThemeClassName = useGridraThemeClassName();

  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const clearExitTimer = useCallback(() => {
    if (exitTimerRef.current !== null) {
      clearTimeout(exitTimerRef.current);
      exitTimerRef.current = null;
    }
  }, []);

  const showNextToast = useCallback(() => {
    // 先頭を次の表示対象にし、残りだけを待機キューへ戻す。
    const [next, ...rest] = queueRef.current;
    queueRef.current = rest;

    setExiting(false);
    currentRef.current = next ?? null;
    setCurrentToast(next ?? null);
  }, []);

  const beginExit = useCallback(() => {
    // 表示タイマーを止め、終了アニメーション完了後に次のToastへ進む。
    clearTimer();
    clearExitTimer();
    setExiting(true);
    exitTimerRef.current = window.setTimeout(() => {
      exitTimerRef.current = null;
      showNextToast();
    }, EXIT_ANIMATION_DURATION);
  }, [clearExitTimer, clearTimer, showNextToast]);

  useEffect(() => {
    currentRef.current = currentToast;
    if (!currentToast) {
      return;
    }
    timerRef.current = window.setTimeout(() => {
      beginExit();
    }, currentToast.options.duration);
    return clearTimer;
  }, [currentToast, beginExit, clearTimer]);

  useEffect(() => {
    // Provider破棄後にタイマーがstateを更新しないよう、両方を必ず解除する。
    return () => {
      clearTimer();
      clearExitTimer();
    };
  }, [clearExitTimer, clearTimer]);

  const show = useCallback(
    (message: ReactNode, options?: GridraToastOptions) => {
      // id未指定時は、キュー内でも一意になる連番を割り当てる。
      const id = options?.id ?? String(++nextId);
      const toast: QueuedToast = {
        message,
        options: {
          duration: options?.duration ?? DEFAULT_DURATION,
          id,
          role: options?.role ?? DEFAULT_ROLE,
          className: options?.className ?? "",
        },
      };

      // 表示中でなければ即時表示し、表示中ならFIFOキューの末尾へ追加する。
      if (currentRef.current === null) {
        currentRef.current = toast;
        setCurrentToast(toast);
      } else {
        queueRef.current = [...queueRef.current, toast];
      }
    },
    [],
  );

  const viewportClassName = [
    "gridra-portal-root",
    "gridra-toast__portal",
    portalThemeClassName,
    "gridra-toast__viewport",
    position === "top" && "gridra-toast__viewport--top",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      {/* アプリのレイアウトに影響させないため、表示中のToastだけをbody直下へPortalする。 */}
      {currentToast &&
        createPortal(
          <div className={viewportClassName}>
            <div
              className={[
                "gridra-toast",
                exiting && "gridra-toast--exiting",
                currentToast.options.className,
              ]
                .filter(Boolean)
                .join(" ")}
              role={currentToast.options.role}
            >
              {currentToast.message}
            </div>
          </div>,
          document.body,
        )}
    </ToastContext.Provider>
  );
}
