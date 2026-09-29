"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * Apple Intelligence–style luminous sphere: a pearl core with a soft,
 * slowly rotating spectral rim. Calm by default, livelier when `active`.
 */
export function GlowOrb({ className, active }: { className?: string; active?: boolean }) {
  return (
    <div className={cn("relative isolate aspect-square", className)} aria-hidden>
      <motion.div
        className="absolute -inset-[22%] rounded-full bg-[conic-gradient(from_0deg,#ffb8a8,#f7a8e0,#b9a8ff,#8fc2ff,#a8f0e6,#ffd7a0,#ffb8a8)] opacity-45 blur-[14px]"
        animate={{ rotate: 360, scale: active ? [1, 1.12, 1] : [1, 1.04, 1] }}
        transition={{ rotate: { duration: active ? 5 : 16, repeat: Infinity, ease: "linear" }, scale: { duration: active ? 1.2 : 4, repeat: Infinity } }}
      />
      <motion.div
        className="absolute inset-0 rounded-full bg-[conic-gradient(from_180deg,#ffc4b4,#f3b4ec,#c3b6ff,#a0cbff,#b6f3ea,#ffe0b0,#ffc4b4)] p-[1.5px]"
        animate={{ rotate: -360 }}
        transition={{ duration: active ? 4 : 12, repeat: Infinity, ease: "linear" }}
      >
        <div className="size-full rounded-full bg-[radial-gradient(circle_at_35%_28%,#ffffff_0%,#f5f3ff_38%,#e6e6fb_70%,#dcdff6_100%)]" />
      </motion.div>
      <div className="absolute inset-[18%] rounded-full bg-[radial-gradient(circle_at_40%_35%,rgba(255,255,255,0.95),rgba(255,255,255,0)_65%)]" />
      <svg viewBox="0 0 24 24" className="absolute inset-[30%] text-[#8b86e8]" fill="currentColor">
        <path d="M12 2.5c.5 4.7 2.8 7 7.5 7.5v.1c-4.7.5-7 2.8-7.5 7.5h-.1c-.5-4.7-2.8-7-7.5-7.5V10c4.7-.5 7-2.8 7.5-7.5Z" opacity=".85" />
      </svg>
    </div>
  );
}
