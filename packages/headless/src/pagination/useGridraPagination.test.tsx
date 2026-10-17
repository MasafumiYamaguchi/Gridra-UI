import { act, cleanup, renderHook } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { useGridraPagination } from "../index";
afterEach(cleanup);
it("normalizes page bounds and resets the page after a size change", () => {
  const onPageChange = vi.fn();
  const {result} = renderHook(() => useGridraPagination({totalItems:100,defaultPageSize:10,onPageChange}));
  act(() => result.current.goToPage(100)); expect(result.current.currentPage).toBe(10);
  act(() => result.current.setPageSize(25)); expect(result.current.currentPage).toBe(1);
  expect(result.current.pageCount).toBe(4); expect(onPageChange).toHaveBeenLastCalledWith(1,10);
});
it("leaves controlled state to the owner and makes disabled actions inert", () => {
  const onPageChange = vi.fn();
  const {result,rerender} = renderHook(({disabled}) => useGridraPagination({page:2,totalItems:100,onPageChange,disabled}),{initialProps:{disabled:false}});
  act(() => result.current.goToPage(3)); expect(onPageChange).toHaveBeenCalledWith(3,2); expect(result.current.currentPage).toBe(2);
  rerender({disabled:true}); act(() => result.current.goToPage(4)); expect(onPageChange).toHaveBeenCalledOnce();
});
it("handles an empty dataset and non-finite values", () => {
  const {result} = renderHook(() => useGridraPagination({totalItems:NaN,page:Infinity,pageSize:0}));
  expect(result.current.currentPage).toBe(1); expect(result.current.totalItems).toBe(0);
  expect(result.current.startItem).toBe(0); expect(result.current.isLastPage).toBe(true);
});
