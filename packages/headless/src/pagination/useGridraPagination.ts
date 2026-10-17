import { useCallback, useMemo, useState, type ChangeEvent, type HTMLAttributes } from "react";
import {
  generatePages,
  normalizePage,
  normalizePageSize,
  normalizePageSizeOptions,
  normalizeSiblingOrBoundaryCount,
  normalizeTotalItems,
} from "./paginationUtils";


export interface UseGridraPaginationOptions {
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
  disabled?: boolean;
}
const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 25;
const DEFAULT_SIBLING_COUNT = 1;
const DEFAULT_BOUNDARY_COUNT = 1;


/** ページ計算と更新規則を共有し、ナビゲーションの描画は利用側が決める。 */
export function useGridraPagination({page: pageProp, defaultPage: defaultPageProp, onPageChange, pageSize: pageSizeProp, defaultPageSize: defaultPageSizeProp, onPageSizeChange, totalItems: totalItemsRaw, pageSizeOptions: pageSizeOptionsRaw, siblingCount: siblingCountRaw, boundaryCount: boundaryCountRaw, disabled = false}: UseGridraPaginationOptions = {}) {
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

  const setPageSize = useCallback(
    (size: number) => {
      if (disabled) return;

      const nextSize = normalizePageSize(size);
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

  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * currentPageSize + 1;
  const endItem = Math.min(currentPage * currentPageSize, totalItems);

  // controlledな値が候補にない場合も、selectの現在値として表示できるよう補完する。
  const pageSizeOptionValues = pageSizeOptions.includes(currentPageSize)
    ? pageSizeOptions
    : [...pageSizeOptions, currentPageSize].sort((a, b) => a - b);


 const handlePageSizeChange = (event: ChangeEvent<HTMLSelectElement>) => setPageSize(Number(event.target.value));
 return { currentPage, currentPageSize, totalItems, pageCount, isFirstPage, isLastPage, handlePageSizeChange, setPageSize, goToPage, pages, startItem, endItem, pageSizeOptionValues };
}
