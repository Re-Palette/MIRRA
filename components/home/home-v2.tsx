"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { animate, motion, useInView, useMotionValue, useTransform } from "framer-motion";
import { Bell, CalendarDays, ChevronRight, Droplet, Droplets, HeartPulse, Palette, ShieldCheck, Sun, Thermometer } from "lucide-react";
import { useDevice } from "@/components/shell/device-context";
import { useAgent } from "@/components/agent/agent-provider";
import { GlowOrb } from "@/components/ai/glow-orb";
import { ProductVisual } from "@/components/ui/product-visual";
import { Reveal } from "@/components/ui/motion";
import { StoryViewer } from "./story-viewer";
import { aiAdvice, beautyScore, products, salons, timeline, user, weather } from "@/lib/data";
import { cn, yen } from "@/lib/utils";

/* ---------------------------------------------------------------- Weather */

export function WeatherHeader() {
  const items = [
    { icon: Thermometer, value: `${weather.temp}°`, label: weather.city },
    { icon: Droplets, value: `${weather.humidity}%`, label: "湿度" },
    { icon: Sun, value: String(weather.uv), label: "UV" },
  ];
  return (
    <header className="flex items-center justify-between px-6 pb-5 pt-[max(env(safe-area-inset-top),18px)] lg:pt-[62px]">
      <div className="flex items-center">
        {items.map((it, i) => (
          <div key={it.label} className={cn("flex items-center gap-2", i > 0 && "ml-4 border-l border-hairline pl-4")}>
            <it.icon className="size-[17px] text-ink-soft" strokeWidth={1.3} />
            <div className="leading-[1.1]">
              <p className="text-[15px] font-normal tabular-nums tracking-[-0.01em]">{it.value}</p>
              <p className="text-[10px] tracking-[0.04em] text-ink-muted">{it.label}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-3">
        <button aria-label="お知らせ" className="relative grid size-9 place-items-center rounded-full text-ink-soft transition-colors hover:bg-ink/[0.04]">
          <Bell className="size-[19px]" strokeWidth={1.4} />
          <span className="absolute right-[8px] top-[7px] size-[6px] rounded-full bg-[#7c8cff]" />
        </button>
        <Link href="/profile" aria-label="マイページ" className="relative size-9 overflow-hidden rounded-full ring-1 ring-black/5">
          <Image src={user.avatar} alt="" fill sizes="36px" className="object-cover" />
        </Link>
      </div>
    </header>
  );
}

/* ---------------------------------------------------------- Surface card */

function Surface({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div
      className={cn(
        "rounded-[26px] border border-white/80 bg-white/70 shadow-[0_1px_2px_rgba(16,24,40,0.03),0_12px_32px_-18px_rgba(16,24,40,0.12)] backdrop-blur-xl",
        className,
      )}
    >
      {children}
    </div>
  );
}

function SectionHead({ title, href, action = "すべて見る", aside }: { title: string; href?: string; action?: string; aside?: React.ReactNode }) {
  return (
    <div className="mb-3 flex items-baseline justify-between px-1">
      <h2 className="text-[15px] font-medium tracking-[0.01em]">{title}</h2>
      {aside}
      {href && (
        <Link href={href} className="flex items-center text-[11.5px] text-ink-muted transition-colors hover:text-ink-soft">
          {action}
          <ChevronRight className="size-3.5" />
        </Link>
      )}
    </div>
  );
}

/* ----------------------------------------------------------- Beauty Score */

const metricIcons = { health: HeartPulse, damage: ShieldCheck, moisture: Droplet, color: Palette } as const;
const R = 52;
const C = 2 * Math.PI * R;

export function BeautyScore() {
  const { scrollRef } = useDevice();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { root: scrollRef, once: true });
  const v = useMotionValue(0);
  const text = useTransform(v, (x) => Math.round(x).toString());
  const offset = useTransform(v, (x) => C - (C * x) / 100);

  useEffect(() => {
    if (!inView) return;
    const c = animate(v, beautyScore.score, { duration: 1.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] });
    return () => c.stop();
  }, [inView, v]);

  return (
    <Reveal className="px-5">
      <Link href="/history?tab=data" className="block">
        <Surface className="p-5">
          <div ref={ref} className="flex items-center gap-5">
            <div className="shrink-0">
              <p className="mb-3 text-[13px] font-medium tracking-[0.01em]">Beauty Score</p>
              <div className="relative size-[124px]">
                <svg viewBox="0 0 124 124" className="size-full -rotate-90">
                  <defs>
                    <linearGradient id="bs-ring" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#c9b8ff" />
                      <stop offset="100%" stopColor="#8fb2ff" />
                    </linearGradient>
                  </defs>
                  <circle cx="62" cy="62" r={R} fill="none" stroke="rgba(16,24,40,0.05)" strokeWidth="6" />
                  <motion.circle cx="62" cy="62" r={R} fill="none" stroke="url(#bs-ring)" strokeWidth="6" strokeLinecap="round" strokeDasharray={C} style={{ strokeDashoffset: offset }} />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <motion.span className="text-[40px] font-light leading-none tabular-nums tracking-[-0.03em]">{text}</motion.span>
                  <span className="mt-1 text-[11px] tabular-nums text-ink-muted">/100</span>
                </div>
              </div>
            </div>

            <ul className="min-w-0 flex-1 space-y-3.5 border-l border-hairline pl-5">
              {beautyScore.metrics.map((m, i) => {
                const Icon = metricIcons[m.key as keyof typeof metricIcons];
                // damage is "lower is better": fill shows health, not the raw number
                const fill = m.key === "damage" ? 100 - m.value : m.value;
                return (
                  <li key={m.key}>
                    <div className="flex items-center gap-2">
                      <Icon className="size-[15px] shrink-0 text-ink-soft" strokeWidth={1.4} />
                      <span className="flex-1 truncate text-[12px] text-ink-soft">{m.label}</span>
                      <span className="text-[13px] tabular-nums">
                        {m.value}
                        <span className="text-[10px] text-ink-muted">{m.unit}</span>
                      </span>
                    </div>
                    <div className="ml-[23px] mt-1.5 h-[3px] overflow-hidden rounded-full bg-ink/[0.05]">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={inView ? { width: `${fill}%` } : undefined}
                        transition={{ duration: 1.2, delay: 0.35 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                        className="h-full rounded-full bg-[linear-gradient(90deg,#c9b8ff,#8fb2ff)]"
                      />
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </Surface>
      </Link>
    </Reveal>
  );
}

/* ------------------------------------------------------------ AI Concierge */

export function AiConcierge() {
  return (
    <Reveal className="px-5">
      <SectionHead title="AI Concierge" />
      <Link href="/ai" className="group block">
        <Surface className="relative overflow-hidden p-5 transition-shadow duration-500 group-hover:shadow-[0_18px_40px_-20px_rgba(90,90,200,0.35)]">
          <div className="pointer-events-none absolute -right-16 -top-16 size-44 rounded-full bg-[#e9e2ff] opacity-70 blur-3xl" />
          <div className="relative flex items-start gap-4">
            <GlowOrb className="size-11 shrink-0" />
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline gap-2">
                <p className="text-[15px] font-medium tracking-[0.12em]">MIRA</p>
                <p className="text-[11px] text-ink-muted">あなた専属の美容AI</p>
              </div>
              <p className="font-jp mt-2 text-[13.5px] leading-[1.75] text-ink/85">
                今日は湿度が高いため、
                <br />
                軽めのオイルがおすすめです。
              </p>
              <p className="font-jp mt-1.5 line-clamp-2 text-[11.5px] leading-[1.7] text-ink-muted">{aiAdvice.body}</p>
            </div>
            <div className="relative -mr-1 hidden h-[72px] w-[58px] shrink-0 overflow-hidden rounded-[14px] min-[360px]:block">
              <ProductVisual kind="oil" />
            </div>
          </div>
          <div className="relative mt-4 flex items-center justify-between rounded-full bg-ink/[0.03] py-2 pl-4 pr-2 text-[12px] text-ink-muted">
            MIRA に相談する…
            <span className="grid size-7 place-items-center rounded-full bg-white shadow-[0_1px_2px_rgba(16,24,40,0.08)] transition-transform duration-500 group-hover:translate-x-0.5">
              <ChevronRight className="size-3.5 text-ink" />
            </span>
          </div>
        </Surface>
      </Link>
    </Reveal>
  );
}

/* --------------------------------------------------------- Beauty Timeline */

export function BeautyTimeline() {
  const [open, setOpen] = useState<number | null>(null);
  const [seen, setSeen] = useState<Set<string>>(new Set());

  return (
    <Reveal>
      <div className="px-5">
        <SectionHead title="Beauty Timeline" href="/history" />
      </div>
      <div className="no-scrollbar flex snap-x scroll-px-5 gap-2.5 overflow-x-auto px-5 pb-1">
        {timeline.map((t, i) => (
          <motion.button
            key={t.id}
            whileTap={{ scale: 0.96 }}
            onClick={() => {
              setOpen(i);
              setSeen((s) => new Set(s).add(t.id));
            }}
            className="relative shrink-0 snap-start rounded-[23px] p-[2.5px]"
            aria-label={`${t.date} ${t.menu}のストーリー`}
          >
            {/* story ring: unseen = spectral, seen = hairline */}
            <span
              className={cn(
                "absolute inset-0 rounded-[23px] transition-opacity duration-500",
                seen.has(t.id) ? "bg-ink/[0.06]" : "bg-[conic-gradient(from_200deg,#c9b8ff,#8fb2ff,#9ee6e0,#ffd0b0,#f3b4e4,#c9b8ff)]",
              )}
            />
            <span className="relative block h-[140px] w-[104px] overflow-hidden rounded-[20.5px] ring-[1.5px] ring-canvas">
              <Image src={t.image} alt="" fill sizes="104px" className="object-cover" />
              <span className="absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-[#1b1f2e]/70 via-[#1b1f2e]/25 to-transparent" />
              <span className="absolute inset-x-2.5 bottom-2.5 text-left text-white">
                <span className="block text-[9.5px] tabular-nums tracking-[0.04em] text-white/75">{t.date}</span>
                <span className="block text-[14px] font-medium tracking-[0.01em]">{t.en}</span>
              </span>
            </span>
          </motion.button>
        ))}
      </div>
      {open !== null && <StoryViewer start={open} onClose={() => setOpen(null)} />}
    </Reveal>
  );
}

/* -------------------------------------------------------- Next Appointment */

const WEEKDAY = ["日", "月", "火", "水", "木", "金", "土"];

export function NextAppointment() {
  const { state } = useAgent();
  const r = state.reservation;

  if (!r) {
    return (
      <Reveal className="px-5">
        <SectionHead title="Next Appointment" />
        <Surface className="flex items-center gap-4 p-5">
          <CalendarDays className="size-5 text-ink-muted" strokeWidth={1.4} />
          <p className="flex-1 text-[13px] text-ink-soft">予約はありません</p>
          <Link href="/salon" className="rounded-full bg-ink px-4 py-2 text-[12px] text-white">
            サロンを探す
          </Link>
        </Surface>
      </Reveal>
    );
  }

  const [y, mo, d] = r.date.split(".").map(Number);
  const date = new Date(y, mo - 1, d);
  const days = Math.max(0, Math.ceil((date.getTime() - new Date().setHours(0, 0, 0, 0)) / 86400000));
  const [hh, mm] = r.time.split(":").map(Number);
  const end = `${String(hh + 2).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
  const salon = salons.find((s) => s.id === r.salonId);

  return (
    <Reveal className="px-5">
      <SectionHead title="Next Appointment" aside={<span className="text-[11.5px] tabular-nums text-ink-muted">あと{days}日</span>} />
      <Link href="/salon" className="group block">
        <Surface className="flex items-stretch gap-4 p-4">
          {/* Apple Calendar-style date tile */}
          <div className="flex w-[56px] shrink-0 flex-col items-center justify-center rounded-[16px] bg-white py-2 shadow-[0_1px_2px_rgba(16,24,40,0.06)]">
            <span className="text-[10.5px] font-medium tracking-[0.02em] text-[#e5484d]">
              {mo}月 {WEEKDAY[date.getDay()]}
            </span>
            <span className="text-[28px] font-light leading-none tabular-nums tracking-[-0.02em]">{d}</span>
          </div>
          <div className="flex min-w-0 flex-1 flex-col justify-center border-l-[3px] border-[#b9a8ff] pl-3">
            <p className="truncate text-[15px] font-medium">{r.salon}</p>
            <p className="mt-0.5 text-[12px] tabular-nums text-ink-soft">
              {r.time} – {end}
            </p>
            <p className="font-jp mt-1 truncate text-[11.5px] text-ink-muted">{r.menu}</p>
          </div>
          <div className="relative w-[92px] shrink-0 overflow-hidden rounded-[16px]">
            <Image
              src={r.salonId === "luce" || !salon ? "/images/salon-interior.webp" : salon.image}
              alt=""
              fill
              sizes="92px"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>
        </Surface>
      </Link>
    </Reveal>
  );
}

/* ------------------------------------------------------------- Recommended */

export function Recommended() {
  const { state, dispatch } = useAgent();
  const inCart = new Set(state.cart.map((c) => c.productId));

  return (
    <Reveal>
      <div className="px-5">
        <SectionHead title="Recommended for You" href="/ai" action="もっと見る" />
      </div>
      <div className="no-scrollbar flex snap-x scroll-px-5 gap-2.5 overflow-x-auto px-5 pb-2">
        {products.slice(0, 4).map((p) => (
          <div key={p.id} className="w-[124px] shrink-0 snap-start">
            <Surface className="overflow-hidden p-1.5">
              <div className="relative aspect-square overflow-hidden rounded-[20px]">
                <ProductVisual kind={p.kind} />
                <button
                  onClick={() => !inCart.has(p.id) && dispatch({ t: "apply", action: { type: "add_to_cart", productId: p.id } })}
                  aria-label={inCart.has(p.id) ? "カートに追加済み" : `${p.name}をカートに追加`}
                  className={cn(
                    "absolute bottom-1.5 right-1.5 grid size-7 place-items-center rounded-full text-[15px] leading-none shadow-[0_2px_6px_rgba(16,24,40,0.12)] transition-colors",
                    inCart.has(p.id) ? "bg-[#e3f6ec] text-[#1f7a4d]" : "bg-white/90 text-ink",
                  )}
                >
                  {inCart.has(p.id) ? "✓" : "+"}
                </button>
              </div>
              <div className="px-1.5 pb-1.5 pt-2">
                <p className="font-jp truncate text-[12px]">{p.name}</p>
                <p className="font-jp mt-0.5 truncate text-[10px] text-[#7a6bd0]">{p.reason}</p>
                <p className="mt-1 text-[12px] tabular-nums text-ink-soft">{yen(p.price)}</p>
              </div>
            </Surface>
          </div>
        ))}
        <Link href="/ai" className="w-[124px] shrink-0 snap-start">
          <div className="flex h-full flex-col justify-between rounded-[26px] bg-[linear-gradient(150deg,#eef1ff,#f5eeff)] p-4">
            <GlowOrb className="size-7" />
            <p className="font-jp text-[12px] leading-[1.7] text-ink-soft">
              あなたに合った
              <br />
              アイテムを
              <br />
              AIが提案します
            </p>
            <ChevronRight className="size-4 self-end text-ink-muted" />
          </div>
        </Link>
      </div>
    </Reveal>
  );
}
