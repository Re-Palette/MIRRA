"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check } from "lucide-react";

type State = "idle" | "scanning" | "done";

export function NfcPulse() {
  const [state, setState] = useState<State>("idle");

  const start = () => {
    if (state !== "idle") return setState("idle");
    setState("scanning");
    setTimeout(() => setState("done"), 2200);
  };

  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      onClick={start}
      className="glass-dark relative flex w-full items-center gap-4 overflow-hidden rounded-full py-3 pl-3 pr-6 text-left"
    >
      {state === "scanning" && (
        <motion.span
          layoutId="nfc-sweep"
          className="absolute inset-y-0 w-1/2 bg-[linear-gradient(90deg,transparent,rgba(160,180,255,0.18),transparent)]"
          initial={{ x: "-100%" }}
          animate={{ x: "250%" }}
          transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
        />
      )}
      <span className="relative grid size-12 shrink-0 place-items-center">
        {state !== "done" && (
          <>
            <span className="animate-ripple absolute inset-0 rounded-full border border-[#a9b8ff]/50" />
            <span className="animate-ripple absolute inset-0 rounded-full border border-[#a9b8ff]/50 [animation-delay:1.2s]" />
          </>
        )}
        <span className="relative grid size-12 place-items-center rounded-full border border-white/15 bg-white/[0.06]">
          <AnimatePresence mode="wait" initial={false}>
            {state === "done" ? (
              <motion.span key="ok" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                <Check className="size-5 text-[#9fe3bf]" strokeWidth={2} />
              </motion.span>
            ) : (
              <motion.svg key="nfc" viewBox="0 0 24 24" className="size-5 text-white" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round">
                <path d="M8.5 8.5a5 5 0 0 1 0 7" />
                <path d="M11.5 6a8.5 8.5 0 0 1 0 12" />
                <path d="M14.5 3.5a12 12 0 0 1 0 17" />
                <path d="M5.5 11a1.5 1.5 0 0 1 0 2" />
              </motion.svg>
            )}
          </AnimatePresence>
        </span>
      </span>
      <span className="relative min-w-0">
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={state}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="font-jp block text-[12.5px] leading-relaxed tracking-[0.04em] text-white/85"
          >
            {state === "idle" && (
              <>
                NFCでタッチして
                <br />
                サロンでデータを読み取れます。
              </>
            )}
            {state === "scanning" && (
              <>
                サロン端末を検索中…
                <br />
                <span className="text-white/50">iPhoneの上部をかざしてください</span>
              </>
            )}
            {state === "done" && (
              <>
                Luce Hair 渋谷 に共有しました
                <br />
                <span className="text-white/50">カルテが担当者に届きました</span>
              </>
            )}
          </motion.span>
        </AnimatePresence>
      </span>
    </motion.button>
  );
}
