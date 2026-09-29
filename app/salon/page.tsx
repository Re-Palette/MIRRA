"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { LoaderCircle, LocateFixed, MapPin, Search, SlidersHorizontal, Sparkles, Star, X } from "lucide-react";
import { salonFilters, salons, type Salon } from "@/lib/data";
import { ScreenHeader } from "@/components/ui/screen-header";
import { Reveal } from "@/components/ui/motion";
import { Badge } from "@/components/ui/badge";
import { SalonDetail } from "@/components/salon/salon-detail";
import { cn } from "@/lib/utils";

type LocState = "idle" | "loading" | "done";

export default function SalonPage() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState(salonFilters[0]);
  const [loc, setLoc] = useState<LocState>("idle");
  const [selected, setSelected] = useState<Salon | null>(null);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return salons.filter((s) => {
      const byFilter = filter === "すべて" || s.specialties.includes(filter);
      const byQuery = !q || `${s.name} ${s.area} ${s.specialties.join(" ")}`.toLowerCase().includes(q);
      return byFilter && byQuery;
    });
  }, [query, filter]);

  const locate = () => {
    if (loc === "loading") return;
    setLoc("loading");
    setTimeout(() => setLoc("done"), 1400);
  };

  return (
    <LayoutGroup>
      <main className="pb-36">
        <ScreenHeader
          eyebrow="SALON MATCHING"
          title="サロンを探す"
          action={
            <motion.button whileTap={{ scale: 0.9 }} onClick={locate} aria-label="現在地を取得" className="glass grid size-10 place-items-center rounded-full">
              {loc === "loading" ? (
                <LoaderCircle className="size-[18px] animate-spin" strokeWidth={1.5} />
              ) : (
                <LocateFixed className={cn("size-[18px]", loc === "done" && "text-[#4f63d9]")} strokeWidth={1.5} />
              )}
            </motion.button>
          }
        />

        <div className="px-5">
          <div className="glass flex h-[52px] items-center gap-3 rounded-full pl-5 pr-1.5">
            <Search className="size-[18px] text-ink-muted" strokeWidth={1.5} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="サロン名・エリア・メニューで検索"
              aria-label="サロンを検索"
              className="font-jp h-full min-w-0 flex-1 bg-transparent text-[13px] outline-none placeholder:text-ink-muted"
            />
            <AnimatePresence>
              {query && (
                <motion.button
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  onClick={() => setQuery("")}
                  aria-label="検索をクリア"
                  className="grid size-6 place-items-center rounded-full bg-ink/10"
                >
                  <X className="size-3" />
                </motion.button>
              )}
            </AnimatePresence>
            <button aria-label="絞り込み" className="grid size-10 place-items-center rounded-full bg-ink text-white">
              <SlidersHorizontal className="size-4" strokeWidth={1.6} />
            </button>
          </div>

          <button onClick={locate} className="mt-3 flex items-center gap-1.5 px-2 text-[11.5px] text-ink-soft">
            <MapPin className="size-3.5" strokeWidth={1.6} />
            <AnimatePresence mode="wait" initial={false}>
              <motion.span key={loc} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} className="font-jp">
                {loc === "idle" && "現在地を取得して近くのサロンを表示"}
                {loc === "loading" && "現在地を取得中…"}
                {loc === "done" && "渋谷区神南1丁目 周辺 · 半径5km"}
              </motion.span>
            </AnimatePresence>
          </button>
        </div>

        {/* AI banner */}
        <Reveal className="mt-5 px-4">
          <div className="relative overflow-hidden rounded-card bg-ink p-5 text-white">
            <div className="absolute -right-10 -top-16 size-48 rounded-full bg-[#7f8cff]/40 blur-3xl" />
            <div className="absolute -bottom-16 left-10 size-40 rounded-full bg-[#e0a3ff]/25 blur-3xl" />
            <div className="relative flex items-center gap-4">
              <div className="flex-1">
                <p className="flex items-center gap-1.5 text-[10px] tracking-[0.3em] text-white/50">
                  <Sparkles className="size-3" />
                  AI MATCHING
                </p>
                <p className="font-jp mt-2 text-[15px] leading-[1.7]">
                  あなたの髪質に最適な
                  <br />
                  スタイリストをご提案します。
                </p>
              </div>
              <div className="grid size-[68px] shrink-0 place-items-center rounded-full border border-white/15 bg-white/5 backdrop-blur">
                <div className="text-center leading-none">
                  <p className="font-display text-[26px] font-light tabular-nums">96</p>
                  <p className="mt-0.5 text-[8.5px] tracking-[0.2em] text-white/50">MATCH</p>
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Filters */}
        <div className="no-scrollbar mt-5 flex gap-2 overflow-x-auto px-5 pb-1">
          {salonFilters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn("relative shrink-0 rounded-full px-4 py-2 text-[12px] transition-colors", filter === f ? "text-white" : "bg-white/70 text-ink-soft")}
            >
              {filter === f && <motion.span layoutId="salon-filter" className="absolute inset-0 rounded-full bg-ink" />}
              <span className="font-jp relative">{f}</span>
            </button>
          ))}
        </div>

        <div className="mt-5 px-4">
          <p className="mb-3 px-1 text-[11px] text-ink-muted">
            おすすめ順 · <span className="tabular-nums">{results.length}</span>件
          </p>
          <motion.ul layout className="space-y-3">
            <AnimatePresence mode="popLayout">
              {results.map((s, i) => (
                <motion.li
                  key={s.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.5, delay: i * 0.04, ease: [0.22, 1, 0.36, 1] }}
                >
                  <SalonCard salon={s} onOpen={() => setSelected(s)} hidden={selected?.id === s.id} />
                </motion.li>
              ))}
            </AnimatePresence>
          </motion.ul>
          {results.length === 0 && (
            <p className="font-jp py-16 text-center text-[13px] text-ink-muted">条件に合うサロンが見つかりませんでした</p>
          )}
        </div>

        <AnimatePresence>{selected && <SalonDetail salon={selected} onClose={() => setSelected(null)} />}</AnimatePresence>
      </main>
    </LayoutGroup>
  );
}

function SalonCard({ salon, onOpen, hidden }: { salon: Salon; onOpen: () => void; hidden: boolean }) {
  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      onClick={onOpen}
      className="glass flex w-full gap-4 rounded-card p-3 text-left transition-shadow hover:shadow-float"
    >
      <div className="relative h-[124px] w-[104px] shrink-0">
        {!hidden && (
          <motion.div layoutId={`salon-img-${salon.id}`} className="absolute inset-0 overflow-hidden rounded-[20px]">
            <Image src={salon.image} alt={salon.name} fill sizes="104px" className="object-cover" />
          </motion.div>
        )}
      </div>
      <div className="flex min-w-0 flex-1 flex-col py-1 pr-1">
        <div className="flex items-start justify-between gap-2">
          <motion.p layoutId={`salon-name-${salon.id}`} className="truncate text-[15px] tracking-[0.04em]">
            {salon.name}
            <span className="font-jp ml-1.5 text-[11px] text-ink-muted">{salon.area}</span>
          </motion.p>
          <Badge variant="lilac" className="shrink-0 tabular-nums">
            {salon.match}%
          </Badge>
        </div>
        <div className="mt-1.5 flex items-center gap-3 text-[11px] text-ink-soft">
          <span className="flex items-center gap-1">
            <Star className="size-3 fill-[#f5b94a] text-[#f5b94a]" />
            <span className="tabular-nums">{salon.rating}</span>
            <span className="text-ink-muted">({salon.reviews})</span>
          </span>
          <span className="flex items-center gap-1 tabular-nums">
            <MapPin className="size-3" />
            {salon.distance}
          </span>
        </div>
        <div className="mt-2.5 flex flex-wrap gap-1">
          {salon.specialties.map((t) => (
            <span key={t} className="font-jp rounded-full border border-ink/10 px-2 py-0.5 text-[10px] text-ink-soft">
              {t}
            </span>
          ))}
        </div>
        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="text-[11px] text-ink-muted">{salon.price}</span>
          <span className="font-jp rounded-full bg-ink px-3.5 py-1.5 text-[10.5px] text-white">詳細を見る</span>
        </div>
      </div>
    </motion.button>
  );
}
