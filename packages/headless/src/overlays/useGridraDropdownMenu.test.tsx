import {cleanup,fireEvent,render,screen} from "@testing-library/react";
import {afterEach,expect,it,vi} from "vitest";
import {useGridraDropdownMenu} from "./useGridraDropdownMenu";
afterEach(cleanup);
function Menu({onAction=()=>{},cancel=false,disabled=false}:{onAction?:(id:string)=>void;cancel?:boolean;disabled?:boolean}) {
  const m=useGridraDropdownMenu({items:[{id:"a",label:"A"},{id:"off",label:"Off",disabled:true},{id:"b",label:"B"}],onAction,disabled});
  return <><button {...m.getTriggerProps({onClick:cancel?e=>e.preventDefault():undefined})}>Open</button>{m.currentOpen?<div {...m.getMenuProps()}>{["a","off","b"].map(id=><button key={id} {...m.getItemProps(id)}>{id}</button>)}</div>:null}</>;
}
it("navigates inline items, skips disabled commands and restores focus",()=>{
  const action=vi.fn();render(<Menu onAction={action}/>);const trigger=screen.getByText("Open");fireEvent.click(trigger);
  fireEvent.keyDown(screen.getByRole("menu"),{key:"ArrowDown"});expect(document.activeElement).toBe(screen.getByText("b"));
  fireEvent.keyDown(screen.getByRole("menu"),{key:"Enter"});expect(action).toHaveBeenCalledWith("b");expect(screen.queryByRole("menu")).toBeNull();expect(document.activeElement).toBe(trigger);
});
it("honors consumer cancellation and disabled triggers",()=>{
  const {rerender}=render(<Menu cancel/>);fireEvent.click(screen.getByText("Open"));expect(screen.queryByRole("menu")).toBeNull();
  rerender(<Menu disabled/>);fireEvent.click(screen.getByText("Open"));expect(screen.queryByRole("menu")).toBeNull();
});
