import type { HTMLAttributes } from "react";
import { GridraSnapGuide, type GridraSnapGuideProps } from "./GridraSnapGuide";

export interface GridraSnapGuidesProps extends HTMLAttributes<HTMLDivElement> {
  guides: GridraSnapGuideProps[];
}

export function GridraSnapGuides({
  className,
  guides,
  ...props
}: GridraSnapGuidesProps) {
  const snapGuidesClassName = ["gridra-snap-guides", className]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={snapGuidesClassName} {...props}>
      {guides.map((guide, index) => (
        <GridraSnapGuide
          key={`${guide.orientation ?? "vertical"}-${guide.position ?? "placement"}-${guide.start ?? 0}-${guide.end ?? "full"}-${index}`}
          {...guide}
        />
      ))}
    </div>
  );
}
