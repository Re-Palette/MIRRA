"use client";

import { useRef, useState } from "react";
import {
  motion,
  useAnimationFrame,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { Nfc } from "lucide-react";
import { Monogram, Wordmark } from "@/components/shell/logo";
import { QrCode } from "./qr-code";
import { hairScore, user } from "@/lib/data";
import { cn } from "@/lib/utils";

const spring = { stiffness: 140, damping: 18, mass: 0.6 };

type Props = {
  className?: string;
  /** allow tap-to-flip */
  flippable?: boolean;
  /** idle floating bob */
  float?: boolean;
  /** subtle idle holo drift when not interacting */
  drift?: boolean;
  onFlip?: (flipped: boolean) => void;
};

/**
 * The MIRRA membership card.
 * Layers (front): aurora base → drifting light blobs → guilloché lines → holographic foil
 * (tracks tilt) → specular glare (tracks pointer) → grain → glass edge.
 */
export function MirraCard({ className, flippable = true, float = true, drift = true, onFlip }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [flipped, setFlipped] = useState(false);
  const hovering = useRef(false);

  // pointer position in card space 0..1
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const sx = useSpring(px, spring);
  const sy = useSpring(py, spring);

  const rotateX = useTransform(sy, [0, 1], [11, -11]);
  const rotateY = useTransform(sx, [0, 1], [-15, 15]);

  useAnimationFrame((t) => {
    if (!drift || hovering.current) return;
    px.set(0.5 + Math.sin(t / 2300) * 0.22);
    py.set(0.5 + Math.cos(t / 2900) * 0.16);
  });

  const onMove = (e: React.PointerEvent) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    hovering.current = true;
    px.set((e.clientX - r.left) / r.width);
    py.set((e.clientY - r.top) / r.height);
  };
  const onLeave = () => {
    hovering.current = false;
  };

  const toggle = () => {
    if (!flippable) return;
    setFlipped((f) => {
      onFlip?.(!f);
      return !f;
    });
  };

  return (
    <motion.div
      className={cn("relative [perspective:1400px]", className)}
      animate={float ? { y: [0, -8, 0] } : undefined}
      transition={float ? { duration: 6, repeat: Infinity, ease: "easeInOut" } : undefined}
    >
      <motion.div
        ref={ref}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        onPointerCancel={onLeave}
        onClick={toggle}
        role={flippable ? "button" : undefined}
        tabIndex={flippable ? 0 : undefined}
        aria-label={flippable ? (flipped ? "カードの表面を表示" : "カードの裏面を表示") : undefined}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            toggle();
          }
        }}
        whileTap={{ scale: 0.985 }}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="relative aspect-[1.586/1] w-full cursor-pointer select-none outline-none [container-type:inline-size] focus-visible:ring-2 focus-visible:ring-white/60 rounded-[22px]"
      >
        <motion.div
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ type: "spring", stiffness: 90, damping: 16, mass: 0.9 }}
          style={{ transformStyle: "preserve-3d" }}
          className="absolute inset-0"
        >
          <CardFront sx={sx} sy={sy} />
          <CardBack sx={sx} sy={sy} />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

function useSheen(sx: MotionValue<number>, sy: MotionValue<number>) {
  const gx = useTransform(sx, (v) => `${v * 100}%`);
  const gy = useTransform(sy, (v) => `${v * 100}%`);
  const foilPos = useTransform([sx, sy], ([x, y]: number[]) => `${x * 100}% ${y * 60 + 20}%`);
  const glare = useMotionTemplate`radial-gradient(circle at ${gx} ${gy}, rgba(255,255,255,0.75) 0%, rgba(255,255,255,0.22) 22%, rgba(255,255,255,0) 55%)`;
  const shadowX = useTransform(sx, [0, 1], [18, -18]);
  return { foilPos, glare, shadowX };
}

const faceBase =
  "absolute inset-0 overflow-hidden rounded-[6.2cqw] [backface-visibility:hidden] [-webkit-backface-visibility:hidden]";

function CardFront({ sx, sy }: { sx: MotionValue<number>; sy: MotionValue<number> }) {
  const { foilPos, glare, shadowX } = useSheen(sx, sy);
  return (
    <motion.div
      className={faceBase}
      style={{
        boxShadow: useMotionTemplate`${shadowX}px 30px 60px -18px rgba(40,50,120,0.55), 0 12px 24px -12px rgba(0,0,0,0.5)`,
      }}
    >
      {/* aurora base */}
      <div className="absolute inset-0 bg-[linear-gradient(128deg,#3a4892_0%,#6a7fcc_28%,#a8b2ea_50%,#d4bff0_64%,#7c98d6_84%,#3f4c98_100%)]" />
      <div className="animate-drift absolute -left-[20%] top-[-30%] h-[120%] w-[70%] rounded-full bg-[#9fe6ff]/40 blur-[7cqw]" />
      <div className="animate-drift absolute -right-[15%] bottom-[-40%] h-[110%] w-[70%] rounded-full bg-[#f2b8ff]/45 blur-[8cqw] [animation-delay:-7s]" />
      <div className="animate-drift absolute left-[25%] top-[10%] h-[40%] w-[60%] rotate-[-18deg] rounded-full bg-white/25 blur-[5cqw] [animation-delay:-3s]" />

      {/* guilloché */}
      <svg className="absolute inset-0 size-full opacity-[0.22] mix-blend-overlay" viewBox="0 0 320 202" preserveAspectRatio="none" aria-hidden>
        {Array.from({ length: 22 }).map((_, i) => (
          <path
            key={i}
            d={`M-10 ${40 + i * 7} C 80 ${-10 + i * 9}, 200 ${120 + i * 4}, 330 ${20 + i * 8}`}
            fill="none"
            stroke="white"
            strokeWidth="0.5"
          />
        ))}
      </svg>

      {/* holographic foil */}
      <motion.div
        className="absolute inset-0 opacity-[0.42] mix-blend-color-dodge"
        style={{
          backgroundImage:
            "repeating-linear-gradient(115deg, rgba(255,120,200,0.55) 0%, rgba(255,230,140,0.5) 7%, rgba(140,255,200,0.5) 14%, rgba(130,210,255,0.55) 21%, rgba(200,150,255,0.55) 28%, rgba(255,120,200,0.55) 35%)",
          backgroundSize: "260% 260%",
          backgroundPosition: foilPos,
          maskImage: "linear-gradient(115deg, transparent 5%, black 35%, black 65%, transparent 95%)",
        }}
      />

      {/* glare */}
      <motion.div className="absolute inset-0 mix-blend-soft-light" style={{ backgroundImage: glare }} />
      <motion.div className="absolute inset-0 opacity-50 mix-blend-overlay" style={{ backgroundImage: glare }} />

      <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(24,30,84,0.38),rgba(24,30,84,0)_55%)]" />
      <div className="grain absolute inset-0 opacity-[0.16] mix-blend-overlay" />
      <div className="absolute inset-0 rounded-[inherit] shadow-[inset_0_1px_1px_rgba(255,255,255,0.7),inset_0_0_0_1px_rgba(255,255,255,0.28),inset_0_-10px_30px_rgba(40,40,120,0.18)]" />

      {/* content */}
      <div className="relative flex h-full flex-col justify-between p-[6.5cqw] text-white [text-shadow:0_1px_10px_rgba(30,40,100,0.25)]">
        <div className="flex items-start justify-between">
          <Wordmark className="text-[6.4cqw] leading-none" />
          <Monogram className="-mr-[1cqw] -mt-[1.5cqw] size-[14cqw] drop-shadow-[0_1px_6px_rgba(30,40,100,0.3)]" strokeWidth={1} />
        </div>
        <div className="flex items-center gap-[3cqw]">
          <div className="h-[9.5cqw] w-[13cqw] rounded-[2cqw] bg-[linear-gradient(135deg,#f5f1e6,#cfc6b0_40%,#efe9da_60%,#b9ae94)] opacity-90 shadow-[inset_0_0_0_1px_rgba(0,0,0,0.08)]">
            <div className="grid size-full grid-cols-3 grid-rows-3 gap-px p-[1.2cqw] opacity-40">
              {Array.from({ length: 9 }).map((_, i) => (
                <span key={i} className="rounded-[0.4cqw] border border-[#8a7f66]/60" />
              ))}
            </div>
          </div>
          <Nfc className="size-[7cqw] text-white/85" strokeWidth={1.4} />
        </div>
        <div className="flex items-end justify-between">
          <div>
            <p className="text-[2.4cqw] tracking-[0.34em] text-white/75">PREMIUM MEMBER</p>
            <p className="mt-[1.4cqw] text-[5.2cqw] font-light leading-none tracking-[0.08em]">{user.name}</p>
            <p className="mt-[1.6cqw] text-[3cqw] tabular-nums tracking-[0.18em] text-white/80">ID&nbsp;&nbsp;{user.memberId}</p>
          </div>
          <div className="text-right">
            <p className="text-[2.2cqw] tracking-[0.3em] text-white/65">SINCE</p>
            <p className="text-[3.6cqw] tabular-nums tracking-[0.12em]">{user.since}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function CardBack({ sx, sy }: { sx: MotionValue<number>; sy: MotionValue<number> }) {
  const { foilPos, glare } = useSheen(sx, sy);
  return (
    <div className={cn(faceBase, "[transform:rotateY(180deg)] shadow-[0_30px_60px_-18px_rgba(40,50,120,0.55)]")}>
      <div className="absolute inset-0 bg-[linear-gradient(135deg,#1a2138_0%,#2a3560_45%,#3b3f72_70%,#1c2340_100%)]" />
      <div className="absolute -right-[20%] -top-[40%] h-[120%] w-[70%] rounded-full bg-[#8fa6ff]/30 blur-[8cqw]" />
      <div className="absolute -bottom-[40%] -left-[10%] h-[100%] w-[60%] rounded-full bg-[#e3a9ff]/20 blur-[8cqw]" />
      <motion.div
        className="absolute inset-0 opacity-25 mix-blend-color-dodge"
        style={{
          backgroundImage:
            "repeating-linear-gradient(115deg, rgba(255,120,200,0.5) 0%, rgba(255,230,140,0.4) 7%, rgba(140,255,200,0.4) 14%, rgba(130,210,255,0.5) 21%, rgba(200,150,255,0.5) 28%, rgba(255,120,200,0.5) 35%)",
          backgroundSize: "260% 260%",
          backgroundPosition: foilPos,
        }}
      />
      <motion.div className="absolute inset-0 opacity-40 mix-blend-soft-light" style={{ backgroundImage: glare }} />
      <div className="grain absolute inset-0 opacity-[0.1] mix-blend-overlay" />
      <div className="absolute inset-0 rounded-[inherit] shadow-[inset_0_1px_1px_rgba(255,255,255,0.25),inset_0_0_0_1px_rgba(255,255,255,0.1)]" />

      <div className="relative flex h-full gap-[4.5cqw] p-[5.5cqw] text-white">
        <div className="flex shrink-0 flex-col items-center">
          <div className="rounded-[3.2cqw] bg-white p-[2cqw] shadow-[0_6px_20px_rgba(0,0,0,0.25)]">
            <QrCode className="size-[26cqw] text-ink" />
          </div>
          <p className="mt-[2cqw] text-[2.2cqw] tracking-[0.26em] text-white/55">SCAN AT SALON</p>
        </div>

        <div className="flex min-w-0 flex-1 flex-col justify-between">
          <div className="grid grid-cols-2 gap-x-[3cqw] gap-y-[2cqw]">
            <Field label="MEMBER" value={user.name} span />
            <Field label="ID" value={user.memberId} />
            <Field label="STATUS" value="Premium" />
          </div>

          <div>
            <p className="text-[2.2cqw] tracking-[0.3em] text-white/50">HAIR PROFILE</p>
            <div className="mt-[1.4cqw] flex flex-wrap gap-[1.2cqw]">
              {[hairScore.hairType, `ダメージ ${hairScore.damage.label}`, `Score ${hairScore.score}`].map((t) => (
                <span key={t} className="font-jp rounded-full bg-white/10 px-[2.2cqw] py-[0.8cqw] text-[2.5cqw] backdrop-blur">
                  {t}
                </span>
              ))}
            </div>
          </div>

          <div>
            <p className="text-[2.2cqw] tracking-[0.3em] text-white/50">LINKED SALONS</p>
            <div className="mt-[1.2cqw] space-y-[0.8cqw] text-[2.8cqw]">
              <p className="flex items-center gap-[1.6cqw]">
                <span className="size-[1.6cqw] rounded-full bg-[#7ee2a8] shadow-[0_0_8px_#7ee2a8]" />
                Luce Hair 渋谷<span className="text-white/45">· 連携中</span>
              </p>
              <p className="flex items-center gap-[1.6cqw]">
                <span className="size-[1.6cqw] rounded-full bg-[#7ee2a8] shadow-[0_0_8px_#7ee2a8]" />
                NEUTRAL 表参道<span className="text-white/45">· 連携中</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, span }: { label: string; value: string; span?: boolean }) {
  return (
    <div className={cn("min-w-0", span && "col-span-2")}>
      <p className="text-[2.2cqw] tracking-[0.3em] text-white/50">{label}</p>
      <p className="mt-[0.6cqw] truncate text-[3.3cqw] tabular-nums tracking-[0.06em]">{value}</p>
    </div>
  );
}
