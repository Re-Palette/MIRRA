import { useMemo } from "react";

/** Decorative QR-style code (deterministic, demo only — not scannable). */
export function QrCode({ seed = "MIRRA-0001234567", className }: { seed?: string; className?: string }) {
  const size = 29;
  const path = useMemo(() => {
    let h = 2166136261;
    for (const c of seed) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
    const rand = () => {
      h ^= h << 13;
      h ^= h >>> 17;
      h ^= h << 5;
      return ((h >>> 0) % 1000) / 1000;
    };
    const inFinder = (x: number, y: number) => {
      const zones = [
        [0, 0],
        [size - 7, 0],
        [0, size - 7],
      ];
      return zones.some(([zx, zy]) => x >= zx - 1 && x <= zx + 7 && y >= zy - 1 && y <= zy + 7);
    };
    let d = "";
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        if (inFinder(x, y)) continue;
        const timing = (x === 6 || y === 6) && (x + y) % 2 === 0;
        const align = x >= size - 9 && x <= size - 5 && y >= size - 9 && y <= size - 5;
        const alignOn = align && (x === size - 9 || x === size - 5 || y === size - 9 || y === size - 5 || (x === size - 7 && y === size - 7));
        if (align ? alignOn : timing || rand() > 0.52) d += `M${x} ${y}h1v1h-1z`;
      }
    }
    return d;
  }, [seed]);

  const finder = (x: number, y: number) => (
    <g key={`${x}-${y}`}>
      <rect x={x + 0.5} y={y + 0.5} width={6} height={6} rx={1.6} fill="none" stroke="currentColor" strokeWidth={1} />
      <rect x={x + 2} y={y + 2} width={3} height={3} rx={0.8} fill="currentColor" />
    </g>
  );

  return (
    <svg viewBox={`-1 -1 ${size + 2} ${size + 2}`} className={className} shapeRendering="crispEdges" aria-label="会員QRコード" role="img">
      <path d={path} fill="currentColor" />
      <g shapeRendering="geometricPrecision">
        {finder(0, 0)}
        {finder(size - 7, 0)}
        {finder(0, size - 7)}
      </g>
    </svg>
  );
}
