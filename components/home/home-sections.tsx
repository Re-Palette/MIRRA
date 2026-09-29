"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, CalendarPlus, Check, Clock, MapPin, Plus, Sparkles } from "lucide-react";
import { aiAdvice, history, nextReservation, products } from "@/lib/data";
import { Reveal } from "@/components/ui/motion";
import { SectionTitle } from "@/components/ui/screen-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProductVisual } from "@/components/ui/product-visual";
import { cn, yen } from "@/lib/utils";

export function AdviceCard() {
  return (
    <Reveal className="px-4">
      <Link href="/ai" className="group relative block overflow-hidden rounded-card p-5 shadow-soft">
        <div className="absolute inset-0 bg-[linear-gradient(125deg,#dde8ff_0%,#eef0ff_45%,#f6e8ff_100%)]" />
        <motion.div
          aria-hidden
          className="absolute -right-10 -top-10 size-40 rounded-full bg-white/60 blur-2xl"
          animate={{ x: [0, -20, 0], y: [0, 12, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="grid size-7 place-items-center rounded-full bg-ink text-white">
                <Sparkles className="size-3.5" strokeWidth={1.8} />
              </span>
              <span className="text-[10.5px] tracking-[0.28em] text-ink/60">TODAY&apos;S AI ADVICE</span>
            </div>
            <ArrowUpRight className="size-4 text-ink/50 transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </div>
          <p className="font-jp mt-4 text-[17px] font-normal leading-[1.6] tracking-[0.04em] text-balance">「{aiAdvice.headline}」</p>
          <p className="font-jp mt-2.5 text-[12px] font-light leading-[1.85] text-ink/65">{aiAdvice.body}</p>
          <div className="mt-4 flex items-center gap-2 text-[11.5px] text-ink/70">
            <span className="rounded-full bg-white/70 px-3 py-1.5 backdrop-blur">MIRRA AI に相談する</span>
          </div>
        </div>
      </Link>
    </Reveal>
  );
}

export function ProductRail() {
  const [added, setAdded] = useState<Record<string, boolean>>({});
  return (
    <Reveal>
      <SectionTitle
        en="RECOMMENDED FOR YOU"
        title="あなたへのおすすめ"
        action={<span className="text-[11px] text-ink-muted">AI選定</span>}
      />
      <div className="no-scrollbar flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth px-4 pb-2">
        {products.map((p, i) => (
          <motion.article
            key={p.id}
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
            className="glass w-[168px] shrink-0 snap-start overflow-hidden rounded-[24px] p-2.5 first:ml-0"
          >
            <div className="relative aspect-[4/5] overflow-hidden rounded-[18px] bg-[#f1f0ee]">
              <ProductVisual kind={p.kind} />
              <Badge variant="glass" className="absolute left-2 top-2 text-[9.5px]">
                Match {p.match}%
              </Badge>
            </div>
            <div className="px-1.5 pb-1 pt-3">
              <p className="text-[9.5px] tracking-[0.2em] text-ink-muted">{p.brand}</p>
              <p className="font-jp mt-0.5 truncate text-[12.5px]">{p.name}</p>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-[13px] tabular-nums">{yen(p.price)}</span>
                <motion.button
                  whileTap={{ scale: 0.85 }}
                  onClick={() => setAdded((a) => ({ ...a, [p.id]: !a[p.id] }))}
                  aria-label={added[p.id] ? "カートから削除" : "カートに追加"}
                  className={cn(
                    "grid size-8 place-items-center rounded-full transition-colors duration-300",
                    added[p.id] ? "bg-[#e3f6ec] text-[#1f7a4d]" : "bg-ink text-white",
                  )}
                >
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.span
                      key={added[p.id] ? "c" : "p"}
                      initial={{ scale: 0.4, opacity: 0, rotate: -45 }}
                      animate={{ scale: 1, opacity: 1, rotate: 0 }}
                      exit={{ scale: 0.4, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      {added[p.id] ? <Check className="size-4" strokeWidth={2} /> : <Plus className="size-4" strokeWidth={1.8} />}
                    </motion.span>
                  </AnimatePresence>
                </motion.button>
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </Reveal>
  );
}

export function ReservationCard() {
  const r = nextReservation;
  const [saved, setSaved] = useState(false);
  return (
    <Reveal>
      <SectionTitle en="NEXT APPOINTMENT" title="次回のご予約" />
      <div className="px-4">
        <div className="relative overflow-hidden rounded-card bg-ink p-5 text-white shadow-float">
          <div className="pointer-events-none absolute -right-20 -top-24 size-64 rounded-full bg-[#5b6cff]/30 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-28 left-10 size-64 rounded-full bg-[#d59bff]/20 blur-3xl" />
          <div className="relative flex items-start justify-between">
            <div>
              <p className="text-[10px] tracking-[0.3em] text-white/45">{r.weekday.toUpperCase()}</p>
              <p className="font-display mt-1 text-[40px] font-light leading-none tabular-nums">
                {r.date.slice(5).replace(".", ".")}
                <span className="ml-2 text-[22px] text-white/70">{r.time}</span>
              </p>
            </div>
            <div className="rounded-[16px] border border-white/10 bg-white/5 px-3 py-2 text-center backdrop-blur">
              <p className="text-[9px] tracking-[0.2em] text-white/50">あと</p>
              <p className="text-[20px] leading-tight tabular-nums">
                {r.daysLeft}
                <span className="ml-0.5 text-[10px] text-white/60">日</span>
              </p>
            </div>
          </div>

          <div className="relative mt-5 flex items-center gap-3 rounded-[20px] bg-white/[0.06] p-2.5">
            <div className="relative size-14 shrink-0 overflow-hidden rounded-[14px]">
              <Image src={r.image} alt="" fill sizes="56px" className="object-cover" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[14px]">{r.salon}</p>
              <p className="font-jp mt-0.5 text-[11px] text-white/55">担当：{r.stylist}</p>
              <div className="mt-1 flex items-center gap-3 text-[10.5px] text-white/55">
                <span className="flex items-center gap-1">
                  <Clock className="size-3" />
                  {r.duration}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="size-3" />
                  1.2 km
                </span>
              </div>
            </div>
          </div>
          <p className="font-jp relative mt-3 text-[12px] text-white/70">{r.menu}</p>

          <div className="relative mt-4 grid grid-cols-2 gap-2">
            <Button variant="light" size="sm" asChild>
              <Link href="/salon">予約詳細</Link>
            </Button>
            <Button
              size="sm"
              onClick={() => setSaved(true)}
              className={cn("border border-white/15 bg-white/5 shadow-none hover:bg-white/10", saved && "text-[#9fe3bf]")}
            >
              {saved ? <Check className="size-3.5" /> : <CalendarPlus className="size-3.5" />}
              {saved ? "追加しました" : "カレンダー"}
            </Button>
          </div>
        </div>
      </div>
    </Reveal>
  );
}

export function HistoryPreview() {
  return (
    <Reveal>
      <SectionTitle
        en="HAIR HISTORY"
        title="最近の施術"
        action={
          <Link href="/history" className="text-[11px] text-ink-soft">
            すべて見る
          </Link>
        }
      />
      <div className="no-scrollbar flex gap-3 overflow-x-auto px-4 pb-1">
        {history.slice(0, 3).map((h) => (
          <Link key={h.id} href="/history" className="group relative h-[190px] w-[140px] shrink-0 overflow-hidden rounded-[24px]">
            <Image src={h.photos[0]} alt="" fill sizes="140px" className="object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/0 to-transparent" />
            <div className="absolute inset-x-3 bottom-3 text-white">
              <p className="text-[10px] tabular-nums tracking-[0.12em] text-white/70">{h.date}</p>
              <p className="font-jp mt-0.5 text-[13px]">{h.menu}</p>
            </div>
          </Link>
        ))}
      </div>
    </Reveal>
  );
}
