"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Monogram, Wordmark } from "./logo";
import { cn } from "@/lib/utils";

const screens = [
  { href: "/", label: "ホーム", en: "Home" },
  { href: "/card", label: "デジタルカード", en: "MIRRA Card" },
  { href: "/history", label: "カルテ・施術履歴", en: "Hair History" },
  { href: "/ai", label: "AI相談", en: "AI Concierge" },
  { href: "/salon", label: "サロンマッチング", en: "Salon Matching" },
  { href: "/profile", label: "マイページ", en: "Profile" },
];

/** Desktop-only editorial panel beside the device, echoing the key visual. */
export function BrandPanel() {
  const pathname = usePathname();
  return (
    <aside className="relative hidden h-[874px] w-[440px] shrink-0 overflow-hidden rounded-[40px] shadow-float xl:block">
      <Image src="/images/hero-portrait.webp" alt="" fill priority sizes="440px" className="scale-[1.03] object-cover object-[70%_center]" />
      <div className="absolute inset-0 bg-[linear-gradient(100deg,rgba(236,242,252,0.92)_0%,rgba(236,242,252,0.55)_42%,rgba(236,242,252,0)_70%)]" />
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[rgba(236,242,252,0.9)] to-transparent" />

      <div className="relative flex h-full flex-col p-11 text-ink">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}>
          <Wordmark className="block text-[52px] leading-none" />
          <p className="mt-4 text-[13px] font-light tracking-[0.22em] text-ink-soft">Your Beauty, Always With You.</p>
          <p className="font-jp mt-10 text-[22px] font-light leading-[1.9] tracking-[0.18em]">
            あなたの髪を、
            <br />
            もっと美しく、
            <br />
            もっと自由に。
          </p>
          <ul className="mt-9 space-y-2 text-[11px] font-light tracking-[0.32em] text-ink-soft">
            <li>AI × BEAUTY</li>
            <li>DATA</li>
            <li>SALON</li>
            <li>CARE</li>
            <li>LIFESTYLE</li>
          </ul>
        </motion.div>

        <div className="mt-auto">
          <p className="mb-3 text-[10px] tracking-[0.3em] text-ink-muted">SCREENS</p>
          <nav className="glass grid grid-cols-2 gap-1 rounded-[24px] p-1.5">
            {screens.map((s) => {
              const active = s.href === "/" ? pathname === "/" : pathname.startsWith(s.href);
              return (
                <Link key={s.href} href={s.href} className="relative rounded-[18px] px-3.5 py-2.5">
                  {active && <motion.span layoutId="panel-active" className="absolute inset-0 rounded-[18px] bg-ink" />}
                  <span className={cn("relative block text-[12px] transition-colors", active ? "text-white" : "text-ink")}>{s.label}</span>
                  <span className={cn("relative block text-[10px] tracking-[0.12em] transition-colors", active ? "text-white/60" : "text-ink-muted")}>
                    {s.en}
                  </span>
                </Link>
              );
            })}
          </nav>
          <div className="mt-6 flex items-center justify-between text-ink-soft">
            <span className="font-jp text-[12px] font-light tracking-[0.2em]">美しさは、データでつながる。</span>
            <Monogram className="size-9 text-ink" />
          </div>
        </div>
      </div>
    </aside>
  );
}
