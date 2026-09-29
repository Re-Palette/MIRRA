import { useId } from "react";
import { cn } from "@/lib/utils";

export type BottleKind = "oil" | "treatment" | "shampoo" | "milk" | "serum";

type Spec = {
  shape: "dropper" | "pump" | "tube";
  body: [string, string, string];
  cap: string;
  label: string;
  labelInk: string;
  bg: [string, string];
  w: number;
  h: number;
  translucent?: boolean;
};

const specs: Record<BottleKind, Spec> = {
  oil: { shape: "dropper", body: ["#5a3417", "#b97a3c", "#4a2a12"], cap: "#15161a", label: "#f4efe6", labelInk: "#3b2a1c", bg: ["#f5efe6", "#e9e1d4"], w: 34, h: 62, translucent: true },
  treatment: { shape: "pump", body: ["#e8b3be", "#f8dce2", "#dca1ae"], cap: "#f6f2f2", label: "#ffffff", labelInk: "#9a5d6b", bg: ["#fbf0f2", "#f1e0e5"], w: 44, h: 70 },
  shampoo: { shape: "pump", body: ["#e9e6df", "#fbfaf7", "#dcd8cf"], cap: "#1a1b20", label: "#f1ede4", labelInk: "#2c2a26", bg: ["#f3f2ef", "#e6e4de"], w: 42, h: 80 },
  milk: { shape: "tube", body: ["#e7e0d3", "#fbf8f2", "#d9d1c1"], cap: "#b9b3a8", label: "#ffffff", labelInk: "#5b5245", bg: ["#f4f1ec", "#e8e3da"], w: 38, h: 78 },
  serum: { shape: "dropper", body: ["#bcc6ea", "#e5e9fb", "#a9b3de"], cap: "#e9ebf3", label: "#ffffff", labelInk: "#3c4a7a", bg: ["#eef1fb", "#e0e5f5"], w: 32, h: 58, translucent: true },
};

/** Crisp, resolution-independent product still life. */
export function ProductVisual({ kind, className }: { kind: BottleKind; className?: string }) {
  const id = useId().replace(/:/g, "");
  const s = specs[kind];
  const cx = 60;
  const floor = 132;
  const top = floor - s.h;
  const x = cx - s.w / 2;
  const r = s.shape === "tube" ? s.w / 2 : s.shape === "pump" ? 9 : 6;

  return (
    <svg viewBox="0 0 120 150" preserveAspectRatio="xMidYMid slice" className={cn("size-full", className)} aria-hidden>
      <defs>
        <linearGradient id={`bg${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={s.bg[0]} />
          <stop offset="100%" stopColor={s.bg[1]} />
        </linearGradient>
        <linearGradient id={`body${id}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={s.body[0]} />
          <stop offset="45%" stopColor={s.body[1]} />
          <stop offset="100%" stopColor={s.body[2]} />
        </linearGradient>
        <linearGradient id={`hl${id}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#fff" stopOpacity="0" />
          <stop offset="50%" stopColor="#fff" stopOpacity={s.translucent ? 0.55 : 0.8} />
          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <radialGradient id={`sh${id}`}>
          <stop offset="0%" stopColor="#101828" stopOpacity="0.28" />
          <stop offset="100%" stopColor="#101828" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`cap${id}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={s.cap} />
          <stop offset="40%" stopColor="#ffffff" stopOpacity="0.35" />
          <stop offset="60%" stopColor={s.cap} />
          <stop offset="100%" stopColor={s.cap} />
        </linearGradient>
      </defs>

      <rect width="120" height="150" fill={`url(#bg${id})`} />
      {/* window light */}
      <path d="M78 0 L120 0 L120 70 L96 150 L70 150 Z" fill="#fff" opacity="0.28" />
      <ellipse cx={cx + 6} cy={floor + 1} rx={s.w * 0.9} ry="4.5" fill={`url(#sh${id})`} />

      {/* body */}
      <rect x={x} y={top} width={s.w} height={s.h} rx={r} fill={`url(#body${id})`} />
      {s.translucent && <rect x={x + 3} y={top + s.h * 0.35} width={s.w - 6} height={s.h * 0.6} rx={r - 2} fill={s.body[0]} opacity="0.35" />}
      <rect x={x + s.w * 0.14} y={top + 4} width={s.w * 0.12} height={s.h - 10} rx="3" fill={`url(#hl${id})`} />

      {/* label */}
      <rect x={x + 5} y={top + s.h * 0.34} width={s.w - 10} height={s.h * 0.34} rx="2" fill={s.label} opacity="0.94" />
      <text x={cx} y={top + s.h * 0.34 + s.h * 0.13} textAnchor="middle" fontSize="5" letterSpacing="1.6" fill={s.labelInk} fontFamily="Jost, sans-serif">
        MIRRA
      </text>
      <line x1={cx - 7} x2={cx + 7} y1={top + s.h * 0.34 + s.h * 0.19} y2={top + s.h * 0.34 + s.h * 0.19} stroke={s.labelInk} strokeWidth="0.4" opacity="0.6" />
      <rect x={cx - 9} y={top + s.h * 0.34 + s.h * 0.23} width="18" height="1.3" rx="0.6" fill={s.labelInk} opacity="0.35" />
      <rect x={cx - 6} y={top + s.h * 0.34 + s.h * 0.27} width="12" height="1.3" rx="0.6" fill={s.labelInk} opacity="0.25" />

      {/* closures */}
      {s.shape === "dropper" && (
        <>
          <rect x={cx - 6} y={top - 5} width="12" height="6" fill={s.body[2]} />
          <rect x={cx - 8} y={top - 17} width="16" height="13" rx="2" fill={`url(#cap${id})`} />
          <rect x={cx - 5.5} y={top - 32} width="11" height="16" rx="5.5" fill={`url(#cap${id})`} />
        </>
      )}
      {s.shape === "pump" && (
        <>
          <rect x={cx - 9} y={top - 8} width="18" height="9" rx="2" fill={`url(#cap${id})`} />
          <rect x={cx - 2.5} y={top - 20} width="5" height="13" fill={`url(#cap${id})`} />
          <path d={`M${cx - 7} ${top - 24} h 22 a 2.5 2.5 0 0 1 0 5 h -22 a 2.5 2.5 0 0 1 0 -5 z`} fill={`url(#cap${id})`} />
        </>
      )}
      {s.shape === "tube" && <rect x={cx - 8} y={top - 12} width="16" height="14" rx="3" fill={`url(#cap${id})`} />}
    </svg>
  );
}
