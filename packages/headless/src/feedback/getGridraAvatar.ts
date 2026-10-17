import type {HTMLAttributes,ImgHTMLAttributes} from "react";
export interface GridraAvatarOptions {src?:string;alt?:string;fallback?:string}
/** 画像と代替表示の名前が重複しないように属性を解決する。 */
export function getGridraAvatar({src,alt="",fallback}:GridraAvatarOptions={}){
const fallbackAccessibleName=!src?(alt||fallback||undefined):undefined;
return {hasImage:Boolean(src),fallbackText:fallback??alt.slice(0,2),rootProps:{role:fallbackAccessibleName?"img":undefined,"aria-label":fallbackAccessibleName} satisfies HTMLAttributes<HTMLElement>,imageProps:{src,alt} satisfies ImgHTMLAttributes<HTMLImageElement>,fallbackProps:{"aria-hidden":true} satisfies HTMLAttributes<HTMLElement>};
}
