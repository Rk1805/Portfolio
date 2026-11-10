const COLORS: Record<string, string> = { i: 'var(--color-ink)', a: 'var(--color-tungsten)', k: 'var(--color-void)', c: 'var(--color-arc)' }

/** A static block bitmap as inline SVG. Decorative: always aria-hidden. */
export function Pix({ rows, size = 4, className }: { rows: string[]; size?: number; className?: string }) {
  const w = rows[0]?.length ?? 0
  return (
    <svg width={w * size} height={rows.length * size} viewBox={`0 0 ${w} ${rows.length}`} shapeRendering="crispEdges" aria-hidden="true" className={className}>
      {rows.flatMap((row, y) => [...row].map((ch, x) => (ch === '.' ? null : <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" fill={COLORS[ch]} />)))}
    </svg>
  )
}
