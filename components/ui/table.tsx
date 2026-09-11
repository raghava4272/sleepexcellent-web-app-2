import type { ReactNode } from "react";

export function DataTable({
  columns,
  rows,
}: {
  columns: string[];
  rows: ReactNode[][];
}) {
  return (
    <div className="overflow-x-auto border border-line">
      <table className="w-full min-w-[38rem] border-collapse text-left text-sm">
        <thead className="bg-canvas-pressed text-xs tracking-[0.08em] uppercase">
          <tr>
            {columns.map((column) => (
              <th className="border-b border-line px-4 py-3 font-semibold" key={column} scope="col">
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-canvas-raised">
          {rows.map((row, rowIndex) => (
            <tr className="border-b border-line last:border-b-0" key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <td className="px-4 py-3 text-muted-ink" key={cellIndex}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
