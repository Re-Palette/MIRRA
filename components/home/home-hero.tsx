"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { Bell, CloudSun, Droplets, Sun } from "lucide-react";
import { useDevice } from "@/components/shell/device-context";
import { Wordmark } from "@/components/shell/logo";
import { user, weather } from "@/lib/data";
import { easeOutExpo } from "@/components/ui/motion";

export function HomeHero() {
  const { scrollRef } = useDevice();
  const { scrollY } = useScroll({ container: scrollRef });
  const imgY = useTransform(scrollY, [0, 600], [0, 170]);
  const imgScale = useTransform(scrollY, [-200, 0, 600], [1.25, 1.06, 1.16]);
  const copyY = useTransform(scrollY, [0, 400], [0, -60]);
  const copyOpacity = useTransform(scrollY, [0, 320], [1, 0]);
  const barBg = useTransform(scrollY, [260, 420], ["rgba(247,248,250,0)", "rgba(247,248,250,0.72)"]);
  const barBlur = useTransform(scrollY, [260, 420], ["blur(0px)", "blur(20px)"]);

  return (
    <>
    {/* Sticky top bar */}
    <motion.div
      style={{ backgroundColor: barBg, backdropFilter: barBlur, WebkitBackdropFilter: barBlur }}
      className="sticky top-0 z-30 flex h-[calc(max(env(safe-area-inset-top),16px)+56px)] items-end justify-between px-6 pb-2 lg:h-[112px]"
    >
      <Wordmark className="text-[19px] text-ink" />
      <div className="flex items-center gap-2.5">
        <button aria-label="お知らせ" className="glass relative grid size-10 place-items-center rounded-full">
          <Bell className="size-[18px]" strokeWidth={1.5} />
          <span className="absolute right-[11px] top-[10px] size-[7px] rounded-full bg-[#8b7bff] ring-2 ring-white" />
        </button>
        <Link href="/profile" aria-label="マイページ" className="relative size-10 overflow-hidden rounded-full ring-2 ring-white/80">
          <Image src={user.avatar} alt="" fill sizes="40px" className="object-cover" />
        </Link>
      </div>
    </motion.div>
    <section className="relative -mt-[calc(max(env(safe-area-inset-top),16px)+56px)] h-[600px] overflow-hidden lg:-mt-[112px]">
      <motion.div style={{ y: imgY, scale: imgScale }} className="absolute inset-0 origin-top">
        <Image src="/images/hero-portrait.webp" alt="風になびく髪" fill priority sizes="(max-width: 1024px) 100vw, 402px" className="object-cover object-[62%_28%]" />
        {/* airy wash + legibility gradients */}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(221,232,255,0.62)_0%,rgba(221,232,255,0.12)_34%,rgba(16,24,40,0.06)_48%,rgba(16,24,40,0.5)_76%,rgba(16,24,40,0.3)_100%)]" />
      </motion.div>
      <div className="grain pointer-events-none absolute inset-0 opacity-[0.07] mix-blend-overlay" />
      <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-canvas via-canvas/60 to-transparent" />


      <motion.div style={{ y: copyY, opacity: copyOpacity }} className="relative flex h-full flex-col px-6 pt-[92px] lg:pt-[122px]">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.15, ease: easeOutExpo }}>
          <p className="font-jp text-[19px] font-normal tracking-[0.08em] text-ink">おはよう、{user.firstNameJa}さん</p>
          <p className="font-jp mt-1.5 text-[12.5px] font-light leading-relaxed tracking-[0.06em] text-ink/70">
            今日の髪は、少し乾燥気味です。
            <br />
            保湿ケアを意識してみましょう。
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: easeOutExpo }}
          className="mt-5 flex w-fit items-center gap-4 rounded-[22px] border border-white/50 bg-white/35 px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] backdrop-blur-xl"
        >
          <div className="flex items-center gap-2">
            <CloudSun className="size-[18px] text-[#e6a23c]" strokeWidth={1.5} />
            <div className="leading-tight">
              <p className="text-[9.5px] tracking-[0.12em] text-ink/60">{weather.city}</p>
              <p className="text-[15px] tabular-nums">{weather.temp}°C</p>
            </div>
          </div>
          <span className="h-7 w-px bg-ink/10" />
          <div className="leading-tight">
            <p className="flex items-center gap-1 text-[9.5px] tracking-[0.12em] text-ink/60">
              <Droplets className="size-3" strokeWidth={1.6} />
              湿度
            </p>
            <p className="text-[15px] tabular-nums">{weather.humidity}%</p>
          </div>
          <span className="h-7 w-px bg-ink/10" />
          <div className="leading-tight">
            <p className="flex items-center gap-1 text-[9.5px] tracking-[0.12em] text-ink/60">
              <Sun className="size-3" strokeWidth={1.6} />
              UV
            </p>
            <p className="text-[15px] tabular-nums">{weather.uv}</p>
          </div>
        </motion.div>

        <div className="mt-auto pb-[132px]">
          <motion.h1
            initial={{ opacity: 0, y: 24, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 1.4, delay: 0.45, ease: easeOutExpo }}
            className="font-display text-[54px] font-light leading-[0.98] tracking-[0.01em] text-white [text-shadow:0_2px_24px_rgba(16,24,40,0.25)]"
          >
            Good Hair,
            <br />
            <span className="italic">Good Day.</span>
          </motion.h1>
        </div>
      </motion.div>
    </section>
    </>
  );
}
