import { GridraTimeline } from "@gridra-ui/react";
import type { GridraTimelineItem, GridraTimelineOrientation } from "@gridra-ui/react";

const history: GridraTimelineItem[] = [
  {
    id: "learning",
    date: "2022年4月",
    dateTime: "2022-04",
    title: "Web制作を開始",
    description: "HTMLとCSSから始め、Reactを使った画面づくりに取り組みました。",
  },
  {
    id: "project",
    date: "2023年9月",
    dateTime: "2023-09",
    title: "初めてのプロジェクトを公開",
    description: <>
      <p>企画からデザイン、実装まで担当し、使いながら改善できるサービスを制作しました。</p>
      <a href="https://example.com/projects">プロジェクトを見る</a>
    </>,
  },
  {
    id: "independent",
    date: "2024年から現在",
    title: "個人開発を継続",
    description: "制作したものや学んだことを公開し、設計と実装の経験を積んでいます。",
  },
];

export function TimelineExample({ orientation = "vertical" }: { orientation?: GridraTimelineOrientation }) {
  return <GridraTimeline aria-label="ポートフォリオの活動履歴" items={history} orientation={orientation} />;
}
