"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { CreditCard, House, MapPin, Sparkles, UserRound, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRef } from "react";
import { useAgent } from "@/components/agent/agent-provider";
import { GlowOrb } from "@/components/ai/glow-orb";

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
          if (tab.href === "/ai") return <AiFab key={tab.href} active={active} dark={dark} />;
          const Icon = tab.icon;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              aria-current={active ? "page" : undefined}
              className="relative flex h-[56px] flex-1 flex-col items-center justify-center gap-1"
            >
              <motion.span whileTap={{ scale: 0.88 }} className="relative flex flex-col items-center gap-1">
                <Icon
                  className={cn(
                    "size-[21px] transition-colors duration-300",
                    active ? (dark ? "text-white" : "text-ink") : dark ? "text-white/45" : "text-ink-muted",
                  )}
                  strokeWidth={active ? 1.8 : 1.4}
                  fill={active && !dark ? "currentColor" : "none"}
                  fillOpacity={0.08}
                />
                <span
                  className={cn(
                    "text-[10px] tracking-[0.04em] transition-colors duration-300",
                    active ? (dark ? "text-white" : "text-ink") : dark ? "text-white/45" : "text-ink-muted",
                  )}
                >
                  {tab.label}
                </span>
                {active && (
                  <motion.span
                    layoutId="nav-active"
                    className={cn("absolute -bottom-[7px] h-[2px] w-5 rounded-full", dark ? "bg-white" : "bg-ink")}
                  />
                )}
              </motion.span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

/** Tap: open the AI tab. Press and hold: summon the voice agent from anywhere. */
function AiFab({ active, dark }: { active: boolean; dark?: boolean }) {
  const { setVoiceOpen } = useAgent();
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const held = useRef(false);
  const cancel = () => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
  };
  return (
    <Link
      href="/ai"
      aria-label="MIRA（長押しで音声エージェント）"
      aria-current={active ? "page" : undefined}
      className="relative flex flex-1 justify-center select-none [-webkit-touch-callout:none]"
      onPointerDown={() => {
        held.current = false;
        timer.current = setTimeout(() => {
          held.current = true;
          if ("vibrate" in navigator) navigator.vibrate?.(12);
          setVoiceOpen(true);
        }, 450);
      }}
      onPointerUp={cancel}
      onPointerLeave={cancel}
      onPointerCancel={cancel}
      onContextMenu={(e) => e.preventDefault()}
      onClick={(e) => {
        if (held.current) {
          e.preventDefault();
          held.current = false;
        }
      }}
    >
      <motion.span
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.9 }}
        className={cn("relative -translate-y-[18px] rounded-full p-[5px]", dark ? "bg-[#141a28]" : "bg-canvas")}
      >
        <GlowOrb className="size-[54px]" active={active} />
        <span className={cn("absolute inset-x-0 -bottom-[13px] text-center text-[10px] tracking-[0.04em]", active ? (dark ? "text-white" : "text-ink") : dark ? "text-white/45" : "text-ink-muted")}>
          AI
        </span>
      </motion.span>
    </Link>
  );
}
