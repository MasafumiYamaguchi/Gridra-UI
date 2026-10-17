import type {InputHTMLAttributes} from "react";
import {resolveAriaInvalid,useControlDescriptionIds} from "../internal/formControl";
export interface UseGridraRadioOptions {inputProps?:Omit<InputHTMLAttributes<HTMLInputElement>,"type">;hasDescription?:boolean;invalid?:boolean}
/** ネイティブradioと説明を結び付け、入力属性を解決する。 */
export function useGridraRadio({inputProps={},hasDescription=false,invalid=false}:UseGridraRadioOptions={}){
 const {controlId,descriptionId}=useControlDescriptionIds(inputProps.id,hasDescription);
 const {"aria-invalid":ariaInvalid,...nativeProps}=inputProps;
 return {controlId,descriptionId,inputProps:{"aria-describedby":descriptionId,"aria-invalid":resolveAriaInvalid(ariaInvalid,invalid),id:controlId,type:"radio",...nativeProps} satisfies InputHTMLAttributes<HTMLInputElement>,descriptionProps:{id:descriptionId}};
}
