"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { animate, motion, useInView, useMotionValue, useTransform } from "framer-motion";
import { ChevronRight, TrendingUp } from "lucide-react";
import { hairScore } from "@/lib/data";
import { useDevice } from "@/components/shell/device-context";

const R = 46;
const C = 2 * Math.PI * R;

export function ScoreCard() {
  const { scrollRef } = useDevice();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { root: scrollRef, once: true });
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.round(v).toString());
  const dash = useTransform(count, (v) => C - (C * v) / 100);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(count, hairScore.score, { duration: 1.8, delay: 0.35, ease: [0.22, 1, 0.36, 1] });
    return () => controls.stop();
  }, [inView, count]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.1, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className="glass relative mx-4 -mt-[108px] overflow-hidden rounded-card p-5"
    >
      <div className="pointer-events-none absolute -right-16 -top-20 size-56 rounded-full bg-accent-2/70 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-10 size-56 rounded-full bg-accent/80 blur-3xl" />

      <div className="relative flex items-center justify-between">
        <p className="text-[10.5px] tracking-[0.3em] text-ink-muted">HAIR CONDITION</p>
        <Link href="/history" className="flex items-center text-[11px] text-ink-soft">
          カルテ
          <ChevronRight className="size-3.5" />
        </Link>
      </div>

      <div className="relative mt-3 flex items-center gap-5">
        <div className="relative size-[116px] shrink-0">
          <svg viewBox="0 0 116 116" className="size-full -rotate-90">
            <defs>
              <linearGradient id="score-grad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#8ea8ff" />
                <stop offset="55%" stopColor="#c7a8ff" />
                <stop offset="100%" stopColor="#101828" />
              </linearGradient>
            </defs>
            <circle cx="58" cy="58" r={R} fill="none" stroke="rgba(16,24,40,0.06)" strokeWidth="7" />
            <motion.circle
              cx="58"
              cy="58"
              r={R}
              fill="none"
              stroke="url(#score-grad)"
              strokeWidth="7"
              strokeLinecap="round"
              strokeDasharray={C}
              style={{ strokeDashoffset: dash }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.span className="font-display text-[44px] font-light leading-none tabular-nums">{rounded}</motion.span>
            <span className="mt-0.5 text-[9.5px] tracking-[0.2em] text-ink-muted">髪質スコア</span>
          </div>
        </div>

        <div className="flex-1 space-y-3">
          <Metric label="ダメージ" value={hairScore.damage.label} level={hairScore.damage.value} tone="#7fa0ff" />
          <Metric label="乾燥度" value={hairScore.dryness.label} level={hairScore.dryness.value} tone="#c49bff" />
          <div className="flex items-center gap-1.5 pt-0.5 text-[11px] text-[#2f7d57]">
            <TrendingUp className="size-3.5" strokeWidth={1.8} />
            先月より +{hairScore.delta}
          </div>
        </div>
      </div>

      <div className="relative mt-4 flex items-center justify-between rounded-[18px] bg-white/60 px-4 py-3 text-[11.5px]">
        <span className="text-ink-muted">最終施術</span>
        <span className="tabular-nums tracking-[0.04em]">
          {hairScore.lastVisit}
          <span className="ml-2 text-ink-soft">{hairScore.lastMenu}</span>
        </span>
      </div>
    </motion.div>
  );
}

function Metric({ label, value, level, tone }: { label: string; value: string; level: number; tone: string }) {
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <span className="font-jp text-[11.5px] text-ink-soft">{label}</span>
        <span className="text-[14px] tracking-[0.04em]">{value}</span>
      </div>
      <div className="mt-1.5 h-[5px] overflow-hidden rounded-full bg-ink/[0.06]">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${level}%` }}
          transition={{ duration: 1.4, delay: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="h-full rounded-full"
          style={{ background: `linear-gradient(90deg, ${tone}66, ${tone})` }}
        />
      </div>
    </div>
  );
}
