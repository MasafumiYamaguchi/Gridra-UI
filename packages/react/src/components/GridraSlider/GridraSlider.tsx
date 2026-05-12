import type { InputHTMLAttributes } from "react";

export interface GridraSliderProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {}

export function GridraSlider({ className, ...props }: GridraSliderProps) {
  const sliderClassName = ["gridra-slider", className].filter(Boolean).join(" ");

  return <input className={sliderClassName} type="range" {...props} />;
}
