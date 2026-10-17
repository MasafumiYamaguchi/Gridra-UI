import {cleanup,fireEvent,render,screen} from "@testing-library/react";
import {afterEach,expect,it,vi} from "vitest";
import {useGridraCommandPalette} from "./useGridraCommandPalette";
afterEach(cleanup);
function Palette({action=()=>{},controlled=false}:{action?:(id:string)=>void;controlled?:boolean}){
 const p=useGridraCommandPalette({items:[{id:"a",label:"Alpha"},{id:"off",label:"Offline",disabled:true},{id:"b",label:"Beta",keywords:["second"]}],onAction:action,...(controlled?{query:"Alpha"}: {})});
 return <><button onClick={()=>p.setOpen(true)}>Open</button>{p.currentOpen?<div {...p.getDialogProps()}><h2 id={p.titleId}>Commands</h2><input {...p.getInputProps({"aria-label":"Search"})}/>{p.filteredCommands.map(i=><button key={i.id} {...p.getItemProps(i.id)}>{i.label}</button>)}</div>:null}</>;
}
it("searches metadata and executes using caller DOM",()=>{
 const action=vi.fn();render(<Palette action={action}/>);fireEvent.click(screen.getByText("Open"));fireEvent.change(screen.getByRole("textbox"),{target:{value:"second"}});expect(screen.queryByText("Alpha")).toBeNull();fireEvent.keyDown(screen.getByRole("dialog"),{key:"Enter"});expect(action).toHaveBeenCalledWith("b");expect(screen.queryByRole("dialog")).toBeNull();
});
it("keeps controlled search and skips disabled commands",()=>{
 const {rerender}=render(<Palette controlled/>);fireEvent.click(screen.getByText("Open"));fireEvent.change(screen.getByRole("textbox"),{target:{value:"Beta"}});expect(screen.getByRole("textbox").getAttribute("value")).toBe("Alpha");
 rerender(<Palette/>);fireEvent.change(screen.getByRole("textbox"),{target:{value:""}});fireEvent.keyDown(screen.getByRole("dialog"),{key:"End"});expect(document.activeElement).toBe(screen.getByText("Beta"));fireEvent.keyDown(document,{key:"Escape"});expect(screen.queryByRole("dialog")).toBeNull();
});
