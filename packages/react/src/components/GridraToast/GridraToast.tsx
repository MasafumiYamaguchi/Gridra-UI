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
  options: Required<GridraToastOptions>;
}

const DEFAULT_DURATION = 3000;
const DEFAULT_ROLE = "status";

let nextId = 0;

const ToastContext = createContext<GridraToastContextValue | null>(null);

export function useToast(): GridraToastContextValue {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a <GridraToastProvider>");
  }
  return context;
}

function getGridraThemeClassName(): string | undefined {
  if (typeof document === "undefined") {
    return undefined;
  }

  const themeHost = document.querySelector(
    ".gridra-theme-dark, .gridra-theme-light",
  );
  return Array.from(themeHost?.classList ?? []).find(
    (className) =>
      className === "gridra-theme-dark" || className === "gridra-theme-light",
  );
}

export function GridraToastProvider({ children }: { children: ReactNode }) {
  const [currentToast, setCurrentToast] = useState<QueuedToast | null>(null);
  const [exiting, setExiting] = useState(false);
  const queueRef = useRef<QueuedToast[]>([]);
  const timerRef = useRef<number | null>(null);
  const currentRef = useRef<QueuedToast | null>(null);

  const [portalThemeClassName, setPortalThemeClassName] = useState<
    string | undefined
  >(() => getGridraThemeClassName());

  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const processQueue = useCallback(() => {
    clearTimer();
    if (queueRef.current.length === 0) {
      setExiting(true);
      window.setTimeout(() => {
        setExiting(false);
        setCurrentToast(null);
        currentRef.current = null;
      }, 150);
      return;
    }
    const [next, ...rest] = queueRef.current;
    queueRef.current = rest;
    currentRef.current = next;
    setCurrentToast(next);
  }, [clearTimer]);

  useEffect(() => {
    currentRef.current = currentToast;
    if (!currentToast) {
      return;
    }
    setPortalThemeClassName(getGridraThemeClassName());
    timerRef.current = window.setTimeout(() => {
      processQueue();
    }, currentToast.options.duration);
    return clearTimer;
  }, [currentToast, processQueue, clearTimer]);

  useEffect(() => {
    return () => clearTimer();
  }, [clearTimer]);

  const show = useCallback(
    (message: ReactNode, options?: GridraToastOptions) => {
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
    "gridra-toast__portal",
    portalThemeClassName,
    "gridra-toast__viewport",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
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
