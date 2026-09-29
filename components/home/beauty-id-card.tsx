"use client";

import { useState } from "react";
import { motion, type Transition, type Variants } from "framer-motion";
import { ChevronRight, Nfc, RotateCcw } from "lucide-react";
import { Monogram } from "@/components/shell/logo";
import { QrCode } from "@/components/card/qr-code";
import { beautyScore, member, user } from "@/lib/data";

// A slight "lift" (scale dip) mid-turn makes the flip read like a physical pass.
const turn: Transition = { rotateY: { duration: 0.75, ease: [0.3, 0.7, 0.2, 1] }, scale: { duration: 0.75, times: [0, 0.5, 1], ease: "easeInOut" } };
const flipVariants: Variants = {
  front: { rotateY: 0, scale: [1, 0.965, 1], transition: turn },
  back: { rotateY: 180, scale: [1, 0.965, 1], transition: turn },
};

/**
 * MIRRA Beauty ID — a front-facing, Apple Wallet–style pass.
 * No tilt, no bob: just a quiet aurora sheen and a natural 3D flip.
 */
export function BeautyIdCard() {
  const [flipped, setFlipped] = useState(false);
  const flip = () => setFlipped((f) => !f);

  return (
    <div className="px-5">
      <div className="relative [perspective:1600px]">
        <motion.div
          role="button"
          tabIndex={0}
          aria-label={flipped ? "Beauty ID の表面を表示" : "Beauty ID の裏面を表示"}
          aria-pressed={flipped}
          onClick={flip}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              flip();
            }
          }}
          initial={false}
          variants={flipVariants}
          animate={flipped ? "back" : "front"}
          whileTap={{ scale: 0.985 }}
          style={{ transformStyle: "preserve-3d" }}
          className="relative aspect-[1.586/1] w-full cursor-pointer outline-none [container-type:inline-size] focus-visible:rounded-[20px] focus-visible:ring-2 focus-visible:ring-[#b9c6ff]"
        >
          <Face>
            <Front onFlip={flip} />
          </Face>
          <Face back>
            <Back onFlip={flip} />
          </Face>
        </motion.div>
      </div>
    </div>
  );
}

function Face({ children, back }: { children: React.ReactNode; back?: boolean }) {
  return (
    <div
      className="absolute inset-0 overflow-hidden rounded-[5.6cqw] shadow-[0_1px_2px_rgba(16,24,40,0.06),0_24px_48px_-24px_rgba(72,84,160,0.45)] [backface-visibility:hidden] [-webkit-backface-visibility:hidden]"
      style={back ? { transform: "rotateY(180deg)" } : undefined}
    >
      <Material />
      <div className="relative h-full">{children}</div>
    </div>
  );
}

/** Pale aurora glass: soft spectral washes under a frosted surface, with one slow light sweep. */
function Material() {
  return (
    <>
      <div className="absolute inset-0 bg-[linear-gradient(135deg,#eef1fb_0%,#dfe6fb_30%,#ece3fb_55%,#e2edfb_78%,#efe9fb_100%)]" />
      <div className="absolute -left-[15%] top-[-35%] h-[110%] w-[65%] rotate-[-18deg] rounded-[50%] bg-[#bcd0ff]/60 blur-[6cqw]" />
      <div className="absolute right-[-10%] top-[10%] h-[90%] w-[55%] rotate-[24deg] rounded-[50%] bg-[#e9c8f6]/55 blur-[6cqw]" />
      <div className="absolute bottom-[-40%] left-[20%] h-[80%] w-[60%] rounded-[50%] bg-[#c6ecf6]/45 blur-[6cqw]" />
      {/* silk streaks — the aurora "folds" of the reference, kept soft */}
      <div className="absolute inset-0 opacity-70 [background:linear-gradient(118deg,transparent_18%,rgba(255,255,255,0.55)_26%,transparent_34%,transparent_48%,rgba(205,190,255,0.45)_56%,transparent_64%,transparent_70%,rgba(255,255,255,0.4)_76%,transparent_84%)] blur-[1.4cqw]" />
      {/* holographic filament */}
      <div className="absolute inset-0 opacity-50 mix-blend-soft-light [background:repeating-linear-gradient(115deg,rgba(255,170,220,0.5)_0%,rgba(180,210,255,0.5)_6%,rgba(190,255,235,0.45)_12%,rgba(255,230,190,0.45)_18%,rgba(255,170,220,0.5)_24%)]" />
      <motion.div
        className="absolute inset-y-0 w-[45%] bg-[linear-gradient(100deg,transparent,rgba(255,255,255,0.55),transparent)] mix-blend-overlay"
        initial={{ left: "-50%" }}
        animate={{ left: ["-50%", "120%"] }}
        transition={{ duration: 2.6, ease: [0.4, 0, 0.2, 1], repeat: Infinity, repeatDelay: 6 }}
      />
      <div className="grain absolute inset-0 opacity-[0.1] mix-blend-overlay" />
      <div className="absolute inset-0 rounded-[inherit] shadow-[inset_0_1px_0_rgba(255,255,255,0.9),inset_0_0_0_1px_rgba(255,255,255,0.55)]" />
    </>
  );
}

function FlipPill({ label, onFlip }: { label: string; onFlip: () => void }) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onFlip();
      }}
      className="flex items-center gap-[1cqw] rounded-full border border-white/70 bg-white/50 py-[1.4cqw] pl-[3cqw] pr-[2cqw] text-[2.9cqw] tracking-[0.06em] text-[#3b4466] backdrop-blur-md transition-colors hover:bg-white/70"
    >
      {label}
      <ChevronRight className="size-[3.4cqw]" strokeWidth={1.6} />
    </button>
  );
}

function Front({ onFlip }: { onFlip: () => void }) {
  return (
    <div className="flex h-full flex-col justify-between p-[6.5cqw] text-[#1c2440]">
      <div className="flex items-start justify-between">
        <div>
          <p className="font-display text-[8.2cqw] font-light uppercase leading-none tracking-[0.18em]">Mirra</p>
          <p className="mt-[1.8cqw] text-[3.2cqw] tracking-[0.2em] text-[#1c2440]/60">Beauty ID</p>
        </div>
        <Monogram className="-mr-[1cqw] -mt-[1cqw] size-[15cqw] text-[#1c2440]" strokeWidth={1.2} />
      </div>
      <div className="flex items-end justify-between">
        <div>
          <p className="text-[5.6cqw] font-light tracking-[0.05em]">{user.name}</p>
          <p className="mt-[1.2cqw] text-[3.1cqw] tabular-nums tracking-[0.14em] text-[#1c2440]/55">ID {user.memberId.replace(/\s/g, "")}</p>
        </div>
        <div className="flex flex-col items-end gap-[2.6cqw]">
          <Nfc className="size-[6.4cqw] text-[#1c2440]/70" strokeWidth={1.3} />
          <FlipPill label="タップで裏面を表示" onFlip={onFlip} />
        </div>
      </div>
    </div>
  );
}

function Back({ onFlip }: { onFlip: () => void }) {
  const rows = [
    { k: "髪質タイプ", v: member.hairType },
    { k: "会員ランク", v: member.rank },
    { k: "連携サロン", v: `${member.linkedSalons} 店舗` },
    { k: "Beauty Score", v: String(beautyScore.score) },
  ];
  return (
    <div className="flex h-full gap-[5cqw] p-[5.5cqw] text-[#1c2440]">
      <div className="flex shrink-0 flex-col items-center justify-center">
        <div className="rounded-[3.4cqw] bg-white p-[2.4cqw] shadow-[0_4px_16px_-6px_rgba(40,50,110,0.3)]">
          <QrCode className="size-[27cqw] text-[#1c2440]" />
        </div>
        <p className="mt-[2cqw] text-[2.4cqw] tracking-[0.24em] text-[#1c2440]/50">SCAN AT SALON</p>
      </div>
      <div className="flex min-w-0 flex-1 flex-col justify-between">
        <dl className="space-y-[1.6cqw]">
          {rows.map((r) => (
            <div key={r.k} className="flex items-baseline justify-between gap-[2cqw] border-b border-[#1c2440]/[0.07] pb-[1.4cqw]">
              <dt className="shrink-0 text-[2.8cqw] tracking-[0.04em] text-[#1c2440]/55">{r.k}</dt>
              <dd className="truncate text-[3.4cqw] tabular-nums">{r.v}</dd>
            </div>
          ))}
        </dl>
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-[1cqw] text-[2.6cqw] text-[#1c2440]/45">
            <RotateCcw className="size-[3cqw]" />
            {user.name}
          </span>
          <FlipPill label="表面に戻る" onFlip={onFlip} />
        </div>
      </div>
    </div>
  );
}

