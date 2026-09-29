"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Keyboard, Mic, Square, Volume2, VolumeX, X } from "lucide-react";
import { useAgent } from "./agent-provider";
import { useSpeechRecognition } from "./use-speech";
import { ActionCard } from "./action-card";
import { AiOrb } from "@/components/ai/ai-orb";
import { DeviceOverlay } from "@/components/shell/device-context";
import { cn } from "@/lib/utils";

const quick = ["今日のブリーフィング", "次の予約はいつ？", "オイルをカートに入れて", "毎週日曜21時にマスクをリマインドして"];

/** Hands-free, F.R.I.D.A.Y.-style voice mode. */
export function VoiceOverlay() {
  const { voiceOpen, setVoiceOpen, send, phase, state, resolve, speak, stopSpeaking, dispatch, hydrated } = useAgent();
  const [typed, setTyped] = useState("");
  const [showKeyboard, setShowKeyboard] = useState(false);
  const speech = useSpeechRecognition((text) => void send(text, { voice: true }));

  const lastAgent = [...state.messages].reverse().find((m) => m.role === "agent");
  const lastUser = [...state.messages].reverse().find((m) => m.role === "user");

  // start listening as soon as the overlay opens
  useEffect(() => {
    if (voiceOpen && speech.supported) {
      const t = setTimeout(speech.start, 450);
      return () => clearTimeout(t);
    }
    if (!voiceOpen) {
      speech.stop();
      stopSpeaking();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [voiceOpen, speech.supported]);

  const status = speech.listening
    ? "聞いています…"
    : phase === "thinking"
      ? "考えています…"
      : phase === "speaking"
        ? "話しています"
        : speech.error ?? (speech.supported ? "マイクをタップして話しかけてください" : "このブラウザは音声入力に未対応です");

  const level = speech.listening ? "listening" : phase;

  return (
    <DeviceOverlay>
      <AnimatePresence>
        {voiceOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 z-[70] overflow-hidden bg-night text-white"
            role="dialog"
            aria-modal
            aria-label="MIRRA 音声エージェント"
          >
            <div aria-hidden className="absolute inset-0">
              <div className="animate-drift absolute -left-24 top-10 size-96 rounded-full bg-[#4c64ff]/30 blur-[100px]" />
              <div className="animate-drift absolute -right-24 bottom-24 size-96 rounded-full bg-[#c07bff]/25 blur-[100px] [animation-delay:-8s]" />
              <div className="grain absolute inset-0 opacity-[0.05] mix-blend-overlay" />
            </div>

            <div className="relative flex h-full flex-col px-6 pb-8 pt-[max(env(safe-area-inset-top),20px)] lg:pb-10 lg:pt-[62px]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] tracking-[0.34em] text-white/40">PERSONAL AGENT</p>
                  <p className="text-[17px] tracking-[0.2em]">MIRRA</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => dispatch({ t: "settings", patch: { voiceReply: !state.settings.voiceReply } })}
                    aria-label={state.settings.voiceReply ? "音声での返答をオフ" : "音声での返答をオン"}
                    aria-pressed={state.settings.voiceReply}
                    className="glass-dark grid size-10 place-items-center rounded-full"
                  >
                    {state.settings.voiceReply ? <Volume2 className="size-[17px]" strokeWidth={1.5} /> : <VolumeX className="size-[17px] text-white/50" strokeWidth={1.5} />}
                  </button>
                  <button onClick={() => setVoiceOpen(false)} aria-label="閉じる" className="glass-dark grid size-10 place-items-center rounded-full">
                    <X className="size-[18px]" strokeWidth={1.5} />
                  </button>
                </div>
              </div>

              {/* orb */}
              <div className="relative mt-6 flex flex-1 flex-col items-center justify-center">
                <div className="relative grid size-56 place-items-center">
                  {[0, 1, 2].map((i) => (
                    <motion.span
                      key={i}
                      className="absolute inset-0 rounded-full border border-[#a9b8ff]/30"
                      animate={
                        level === "listening"
                          ? { scale: [1, 1.5], opacity: [0.6, 0] }
                          : level === "speaking"
                            ? { scale: [1, 1.25], opacity: [0.5, 0] }
                            : { scale: 1, opacity: 0.15 }
                      }
                      transition={{ duration: level === "listening" ? 1.6 : 1.1, repeat: level === "idle" || level === "thinking" ? 0 : Infinity, delay: i * 0.45 }}
                    />
                  ))}
                  <motion.div
                    animate={
                      level === "speaking" ? { scale: [1, 1.08, 0.98, 1.05, 1] } : level === "listening" ? { scale: [1, 1.04, 1] } : { scale: 1 }
                    }
                    transition={{ duration: level === "speaking" ? 0.9 : 1.6, repeat: level === "idle" || level === "thinking" ? 0 : Infinity }}
                  >
                    <AiOrb className="size-40" thinking={phase === "thinking"} />
                  </motion.div>
                </div>

                <AnimatePresence mode="wait">
                  <motion.p key={status} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} className="font-jp mt-6 text-[12px] tracking-[0.12em] text-white/55">
                    {status}
                  </motion.p>
                </AnimatePresence>

                <div className="mt-4 min-h-[112px] w-full text-center">
                  {speech.listening || phase === "thinking" ? (
                    <p className="font-jp text-[18px] font-light leading-[1.7] text-white/90">{speech.interim || lastUser?.text || "…"}</p>
                  ) : hydrated && lastAgent ? (
                    <div>
                      <p className="font-jp text-[16px] font-light leading-[1.85] text-white/90">{lastAgent.text}</p>
                      <div className="text-left">
                        {lastAgent.actions
                          ?.filter((a) => a.action.type !== "show_products" && a.action.type !== "show_plan")
                          .map((a, i) => (
                            <ActionCard key={i} dark action={a.action} status={a.status} onResolve={(ok) => resolve(lastAgent.id, i, ok)} />
                          ))}
                      </div>
                    </div>
                  ) : (
                    <p className="font-display text-[26px] font-light italic text-white/85">How can I help, {state.settings.nickname}?</p>
                  )}
                </div>
              </div>

              {/* quick prompts */}
              <div className="no-scrollbar -mx-6 mb-5 flex gap-2 overflow-x-auto px-6">
                {quick.map((q) => (
                  <button key={q} onClick={() => void send(q, { voice: true })} className="font-jp shrink-0 rounded-full border border-white/10 bg-white/[0.06] px-3.5 py-2 text-[11.5px] text-white/75">
                    {q}
                  </button>
                ))}
              </div>

              <AnimatePresence>
                {(showKeyboard || !speech.supported) && (
                  <motion.form
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (!typed.trim()) return;
                      void send(typed, { voice: true });
                      setTyped("");
                    }}
                    className="glass-dark mb-4 flex items-center rounded-full py-1.5 pl-5 pr-1.5"
                  >
                    <input
                      value={typed}
                      onChange={(e) => setTyped(e.target.value)}
                      placeholder="MIRRAに話しかける…"
                      aria-label="メッセージ"
                      className="font-jp h-10 min-w-0 flex-1 bg-transparent text-[13.5px] text-white outline-none placeholder:text-white/35"
                    />
                    <button type="submit" className="font-jp h-10 rounded-full bg-white px-4 text-[12px] text-ink">
                      送信
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>

              <div className="flex items-center justify-center gap-8">
                <button onClick={() => setShowKeyboard((v) => !v)} aria-label="キーボード入力" className="glass-dark grid size-12 place-items-center rounded-full">
                  <Keyboard className="size-5 text-white/75" strokeWidth={1.5} />
                </button>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  disabled={!speech.supported}
                  onClick={() => {
                    if (phase === "speaking") stopSpeaking();
                    if (speech.listening) speech.stop();
                    else speech.start();
                  }}
                  aria-label={speech.listening ? "聞き取りを止める" : "話しかける"}
                  className={cn(
                    "grid size-[76px] place-items-center rounded-full transition-colors disabled:opacity-40",
                    speech.listening ? "bg-white text-ink shadow-[0_0_40px_rgba(169,184,255,0.7)]" : "bg-[linear-gradient(135deg,#b9c9ff,#e3c4ff)] text-ink",
                  )}
                >
                  {speech.listening ? <Square className="size-6 fill-current" /> : <Mic className="size-7" strokeWidth={1.6} />}
                </motion.button>
                <button
                  onClick={() => (phase === "speaking" ? stopSpeaking() : lastAgent && speak(lastAgent.text))}
                  aria-label="もう一度読み上げる"
                  className="glass-dark grid size-12 place-items-center rounded-full"
                >
                  <Volume2 className="size-5 text-white/75" strokeWidth={1.5} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </DeviceOverlay>
  );
}
