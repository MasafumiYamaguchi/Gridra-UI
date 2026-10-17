import {cleanup,fireEvent,render,screen} from "@testing-library/react";
import {afterEach,expect,it,vi} from "vitest";
import {useGridraPopover} from "../index";
afterEach(cleanup);
function Example({disabled=false,open,onOpenChange}:{disabled?:boolean;open?:boolean;onOpenChange?:(next:boolean,previous:boolean)=>void}){
 const p=useGridraPopover({disabled,open,onOpenChange});return <><button {...p.getTriggerProps()}>Open</button>{p.currentOpen?<div {...p.getContentProps()}>Content</div>:null}</>;
}
it("opens caller-owned content and closes on Escape and outside pointerdown",()=>{
 render(<Example/>);fireEvent.click(screen.getByRole("button"));expect(screen.getByText("Content")).toBeTruthy();
 fireEvent.keyDown(document,{key:"Escape"});expect(screen.queryByText("Content")).toBeNull();
 fireEvent.click(screen.getByRole("button"));fireEvent.pointerDown(document.body);expect(screen.queryByText("Content")).toBeNull();
});
it("keeps disabled actions inert and controlled state owned externally",()=>{
 const onOpenChange=vi.fn();const {rerender}=render(<Example disabled onOpenChange={onOpenChange}/>);fireEvent.click(screen.getByRole("button"));expect(onOpenChange).not.toHaveBeenCalled();
 rerender(<Example open={false} onOpenChange={onOpenChange}/>);fireEvent.click(screen.getByRole("button"));expect(onOpenChange).toHaveBeenCalledWith(true,false);expect(screen.queryByText("Content")).toBeNull();
});
