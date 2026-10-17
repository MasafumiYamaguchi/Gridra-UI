import {cleanup,fireEvent,render,renderHook,screen} from "@testing-library/react";
import {afterEach,expect,it} from "vitest";
import {useGridraSlider} from "./useGridraSlider";
afterEach(cleanup);
function Example({value}:{value?:number}){const s=useGridraSlider({value,...(value===undefined?{defaultValue:20}:{})});return <><input {...s.inputProps}/><output>{s.displayNumericValue}</output></>}
it("updates uncontrolled display from native events",()=>{render(<Example/>);fireEvent.change(screen.getByRole("slider"),{target:{value:"40"}});expect(screen.getByText("40")).toBeTruthy();});
it("keeps controlled display and normalizes nonfinite values",()=>{render(<Example value={30}/>);fireEvent.change(screen.getByRole("slider"),{target:{value:"50"}});expect(screen.getByText("30")).toBeTruthy();const {result}=renderHook(()=>useGridraSlider({value:NaN}));expect(result.current.displayNumericValue).toBe(0);});
