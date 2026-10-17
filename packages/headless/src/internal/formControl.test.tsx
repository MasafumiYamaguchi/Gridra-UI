import {renderHook} from "@testing-library/react";
import {expect,it} from "vitest";
import {resolveAriaInvalid,useControlDescriptionIds} from "./formControl";
it("generates stable ids and optional descriptions",()=>{const {result,rerender}=renderHook(()=>useControlDescriptionIds(undefined,true));const id=result.current.controlId;rerender();expect(result.current.controlId).toBe(id);expect(result.current.descriptionId).toBe(id+"-description");});
it("preserves explicit ids and aria invalid overrides",()=>{const {result}=renderHook(()=>useControlDescriptionIds("chosen",false));expect(result.current).toEqual({controlId:"chosen",descriptionId:undefined});expect(resolveAriaInvalid(false,true)).toBe(false);expect(resolveAriaInvalid(undefined,true)).toBe(true);});
