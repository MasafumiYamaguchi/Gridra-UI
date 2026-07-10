import { useCallback, useMemo, useState, type ChangeEvent, type HTMLAttributes } from "react";
import { GridraSelect } from "../GridraSelect";
import {
  generatePages,
  normalizePage,
  normalizePageSize,
  normalizePageSizeOptions,
  normalizeSiblingOrBoundaryCount,
  normalizeTotalItems,
} from "./paginationUtils";

export type GridraPaginationSize = "sm" | "md" | "lg";

export interface GridraPaginationProps extends HTMLAttributes<HTMLElement> {
  page?: number;
  defaultPage?: number;
  onPageChange?: (next: number, previous: number) => void;
  pageSize?: number;
  defaultPageSize?: number;
  onPageSizeChange?: (next: number, previous: number) => void;
  totalItems?: number;
  pageSizeOptions?: number[];
  siblingCount?: number;
  boundaryCount?: number;
  size?: GridraPaginationSize;
  showFirstLast?: boolean;
  showPageSize?: boolean;
  showSummary?: boolean;
  disabled?: boolean;
}

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 25;
const DEFAULT_SIBLING_COUNT = 1;
const DEFAULT_BOUNDARY_COUNT = 1;

export function GridraPagination({
  "aria-label": ariaLabel = "Pagination",
  className,
  page: pageProp,
  defaultPage: defaultPageProp,
  onPageChange,
  pageSize: pageSizeProp,
  defaultPageSize: defaultPageSizeProp,
  onPageSizeChange,
  totalItems: totalItemsRaw,
  pageSizeOptions: pageSizeOptionsRaw,
  siblingCount: siblingCountRaw,
  boundaryCount: boundaryCountRaw,
  size = "md",
  showFirstLast = true,
  showPageSize = true,
  showSummary = true,
  disabled = false,
  ...props
}: GridraPaginationProps) {
  // 外部入力を先に正規化し、以降のページ計算を有限の正数だけで行う。
  const totalItems = normalizeTotalItems(totalItemsRaw);
  const pageSizeOptions = normalizePageSizeOptions(pageSizeOptionsRaw);
  const siblingCount = normalizeSiblingOrBoundaryCount(siblingCountRaw, DEFAULT_SIBLING_COUNT);
  const boundaryCount = normalizeSiblingOrBoundaryCount(boundaryCountRaw, DEFAULT_BOUNDARY_COUNT);

  const [uncontrolledPageSize, setUncontrolledPageSize] = useState(() =>
    normalizePageSize(defaultPageSizeProp ?? DEFAULT_PAGE_SIZE),
  );
  // propが渡された場合はcontrolled、未指定なら内部stateを現在値として使う。
  const rawPageSize = pageSizeProp ?? uncontrolledPageSize;
  const currentPageSize = normalizePageSize(rawPageSize);

  const pageCount = Math.max(1, Math.ceil(totalItems / currentPageSize));

  const [uncontrolledPage, setUncontrolledPage] = useState(() =>
    normalizePage(defaultPageProp ?? DEFAULT_PAGE, pageCount),
  );
  // 総件数やページサイズが変わった場合も、現在ページを有効範囲へ収める。
  const rawPage = pageProp ?? uncontrolledPage;
  const currentPage = normalizePage(rawPage, pageCount);

  const isFirstPage = currentPage <= 1;
  const isLastPage = currentPage >= pageCount;

  const handlePageSizeChange = useCallback(
    (event: ChangeEvent<HTMLSelectElement>) => {
      if (disabled) return;

      const nextSize = normalizePageSize(Number(event.target.value));
      if (Object.is(nextSize, currentPageSize)) return;

      if (pageSizeProp === undefined) {
        setUncontrolledPageSize(nextSize);
      }

      onPageSizeChange?.(nextSize, currentPageSize);

      // ページサイズ変更後の項目範囲を予測しやすくするため、ページは先頭へ戻す。
      if (currentPage !== 1) {
        if (pageProp === undefined) {
          setUncontrolledPage(1);
        }

        onPageChange?.(1, currentPage);
      }
    },
    [
      currentPage,
      currentPageSize,
      disabled,
      onPageChange,
      onPageSizeChange,
      pageProp,
      pageSizeProp,
    ],
  );

  const goToPage = useCallback(
    (nextPage: number) => {
      if (disabled) return;
      const next = normalizePage(nextPage, pageCount);
      if (Object.is(next, currentPage)) return;

      if (pageProp === undefined) {
        setUncontrolledPage(next);
      }

      onPageChange?.(next, currentPage);
    },
    [currentPage, disabled, onPageChange, pageCount, pageProp],
  );

  // 全ページを並べず、境界・兄弟ページとellipsisからなる表示列を生成する。
  const pages = useMemo(
    () => generatePages(currentPage, pageCount, siblingCount, boundaryCount),
    [currentPage, pageCount, siblingCount, boundaryCount],
  );

  const rootClassName = [
    "gridra-pagination",
    `gridra-pagination--${size}`,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * currentPageSize + 1;
  const endItem = Math.min(currentPage * currentPageSize, totalItems);

  // controlledな値が候補にない場合も、selectの現在値として表示できるよう補完する。
  const pageSizeOptionValues = pageSizeOptions.includes(currentPageSize)
    ? pageSizeOptions
    : [...pageSizeOptions, currentPageSize].sort((a, b) => a - b);

  return (
    <nav {...props} aria-label={ariaLabel} className={rootClassName}>
      <div className="gridra-pagination__controls">
        {showFirstLast ? (
          <button
            aria-label="First page"
            className={[
              "gridra-pagination__button",
              isFirstPage || disabled ? "gridra-pagination__button--disabled" : null,
            ]
              .filter(Boolean)
              .join(" ")}
            disabled={isFirstPage || disabled}
            onClick={() => goToPage(1)}
            type="button"
          >
            {"\u00AB"}
          </button>
        ) : null}

        <button
          aria-label="Previous page"
          className={[
            "gridra-pagination__button",
            isFirstPage || disabled ? "gridra-pagination__button--disabled" : null,
          ]
            .filter(Boolean)
            .join(" ")}
          disabled={isFirstPage || disabled}
          onClick={() => goToPage(currentPage - 1)}
          type="button"
        >
          {"\u2039"}
        </button>

        {pages.map((item, index) => {
          if (item === "ellipsis") {
            return (
              <span
                key={`ellipsis-${index}`}
                aria-hidden="true"
                className="gridra-pagination__ellipsis"
              >
                {"\u2026"}
              </span>
            );
          }

          const isCurrent = item === currentPage;

          return (
            <button
              key={item}
              aria-current={isCurrent ? "page" : undefined}
              aria-label={`Page ${item}`}
              className={[
                "gridra-pagination__button",
                isCurrent ? "gridra-pagination__button--active" : null,
                disabled ? "gridra-pagination__button--disabled" : null,
              ]
                .filter(Boolean)
                .join(" ")}
              disabled={disabled}
              onClick={() => goToPage(item)}
              type="button"
            >
              {item}
            </button>
          );
        })}

        <button
          aria-label="Next page"
          className={[
            "gridra-pagination__button",
            isLastPage || disabled ? "gridra-pagination__button--disabled" : null,
          ]
            .filter(Boolean)
            .join(" ")}
          disabled={isLastPage || disabled}
          onClick={() => goToPage(currentPage + 1)}
          type="button"
        >
          {"\u203A"}
        </button>

        {showFirstLast ? (
          <button
            aria-label="Last page"
            className={[
              "gridra-pagination__button",
              isLastPage || disabled ? "gridra-pagination__button--disabled" : null,
            ]
              .filter(Boolean)
              .join(" ")}
            disabled={isLastPage || disabled}
            onClick={() => goToPage(pageCount)}
            type="button"
          >
            {"\u00BB"}
          </button>
        ) : null}
      </div>

      {showPageSize || showSummary ? (
        <div className="gridra-pagination__info">
          {showPageSize ? (
            <div className="gridra-pagination__page-size">
              <GridraSelect
                className="gridra-pagination__select"
                disabled={disabled}
                onChange={handlePageSizeChange}
                size={size}
                value={currentPageSize}
              >
                {pageSizeOptionValues.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt} / page
                  </option>
                ))}
              </GridraSelect>
            </div>
          ) : null}

          {showSummary ? (
            <span className="gridra-pagination__summary">
              {totalItems === 0
                ? "No items"
                : `${startItem}\u2013${endItem} of ${totalItems}`}
            </span>
          ) : null}
        </div>
      ) : null}
    </nav>
  );
}
