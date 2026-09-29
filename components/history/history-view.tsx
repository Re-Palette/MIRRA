"use client";

import Image from "next/image";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bookmark, ChevronDown, FileText, Heart, MessageCircle, MoreHorizontal, Scissors } from "lucide-react";
import { history, type HistoryEntry } from "@/lib/data";
import { ScreenHeader } from "@/components/ui/screen-header";
import { Reveal } from "@/components/ui/motion";
import { Badge } from "@/components/ui/badge";
import { PhotoCarousel } from "./photo-carousel";
import { HairDataPanel } from "./hair-data";
import { cn } from "@/lib/utils";

type Tab = "records" | "data";

export function HistoryView({ initialTab }: { initialTab: Tab }) {
  const [tab, setTab] = useState<Tab>(initialTab);

  return (
    <main className="pb-36">
      <ScreenHeader
        eyebrow="HAIR HISTORY"
        title="カルテ"
        action={
          <button aria-label="カルテを出力" className="glass grid size-10 place-items-center rounded-full">
            <FileText className="size-[18px]" strokeWidth={1.5} />
          </button>
        }
      />

      <div className="px-5">
        <div className="glass relative grid grid-cols-2 rounded-full p-1" role="tablist">
          {(
            [
              ["records", "施術履歴"],
              ["data", "髪質データ"],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              role="tab"
              aria-selected={tab === key}
              onClick={() => setTab(key)}
              className="relative h-10 rounded-full text-[12.5px] tracking-[0.06em]"
            >
              {tab === key && (
                <motion.span layoutId="history-tab" className="absolute inset-0 rounded-full bg-[linear-gradient(120deg,#dde8ff,#ece6ff)] shadow-soft" />
              )}
              <span className={cn("font-jp relative transition-colors", tab === key ? "text-ink" : "text-ink-muted")}>{label}</span>
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {tab === "records" ? (
          <motion.div
            key="records"
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.35 }}
          >
            <div className="flex items-center justify-between px-6 pb-2 pt-6">
              <button className="flex items-center gap-1 rounded-full border border-ink/10 bg-white/70 px-3.5 py-1.5 text-[12px] tabular-nums">
                2026年
                <ChevronDown className="size-3.5" />
              </button>
              <span className="text-[11px] text-ink-muted">{history.length}件の記録</span>
            </div>
            <ol className="relative mt-2">
              <span aria-hidden className="absolute bottom-10 left-[31px] top-3 w-px bg-gradient-to-b from-ink/15 via-ink/10 to-transparent" />
              {history.map((entry, i) => (
                <TimelineItem key={entry.id} entry={entry} index={i} />
              ))}
            </ol>
          </motion.div>
        ) : (
          <motion.div
            key="data"
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 16 }}
            transition={{ duration: 0.35 }}
          >
            <HairDataPanel />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

function TimelineItem({ entry, index }: { entry: HistoryEntry; index: number }) {
  const [liked, setLiked] = useState(!!entry.liked);
  const [saved, setSaved] = useState(false);
  const [burst, setBurst] = useState(0);

  const like = () => {
    setLiked((l) => !l);
    if (!liked) setBurst((b) => b + 1);
  };

  return (
    <li className="relative pb-8 pl-[52px] pr-5">
      {/* node */}
      <span className="absolute left-[25px] top-[5px] grid size-[13px] place-items-center rounded-full bg-canvas">
        <span className={cn("size-[9px] rounded-full ring-[3px]", index === 0 ? "bg-ink ring-accent" : "bg-white ring-ink/15")} />
      </span>
      <Reveal delay={index === 0 ? 0.1 : 0}>
        <p className="mb-3 flex items-baseline gap-2">
          <span className="text-[15px] tabular-nums tracking-[0.06em]">{entry.date}</span>
          <span className="font-jp text-[11px] text-ink-muted">（{entry.weekday}）</span>
        </p>

        <article className="glass overflow-hidden rounded-card">
          <header className="flex items-center gap-3 px-4 py-3">
            <span className="grid size-9 place-items-center rounded-full bg-[conic-gradient(from_180deg,#dde8ff,#f6e8ff,#dde8ff)] p-[1.5px]">
              <span className="grid size-full place-items-center rounded-full bg-white">
                <Scissors className="size-4 text-ink" strokeWidth={1.5} />
              </span>
            </span>
            <div className="min-w-0 flex-1 leading-tight">
              <p className="truncate text-[13px]">{entry.salon}</p>
              <p className="font-jp text-[11px] text-ink-muted">担当：{entry.stylist}</p>
            </div>
            <button aria-label="その他" className="grid size-8 place-items-center rounded-full text-ink-muted hover:bg-ink/5">
              <MoreHorizontal className="size-4" />
            </button>
          </header>

          <div className="relative" onDoubleClick={() => !liked && like()}>
            <PhotoCarousel photos={entry.photos} alt={`${entry.menu}の仕上がり`} />
            <AnimatePresence>
              {burst > 0 && (
                <motion.span
                  key={burst}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: [0, 1.25, 1], opacity: [0, 1, 0] }}
                  transition={{ duration: 0.9, times: [0, 0.4, 1] }}
                  className="pointer-events-none absolute inset-0 grid place-items-center"
                >
                  <Heart className="size-20 fill-white text-white drop-shadow-[0_6px_20px_rgba(0,0,0,0.25)]" />
                </motion.span>
              )}
            </AnimatePresence>
          </div>

          <div className="flex items-center gap-1 px-2.5 pt-2">
            <motion.button whileTap={{ scale: 0.8 }} onClick={like} aria-label="いいね" aria-pressed={liked} className="grid size-10 place-items-center">
              <motion.span animate={liked ? { scale: [1, 1.3, 1] } : { scale: 1 }} transition={{ duration: 0.35 }}>
                <Heart className={cn("size-[22px] transition-colors", liked ? "fill-[#ff5d7a] text-[#ff5d7a]" : "text-ink")} strokeWidth={1.5} />
              </motion.span>
            </motion.button>
            <button aria-label="コメント" className="grid size-10 place-items-center">
              <MessageCircle className="size-[21px]" strokeWidth={1.5} />
            </button>
            <motion.button
              whileTap={{ scale: 0.8 }}
              onClick={() => setSaved((s) => !s)}
              aria-label="保存"
              aria-pressed={saved}
              className="ml-auto grid size-10 place-items-center"
            >
              <Bookmark className={cn("size-[21px] transition-colors", saved && "fill-ink")} strokeWidth={1.5} />
            </motion.button>
          </div>

          <div className="px-4 pb-4">
            <div className="flex items-center gap-2">
              <h3 className="font-jp text-[16px] font-medium tracking-[0.04em]">{entry.menu}</h3>
              <span className="text-[10px] tracking-[0.2em] text-ink-muted">{entry.menuEn.toUpperCase()}</span>
            </div>

            <dl className="mt-3 grid grid-cols-4 gap-1.5">
              {entry.recipe.map((r) => (
                <div key={r.label} className="rounded-[14px] bg-[linear-gradient(160deg,rgba(221,232,255,0.7),rgba(246,232,255,0.5))] px-2 py-2 text-center">
                  <dt className="font-jp text-[9.5px] text-ink-muted">{r.label}</dt>
                  <dd className="font-jp mt-0.5 truncate text-[12px] tabular-nums">{r.value}</dd>
                </div>
              ))}
            </dl>

            <p className="font-jp mt-3 text-[12px] font-light leading-[1.8] text-ink-soft">{entry.memo}</p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {entry.tags.map((t) => (
                <Badge key={t} variant={t.length % 2 ? "lilac" : "default"}>
                  #{t}
                </Badge>
              ))}
            </div>
          </div>
        </article>
      </Reveal>
    </li>
  );
}
