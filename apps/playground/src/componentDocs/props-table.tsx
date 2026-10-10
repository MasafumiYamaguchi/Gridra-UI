import { Fragment } from "react";
import type { PropDoc } from "./types";

function propValues(prop: PropDoc) {
  if (prop.values) return prop.values;
  const parts = prop.type.split(/\s*\|\s*/);
  return parts.every((part) => /^"[^"]*"$|^'[^']*'$/.test(part))
    ? parts.map((part) => part.slice(1, -1)) : undefined;
}

export function PropsTable({ props }: { props: PropDoc[] }) {
  const groups = new Map<string, PropDoc[]>();
  for (const prop of props) {
    const group = prop.group ?? "";
    groups.set(group, [...(groups.get(group) ?? []), prop]);
  }

  return <div className="docs-props-table-wrapper">
    <table className="docs-props-table">
      <thead><tr><th>Prop</th><th>Type / values</th><th>Default</th><th>Description</th></tr></thead>
      <tbody>{Array.from(groups, ([group, items]) => <Fragment key={group}>
        {group && <tr className="docs-props-group"><td colSpan={4}>{group}</td></tr>}
        {items.map((prop) => {
          const values = propValues(prop);
          return <tr key={prop.name}>
            <td><code className="docs-prop-name">{prop.name}
              {prop.required && <span className="docs-prop-required">*</span>}
            </code></td>
            <td>{values ? <div className="docs-prop-values">{values.map((value) =>
              <code key={value} className="docs-prop-value">{value}</code>
            )}</div> : <code className="docs-prop-type">{prop.type}</code>}</td>
            <td><code className="docs-prop-default">{prop.default ?? "—"}</code></td>
            <td>{prop.description}</td>
          </tr>;
        })}
      </Fragment>)}</tbody>
    </table>
  </div>;
}
