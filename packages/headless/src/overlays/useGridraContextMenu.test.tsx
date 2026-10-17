import {cleanup,fireEvent,render,screen} from "@testing-library/react";
import {afterEach,expect,it,vi} from "vitest";
import {useGridraContextMenu} from "./useGridraContextMenu";
afterEach(cleanup);
function Menu({onAction=()=>{},cancel=false}:{onAction?:(id:string)=>void;cancel?:boolean}) {
  const m=useGridraContextMenu({items:[{id:"a",label:"A"},{id:"off",label:"Off",disabled:true},{id:"b",label:"B"}],onAction});
  return <><button {...m.getTargetProps({onContextMenu:cancel?e=>e.preventDefault():undefined})}>Target</button>{m.currentOpen?<div {...m.getMenuProps()}>{["a","off","b"].map(id=><button key={id} {...m.getItemProps(id)}>{id}</button>)}</div>:null}</>;
}
it("supports keyboard invocation and navigation with inline items",()=>{
  const action=vi.fn();render(<Menu onAction={action}/>);const trigger=screen.getByText("Target");fireEvent.keyDown(trigger,{key:"F10",shiftKey:true});
  fireEvent.keyDown(screen.getByRole("menu"),{key:"ArrowDown"});expect(document.activeElement).toBe(screen.getByText("b"));
  fireEvent.keyDown(screen.getByRole("menu"),{key:"Enter"});expect(action).toHaveBeenCalledWith("b");expect(screen.queryByRole("menu")).toBeNull();expect(document.activeElement).toBe(trigger);
});
it("respects consumer cancellation and closes on outside pointerdown",()=>{
  const {rerender}=render(<Menu cancel/>);fireEvent.contextMenu(screen.getByText("Target"));expect(screen.queryByRole("menu")).toBeNull();
  rerender(<Menu/>);fireEvent.contextMenu(screen.getByText("Target"),{clientX:10,clientY:20});expect(screen.getByRole("menu").style.left).toBe("10px");fireEvent.pointerDown(document.body);expect(screen.queryByRole("menu")).toBeNull();
});
