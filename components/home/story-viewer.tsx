"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronRight, X } from "lucide-react";
import { DeviceOverlay } from "@/components/shell/device-context";
import { timeline } from "@/lib/data";

const DURATION = 5000;

/** Instagram-style viewer for the Beauty Timeline. Tap left/right to step, auto-advances. */
export function StoryViewer({ start, onClose }: { start: number; onClose: () => void }) {
  const [index, setIndex] = useState(start);
  const story = timeline[index];

  useEffect(() => {
    const t = setTimeout(() => (index < timeline.length - 1 ? setIndex(index + 1) : onClose()), DURATION);
    return () => clearTimeout(t);
  }, [index, onClose]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") setIndex((i) => Math.min(timeline.length - 1, i + 1));
      if (e.key === "ArrowLeft") setIndex((i) => Math.max(0, i - 1));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <DeviceOverlay>
      <motion.div
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-0 z-[65] overflow-hidden bg-[#0d0f16] text-white"
        role="dialog"
        aria-modal
        aria-label="Beauty Timeline"
      >
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div key={story.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }} className="absolute inset-0">
            <Image src={story.image} alt="" fill sizes="402px" className="scale-110 object-cover opacity-60 blur-2xl" />
            <div className="absolute inset-x-0 top-[20%] mx-auto aspect-[4/3] w-[78%] overflow-hidden rounded-[26px] shadow-[0_30px_60px_-20px_rgba(0,0,0,0.6)]">
              <Image src={story.image} alt={`${story.menu}の仕上がり`} fill sizes="360px" className="object-cover object-top" />
              <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/40 to-transparent" />
            </div>
          </motion.div>
        </AnimatePresence>

        {/* progress */}
        <div className="absolute inset-x-4 top-[max(env(safe-area-inset-top),12px)] z-10 flex gap-1 lg:top-[56px]">
          {timeline.map((t, i) => (
            <span key={t.id} className="h-[2.5px] flex-1 overflow-hidden rounded-full bg-white/25">
              {i < index && <span className="block h-full w-full bg-white" />}
              {i === index && (
                <motion.span
                  key={t.id}
                  className="block h-full bg-white"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: DURATION / 1000, ease: "linear" }}
                />
              )}
            </span>
          ))}
        </div>

        <div className="absolute inset-x-4 top-[calc(max(env(safe-area-inset-top),12px)+14px)] z-10 flex items-center justify-between lg:top-[70px]">
          <div className="leading-tight">
            <p className="text-[13px] font-medium">{story.salon}</p>
            <p className="text-[11px] tabular-nums text-white/60">
              {story.date} · 担当 {story.stylist}
            </p>
          </div>
          <button onClick={onClose} aria-label="閉じる" className="grid size-9 place-items-center rounded-full bg-white/10 backdrop-blur">
            <X className="size-[18px]" strokeWidth={1.6} />
          </button>
        </div>

        {/* tap zones */}
        <button
          aria-label="前へ"
          className="absolute bottom-40 left-0 top-24 w-1/3"
          onClick={() => setIndex((i) => Math.max(0, i - 1))}
        />
        <button
          aria-label="次へ"
          className="absolute bottom-40 right-0 top-24 w-2/3"
          onClick={() => (index < timeline.length - 1 ? setIndex(index + 1) : onClose())}
        />

        <motion.div key={`info-${story.id}`} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="absolute inset-x-5 bottom-[max(env(safe-area-inset-bottom),20px)] z-10 lg:bottom-9">
          <p className="text-[11px] tracking-[0.2em] text-white/55">{story.en.toUpperCase()}</p>
          <p className="font-jp mt-1 text-[24px] font-light">{story.menu}</p>
          <p className="font-jp mt-2 text-[12.5px] text-white/75">{story.detail}</p>
          <p className="font-jp mt-1 text-[12.5px] text-white/60">{story.note}</p>
          <Link href="/history" className="mt-4 flex w-fit items-center gap-1 rounded-full bg-white/12 px-4 py-2 text-[12px] backdrop-blur">
            カルテで詳しく見る
            <ChevronRight className="size-3.5" />
          </Link>
        </motion.div>
      </motion.div>
    </DeviceOverlay>
  );
}
