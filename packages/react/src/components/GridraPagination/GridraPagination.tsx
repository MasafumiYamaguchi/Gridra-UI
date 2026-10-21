import type { HTMLAttributes } from "react";
import { useGridraPagination } from "@gridra-ui/headless";
import { GridraSelect } from "../GridraSelect";

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
  const {
    currentPage,
    currentPageSize,
    totalItems,
    pageCount,
    isFirstPage,
    isLastPage,
    handlePageSizeChange,
    goToPage,
    pages,
    startItem,
    endItem,
    pageSizeOptionValues,
  } = useGridraPagination({
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
    disabled,
  });
  const rootClassName = [
    "gridra-pagination",
    `gridra-pagination--${size}`,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <nav {...props} aria-label={ariaLabel} className={rootClassName}>
      <div className="gridra-pagination__controls">
        {showFirstLast ? (
          <button
            aria-label="First page"
            className={[
              "gridra-pagination__button",
              isFirstPage || disabled
                ? "gridra-pagination__button--disabled"
                : null,
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
            isFirstPage || disabled
              ? "gridra-pagination__button--disabled"
              : null,
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
            isLastPage || disabled
              ? "gridra-pagination__button--disabled"
              : null,
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
              isLastPage || disabled
                ? "gridra-pagination__button--disabled"
                : null,
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
