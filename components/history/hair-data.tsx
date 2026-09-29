"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Droplets, Sparkles } from "lucide-react";
import { hairMetrics, hairScore, hairTrend } from "@/lib/data";
import { Reveal } from "@/components/ui/motion";

const W = 320;
const H = 150;
const PAD = { l: 26, r: 14, t: 16, b: 24 };
const MIN = 60;
const MAX = 100;

export function HairDataPanel() {
  return (
    <div className="space-y-4 px-4 pt-6">
      <Reveal>
        <TrendChart />
      </Reveal>

      <Reveal className="glass rounded-card p-5">
        <p className="text-[10.5px] tracking-[0.3em] text-ink-muted">HAIR ANALYSIS</p>
        <h3 className="font-jp mt-1 text-[15px] font-medium">髪質診断の内訳</h3>
        <div className="mt-4 space-y-4">
          {hairMetrics.map((m, i) => (
            <div key={m.label}>
              <div className="flex items-baseline justify-between text-[12px]">
                <span className="font-jp text-ink-soft">{m.label}</span>
                <span className="tabular-nums">
                  {m.value}
                  <span className="font-jp ml-2 text-[10.5px] text-ink-muted">{m.note}</span>
                </span>
              </div>
              <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-ink/[0.06]">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${m.value}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.2, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                  className="h-full rounded-full bg-[#4f63d9]"
                />
              </div>
            </div>
          ))}
        </div>
      </Reveal>

      <Reveal className="grid grid-cols-2 gap-3">
        <div className="glass rounded-card p-4">
          <Droplets className="size-5 text-[#6f86e8]" strokeWidth={1.5} />
          <p className="font-jp mt-3 text-[11px] text-ink-muted">髪質タイプ</p>
          <p className="font-jp mt-0.5 text-[13.5px]">{hairScore.hairType}</p>
        </div>
        <div className="glass rounded-card p-4">
          <Sparkles className="size-5 text-[#a67be8]" strokeWidth={1.5} />
          <p className="font-jp mt-3 text-[11px] text-ink-muted">ダメージレベル</p>
          <p className="mt-0.5 text-[13.5px]">
            {hairScore.damage.label}
            <span className="font-jp ml-1 text-[11px] text-ink-muted">（5%）</span>
          </p>
        </div>
      </Reveal>
    </div>
  );
}

function TrendChart() {
  const [hover, setHover] = useState<number | null>(null);
  const n = hairTrend.length;
  const xAt = (i: number) => PAD.l + (i * (W - PAD.l - PAD.r)) / (n - 1);
  const yAt = (v: number) => PAD.t + ((MAX - v) * (H - PAD.t - PAD.b)) / (MAX - MIN);
  const line = hairTrend.map((d, i) => `${i ? "L" : "M"}${xAt(i).toFixed(1)} ${yAt(d.score).toFixed(1)}`).join(" ");
  const area = `${line} L${xAt(n - 1)} ${H - PAD.b} L${xAt(0)} ${H - PAD.b} Z`;
  const active = hover ?? n - 1;
  const d = hairTrend[active];

  const onMove = (e: React.PointerEvent<SVGSVGElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const px = ((e.clientX - r.left) / r.width) * W;
    const i = Math.round(((px - PAD.l) / (W - PAD.l - PAD.r)) * (n - 1));
    setHover(Math.max(0, Math.min(n - 1, i)));
  };

  return (
    <figure className="glass rounded-card p-5">
      <figcaption className="flex items-end justify-between">
        <div>
          <p className="text-[10.5px] tracking-[0.3em] text-ink-muted">SCORE TREND</p>
          <h3 className="font-jp mt-1 text-[15px] font-medium">髪質スコアの推移</h3>
        </div>
        <div className="text-right">
          <p className="font-display text-[34px] font-light leading-none tabular-nums">{d.score}</p>
          <p className="font-jp text-[10.5px] text-ink-muted">{d.month}</p>
        </div>
      </figcaption>

      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="mt-3 w-full touch-none overflow-visible"
        onPointerMove={onMove}
        onPointerDown={onMove}
        onPointerLeave={() => setHover(null)}
        role="img"
        aria-label={`髪質スコアの推移。${hairTrend[0].month}の${hairTrend[0].score}から${hairTrend[n - 1].month}の${hairTrend[n - 1].score}へ上昇`}
      >
        <defs>
          <linearGradient id="trend-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4f63d9" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#4f63d9" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[70, 80, 90].map((v) => (
          <g key={v}>
            <line x1={PAD.l} x2={W - PAD.r} y1={yAt(v)} y2={yAt(v)} stroke="#101828" strokeOpacity="0.06" />
            <text x={PAD.l - 6} y={yAt(v) + 3} textAnchor="end" fontSize="9" fill="#98a2b3" className="tabular-nums">
              {v}
            </text>
          </g>
        ))}
        {hairTrend.map((p, i) =>
          i % 2 === 0 ? (
            <text key={p.month} x={xAt(i)} y={H - 6} textAnchor="middle" fontSize="9" fill="#98a2b3">
              {p.month}
            </text>
          ) : null,
        )}
        <motion.path d={area} fill="url(#trend-fill)" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.4 }} />
        <motion.path
          d={line}
          fill="none"
          stroke="#4f63d9"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
        />
        {/* crosshair */}
        <line x1={xAt(active)} x2={xAt(active)} y1={PAD.t - 4} y2={H - PAD.b} stroke="#101828" strokeOpacity="0.18" strokeDasharray="2 3" />
        <circle cx={xAt(active)} cy={yAt(d.score)} r="6" fill="#fff" stroke="#4f63d9" strokeWidth="2" />
        {/* hit area */}
        <rect x={0} y={0} width={W} height={H} fill="transparent" />
      </svg>

      <table className="sr-only">
        <caption>髪質スコアの月次推移</caption>
        <thead>
          <tr>
            <th>月</th>
            <th>スコア</th>
          </tr>
        </thead>
        <tbody>
          {hairTrend.map((p) => (
            <tr key={p.month}>
              <td>{p.month}</td>
              <td>{p.score}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
}
