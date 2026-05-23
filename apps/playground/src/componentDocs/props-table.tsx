import type { PropDoc } from "./types";

export function PropsTable({ props }: { props: PropDoc[] }) {
  return (
    <div className="docs-props-table-wrapper">
      <table className="docs-props-table">
        <thead>
          <tr>
            <th>Prop</th>
            <th>Type</th>
            <th>Default</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {props.map((prop) => (
            <tr key={prop.name}>
              <td>
                <code className="docs-prop-name">
                  {prop.name}
                  {prop.required && <span className="docs-prop-required">*</span>}
                </code>
              </td>
              <td>
                <code className="docs-prop-type">{prop.type}</code>
              </td>
              <td>{prop.default ?? "—"}</td>
              <td>{prop.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
