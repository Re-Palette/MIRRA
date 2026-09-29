"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronRight,
  FlaskConical,
  History,
  Info,
  Maximize2,
  RotateCw,
  Share,
  ShoppingBag,
  Sparkle,
  UserRound,
  Wallet,
  X,
} from "lucide-react";
import { MirraCard } from "@/components/card/mirra-card";
import { NfcPulse } from "@/components/card/nfc-pulse";
import { ScreenHeader } from "@/components/ui/screen-header";
import { DeviceOverlay } from "@/components/shell/device-context";
import { Wordmark } from "@/components/shell/logo";
import { Reveal } from "@/components/ui/motion";

const infoRows = [
  { icon: UserRound, label: "基本情報", href: "/profile" },
  { icon: Sparkle, label: "髪質・頭皮データ", href: "/history?tab=data" },
  { icon: History, label: "施術履歴", href: "/history" },
  { icon: FlaskConical, label: "薬剤履歴", href: "/history" },
  { icon: ShoppingBag, label: "購入履歴", href: "/profile" },
];

export default function CardPage() {
  const [flipped, setFlipped] = useState(false);
  const [full, setFull] = useState(false);
  const [walletAdded, setWalletAdded] = useState(false);

  return (
    <main className="relative min-h-full overflow-hidden pb-40 text-white">
      {/* ambient aurora */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[640px]">
        <div className="animate-drift absolute -left-24 top-10 size-80 rounded-full bg-[#4c64ff]/35 blur-[90px]" />
        <div className="animate-drift absolute -right-24 top-40 size-80 rounded-full bg-[#c07bff]/25 blur-[90px] [animation-delay:-8s]" />
        <div className="animate-drift absolute left-1/4 top-[340px] size-72 rounded-full bg-[#5fd4ff]/15 blur-[90px] [animation-delay:-4s]" />
      </div>

      <ScreenHeader
        dark
        eyebrow="DIGITAL MEMBERSHIP"
        title="MIRRA CARD"
        action={
          <button aria-label="カードについて" className="glass-dark grid size-10 place-items-center rounded-full">
            <Info className="size-[18px] text-white/80" strokeWidth={1.5} />
          </button>
        }
      />

      <section className="relative px-6 pt-2">
        <motion.div
          initial={{ opacity: 0, y: 40, rotateX: 30, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
          transition={{ duration: 1.3, ease: [0.22, 1, 0.36, 1] }}
          style={{ transformPerspective: 1200 }}
        >
          <MirraCard onFlip={setFlipped} />
        </motion.div>
        {/* floor reflection */}
        <motion.div
          aria-hidden
          animate={{ scaleX: [1, 0.9, 1], opacity: [0.55, 0.35, 0.55] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="mx-auto mt-5 h-6 w-[78%] rounded-[50%] bg-[radial-gradient(closest-side,rgba(120,140,255,0.55),transparent)] blur-md"
        />
        <div className="mt-1 flex items-center justify-center gap-1.5 text-[11px] tracking-[0.08em] text-white/45">
          <RotateCw className="size-3" />
          <AnimatePresence mode="wait" initial={false}>
            <motion.span key={String(flipped)} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}>
              {flipped ? "タップして表面に戻る" : "タップして裏面を表示"}
            </motion.span>
          </AnimatePresence>
        </div>
      </section>

      <Reveal className="mt-7 px-5">
        <NfcPulse />
      </Reveal>

      <Reveal className="mt-4 grid grid-cols-3 gap-2.5 px-5">
        <ActionButton icon={Wallet} label={walletAdded ? "追加済み" : "Wallet"} onClick={() => setWalletAdded(true)} active={walletAdded} />
        <ActionButton icon={Maximize2} label="全画面" onClick={() => setFull(true)} />
        <ActionButton icon={Share} label="共有" />
      </Reveal>

      <Reveal className="mt-9 px-5">
        <p className="mb-3 px-1 text-[10.5px] tracking-[0.3em] text-white/40">CARD INFORMATION</p>
        <div className="glass-dark overflow-hidden rounded-card">
          {infoRows.map((row, i) => (
            <Link
              key={row.label}
              href={row.href}
              className="group flex items-center gap-3.5 px-5 py-4 transition-colors hover:bg-white/[0.04]"
              style={{ borderTop: i ? "1px solid rgba(255,255,255,0.06)" : undefined }}
            >
              <span className="grid size-9 place-items-center rounded-[12px] bg-white/[0.07]">
                <row.icon className="size-[17px] text-white/80" strokeWidth={1.5} />
              </span>
              <span className="font-jp flex-1 text-[13.5px] text-white/90">{row.label}</span>
              <ChevronRight className="size-4 text-white/30 transition-transform group-hover:translate-x-0.5" />
            </Link>
          ))}
        </div>
      </Reveal>

      <AnimatePresence>{full && <FullscreenCard onClose={() => setFull(false)} />}</AnimatePresence>
    </main>
  );
}

function ActionButton({
  icon: Icon,
  label,
  onClick,
  active,
}: {
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  label: string;
  onClick?: () => void;
  active?: boolean;
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.94 }}
      onClick={onClick}
      className="glass-dark flex flex-col items-center gap-2 rounded-[22px] py-4 transition-colors hover:bg-white/[0.09]"
    >
      <Icon className={active ? "size-5 text-[#9fe3bf]" : "size-5 text-white/85"} strokeWidth={1.5} />
      <span className="text-[11px] tracking-[0.06em] text-white/70">{label}</span>
    </motion.button>
  );
}

function FullscreenCard({ onClose }: { onClose: () => void }) {
  return (
    <DeviceOverlay>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, transition: { duration: 0.35 } }}
        className="absolute inset-0 overflow-hidden bg-[#dfe6f5]"
        role="dialog"
        aria-modal
        aria-label="デジタルカード（全画面）"
      >
        {/* iridescent light field */}
        <div className="absolute inset-0 bg-[linear-gradient(160deg,#c6d4f2_0%,#eef2fb_35%,#e9ddf7_60%,#bfd2ee_100%)]" />
        <div className="animate-drift absolute -left-20 top-1/4 h-96 w-72 rotate-12 rounded-full bg-[conic-gradient(from_90deg,#ffd6f4,#d6f2ff,#fff4d0,#e4d6ff,#ffd6f4)] opacity-70 blur-3xl" />
        <div className="animate-drift absolute -right-24 bottom-10 h-96 w-80 rounded-full bg-[conic-gradient(from_200deg,#c9f0ff,#f1d9ff,#ffe9f5,#c9f0ff)] opacity-70 blur-3xl [animation-delay:-9s]" />
        <div className="animate-shimmer absolute inset-0 bg-[linear-gradient(110deg,transparent_30%,rgba(255,255,255,0.55)_45%,transparent_60%)] bg-[length:200%_100%] mix-blend-overlay" />
        <div className="grain absolute inset-0 opacity-[0.08] mix-blend-overlay" />

        <div className="relative flex h-full flex-col items-center px-6 pb-12 pt-[max(env(safe-area-inset-top),24px)] lg:pt-[64px]">
          <div className="flex w-full items-center justify-between text-ink">
            <Wordmark className="text-[18px]" />
            <button onClick={onClose} aria-label="閉じる" className="glass grid size-10 place-items-center rounded-full">
              <X className="size-[18px]" strokeWidth={1.5} />
            </button>
          </div>

          <div className="flex flex-1 items-center justify-center">
            <motion.div
              initial={{ rotate: 0, scale: 0.6, y: 80, opacity: 0 }}
              animate={{ rotate: 90, scale: 1, y: 0, opacity: 1 }}
              exit={{ rotate: 0, scale: 0.7, y: 60, opacity: 0 }}
              transition={{ type: "spring", stiffness: 110, damping: 18 }}
              className="w-[min(480px,58dvh)] shrink-0"
            >
              <MirraCard flippable={false} float={false} />
            </motion.div>
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="flex flex-col items-center text-ink">
            <p className="font-display text-[15px] italic tracking-[0.06em] text-ink/60">Your Beauty, Always With You.</p>
            <div className="relative mt-5 grid size-16 place-items-center">
              <span className="animate-ripple absolute inset-0 rounded-full border border-ink/25" />
              <span className="animate-ripple absolute inset-0 rounded-full border border-ink/25 [animation-delay:0.8s]" />
              <span className="glass relative grid size-14 place-items-center rounded-full">
                <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round">
                  <path d="M8.5 8.5a5 5 0 0 1 0 7" />
                  <path d="M11.5 6a8.5 8.5 0 0 1 0 12" />
                  <path d="M14.5 3.5a12 12 0 0 1 0 17" />
                  <path d="M5.5 11a1.5 1.5 0 0 1 0 2" />
                </svg>
              </span>
            </div>
            <p className="font-jp mt-3 text-[11.5px] tracking-[0.14em] text-ink/60">端末をリーダーにかざしてください</p>
          </motion.div>
        </div>
      </motion.div>
    </DeviceOverlay>
  );
}
