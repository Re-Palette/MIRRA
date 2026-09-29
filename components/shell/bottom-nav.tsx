"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { CreditCard, House, MapPin, Sparkles, UserRound, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type Tab = { href: string; label: string; icon: LucideIcon; match: (p: string) => boolean };

const tabs: Tab[] = [
  { href: "/", label: "Home", icon: House, match: (p) => p === "/" || p.startsWith("/history") },
  { href: "/card", label: "Card", icon: CreditCard, match: (p) => p.startsWith("/card") },
  { href: "/ai", label: "AI", icon: Sparkles, match: (p) => p.startsWith("/ai") },
  { href: "/salon", label: "Salon", icon: MapPin, match: (p) => p.startsWith("/salon") },
  { href: "/profile", label: "Profile", icon: UserRound, match: (p) => p.startsWith("/profile") },
];

export function BottomNav({ dark }: { dark?: boolean }) {
  const pathname = usePathname();

  return (
    <nav
      aria-label="メインナビゲーション"
      className="pointer-events-none absolute inset-x-0 bottom-0 z-40 px-4 pb-[max(env(safe-area-inset-bottom),14px)] lg:pb-6"
    >
      <div
        className={cn(
          "pointer-events-auto relative mx-auto flex h-[68px] max-w-[400px] items-center justify-between rounded-[30px] px-2 transition-colors duration-700",
          dark
            ? "border border-white/10 bg-[#141a28]/70 shadow-[0_20px_40px_-12px_rgba(0,0,0,0.6)] backdrop-blur-2xl backdrop-saturate-150"
            : "border border-white/60 bg-white/[0.86] shadow-float backdrop-blur-2xl backdrop-saturate-150",
        )}
      >
        {tabs.map((tab) => {
          const active = tab.match(pathname);
          if (tab.href === "/ai") return <AiFab key={tab.href} active={active} />;
          const Icon = tab.icon;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              aria-current={active ? "page" : undefined}
              className="relative flex h-[56px] flex-1 flex-col items-center justify-center gap-1"
            >
              {active && (
                <motion.span
                  layoutId="nav-active"
                  className={cn("absolute inset-x-1.5 inset-y-0.5 rounded-[22px]", dark ? "bg-white/10" : "bg-white shadow-soft")}
                />
              )}
              <motion.span whileTap={{ scale: 0.86 }} className="relative flex flex-col items-center gap-1">
                <Icon
                  className={cn(
                    "size-[21px] transition-colors duration-300",
                    active ? (dark ? "text-white" : "text-ink") : dark ? "text-white/45" : "text-ink-muted",
                  )}
                  strokeWidth={active ? 1.9 : 1.5}
                />
                <span
                  className={cn(
                    "text-[10px] tracking-[0.08em] transition-colors duration-300",
                    active ? (dark ? "text-white" : "text-ink") : dark ? "text-white/45" : "text-ink-muted",
                  )}
                >
                  {tab.label}
                </span>
              </motion.span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

function AiFab({ active }: { active: boolean }) {
  return (
    <Link href="/ai" aria-label="MIRRA AI" aria-current={active ? "page" : undefined} className="relative flex flex-1 justify-center">
      <motion.span
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.9 }}
        animate={{ y: [-22, -26, -22] }}
        transition={{ y: { duration: 4, repeat: Infinity, ease: "easeInOut" } }}
        className="relative grid size-[62px] place-items-center rounded-full"
      >
        {/* halo */}
        <span className="absolute -inset-2 rounded-full bg-[conic-gradient(from_120deg,#b9c9ff,#f3d4ff,#c8f1ff,#b9c9ff)] opacity-60 blur-md" />
        {/* ring */}
        <span className="absolute inset-0 rounded-full bg-[conic-gradient(from_200deg,#c9d6ff,#f6e8ff,#ffffff,#bfe3ff,#c9d6ff)] p-[2px]">
          <span className="block size-full rounded-full bg-[radial-gradient(120%_120%_at_30%_20%,#2a3350_0%,#101828_55%,#070a12_100%)]" />
        </span>
        <span className="pointer-events-none absolute inset-[3px] rounded-full bg-[linear-gradient(160deg,rgba(255,255,255,0.35),transparent_45%)]" />
        <Sparkles className="relative size-6 text-white" strokeWidth={1.6} />
        {active && (
          <motion.span
            layoutId="nav-active-dot"
            className="absolute -bottom-3 size-1 rounded-full bg-ink"
          />
        )}
      </motion.span>
    </Link>
  );
}
