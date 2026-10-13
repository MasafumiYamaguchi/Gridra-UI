import type { OlHTMLAttributes, ReactNode } from "react";
import { cx } from "../../internal/classNames";

export type GridraTimelineOrientation = "vertical" | "horizontal";
export type GridraTimelineSize = "sm" | "md" | "lg";

export interface GridraTimelineItem {
  id: string;
  title: ReactNode;
  description?: ReactNode;
  /** 日付の表示文言。期間や「現在」なども利用側で指定する。 */
  date?: string;
  /** time要素へ渡す機械可読な日時。表示用の日付とは別に指定する。 */
  dateTime?: string;
}

export interface GridraTimelineProps extends Omit<OlHTMLAttributes<HTMLOListElement>, "children"> {
  items: readonly GridraTimelineItem[];
  orientation?: GridraTimelineOrientation;
  size?: GridraTimelineSize;
}

export function GridraTimeline({
  className,
  items,
  orientation = "vertical",
  size = "md",
  ...props
}: GridraTimelineProps) {
  // 独自マーカーでlist-styleを消しても、リストの意味を支援技術へ伝える。
  return (
    <ol
      {...props}
      role={props.role ?? "list"}
      className={cx("gridra-timeline", `gridra-timeline--${orientation}`, `gridra-timeline--${size}`, className)}
    >
      {items.map((item, index) => {
        const date = item.date ?? item.dateTime;
        const hasDescription = item.description != null && item.description !== "" && typeof item.description !== "boolean";

        return (
          <li className="gridra-timeline__item" key={item.id}>
            <span aria-hidden="true" className="gridra-timeline__marker" />
            {index < items.length - 1 && <span aria-hidden="true" className="gridra-timeline__connector" />}
            <div className="gridra-timeline__content">
              {date && (item.dateTime
                ? <time className="gridra-timeline__date" dateTime={item.dateTime}>{date}</time>
                : <span className="gridra-timeline__date">{date}</span>)}
              <div className="gridra-timeline__title">{item.title}</div>
              {hasDescription && <div className="gridra-timeline__description">{item.description}</div>}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
