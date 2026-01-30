import styles from "./grid.module.css";

interface GridProps {
  rows: number;
  columns: number;
  children: React.ReactElement<CellProps | CrossProps>[];
}

function Root({ rows, columns, children }: GridProps) {
  return (
    <div
      className={styles.grid}
      style={{ "--rows": rows, "--columns": columns } as React.CSSProperties}
    >
      <div className={styles.gridGuides}>
        {Array.from({ length: rows * columns }, (_, index) => {
          // Calculate the x and y position of the cell
          const x = (index % columns) + 1;
          const y = Math.floor(index / columns) + 1;
          return (
            <div
              className={styles.gridGuide}
              // biome-ignore lint/suspicious/noArrayIndexKey: shh!
              key={index}
              style={{ "--x": x, "--y": y } as React.CSSProperties}
            />
          );
        })}
      </div>
      {/* Cells will render here */}
      {children}
    </div>
  );
}

interface CellProps {
  row: number;
  column: number;
  children: React.ReactNode;
}

function Cell({ row, column, children }: CellProps) {
  return (
    <div
      className={styles.gridCell}
      style={{ gridRow: row, gridColumn: column }}
    >
      {children}
    </div>
  );
}

interface CrossProps {
  row: number;
  column: number;
}

function Cross({ row, column }: CrossProps) {
  return (
    <div
      className={styles.cross}
      style={
        { "--cross-row": row, "--cross-column": column } as React.CSSProperties
      }
    >
      <div
        className={styles.crossLine}
        style={{
          width: "var(--cross-half-size)",
          height: "var(--cross-size)",
          borderRightWidth: "var(--guide-width)",
        }}
      />
      <div
        className={styles.crossLine}
        style={{
          width: "var(--cross-size)",
          height: "var(--cross-half-size)",
          borderBottomWidth: "var(--guide-width)",
        }}
      />
    </div>
  );
}

interface SystemProps {
  guideWidth: number;
  children: React.ReactNode;
}

function System({ guideWidth, children }: SystemProps) {
  return (
    <div
      className={styles.gridSystem}
      style={{ "--guide-width": `${guideWidth}px` } as React.CSSProperties}
    >
      {children}
    </div>
  );
}

export const Grid = Object.assign(Root, { System, Cell, Cross });
