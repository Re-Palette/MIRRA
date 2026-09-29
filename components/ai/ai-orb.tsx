"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

/** Living gradient sphere that represents MIRRA AI. */
export function AiOrb({ className, thinking }: { className?: string; thinking?: boolean }) {
  return (
    <div className={cn("relative isolate aspect-square", className)}>
      <motion.div
        className="absolute -inset-[18%] rounded-full bg-[conic-gradient(from_0deg,#c9d6ff,#f3d6ff,#cdf2ff,#c9d6ff)] opacity-60 blur-2xl"
        animate={{ rotate: 360, scale: thinking ? [1, 1.15, 1] : 1 }}
        transition={{ rotate: { duration: 14, repeat: Infinity, ease: "linear" }, scale: { duration: 1.4, repeat: Infinity } }}
      />
      <div className="absolute inset-0 overflow-hidden rounded-full bg-[#eef1ff] shadow-[inset_0_-8px_24px_rgba(120,110,220,0.25),inset_0_6px_16px_rgba(255,255,255,0.9),0_12px_30px_-10px_rgba(90,100,200,0.45)]">
        <motion.div
          className="absolute -inset-1/4 bg-[conic-gradient(from_90deg_at_40%_40%,#9fb4ff,#f0c4ff,#bff0ff,#ffe1f1,#9fb4ff)] blur-xl"
          animate={{ rotate: -360 }}
          transition={{ duration: thinking ? 4 : 10, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute left-[18%] top-[14%] h-[40%] w-[50%] rounded-full bg-white/80 blur-md"
          animate={{ x: ["0%", "20%", "0%"], y: ["0%", "10%", "0%"] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_30%_25%,rgba(255,255,255,0.9),transparent_35%)]" />
      </div>
    </div>
  );
}
