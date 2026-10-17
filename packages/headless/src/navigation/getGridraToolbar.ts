import type {ReactNode,HTMLAttributes,ButtonHTMLAttributes} from "react";
import {getGridraButtonProps} from "../forms/getGridraButtonProps";
import {composeHandlers} from "../internal/composeHandlers";
export interface GridraToolbarAction {id:string;label:ReactNode;pressed?:boolean;disabled?:boolean}
/** 操作のメタデータを独自buttonに接続する。フォーカス移動はnativeのTab順序を使う。 */
export function getGridraToolbar({actions=[],onAction}:{actions?:GridraToolbarAction[];onAction?:(id:string)=>void}={}){
 const getActionProps=(id:string,props:ButtonHTMLAttributes<HTMLButtonElement>={})=>{const action=actions.find(action=>action.id===id);return getGridraButtonProps({pressed:action?.pressed,...props,disabled:!action||action.disabled||props.disabled,onClick:composeHandlers(props.onClick,()=>{if(action&&!action.disabled&&!props.disabled)onAction?.(id);})});};
 return {rootProps:{role:"toolbar"} satisfies HTMLAttributes<HTMLElement>,getActionProps};
}
