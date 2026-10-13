import { useState } from "react";
import { GridraSlider, GridraSplitPane } from "@gridra-ui/react";
import "@gridra-ui/theme/base.css";
import "@gridra-ui/theme/themes.css";

export default function App() {
  const [opacity, setOpacity] = useState(72);
  const [sizes, setSizes] = useState([30, 40, 30]);

  return (
    <div className="gridra-theme-midnight" style={{ height: 320 }}>
      <GridraSplitPane sizes={sizes} onSizesChange={setSizes}>
        <div>Tools</div>
        <div>
          <GridraSlider
            aria-label="Opacity"
            min={0}
            max={100}
            value={opacity}
            onChange={(event) => setOpacity(event.currentTarget.valueAsNumber)}
            showValue
            valueFormatter={(value) => `${value}%`}
          />
        </div>
        <div>Inspector</div>
      </GridraSplitPane>
    </div>
  );
}
