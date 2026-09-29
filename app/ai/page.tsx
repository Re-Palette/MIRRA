"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUp, AudioLines, BrainCircuit, CalendarPlus, Mic, RotateCcw, ShieldPlus, Sun } from "lucide-react";
import { AiOrb } from "@/components/ai/ai-orb";
import { ActionCard } from "@/components/agent/action-card";
import { useAgent } from "@/components/agent/agent-provider";
import { useDevice } from "@/components/shell/device-context";
import { topics } from "@/lib/ai";
import type { AgentMessage } from "@/lib/agent/types";
import { cn } from "@/lib/utils";

const suggestions = [
  { id: "brief", icon: Sun, title: "今日のブリーフィング", sub: "天気・髪・予定をまとめて", prompt: "おはよう、今日のブリーフィングをお願い" },
  { id: "book", icon: CalendarPlus, title: "予約を取って", sub: "日時とメニューを伝えるだけ", prompt: "来週の土曜14時にLuce Hairでカラーを予約して" },
  { id: "diagnosis", icon: ShieldPlus, title: "髪のダメージ診断", sub: "カルテから今の状態を分析", prompt: "今の髪のダメージを診断してください" },
  { id: "memory", icon: BrainCircuit, title: "覚えておいて", sub: "好みや悩みを記憶します", prompt: "朝はドライヤーを10分以内にしたいって覚えておいて" },
] as const;

export default function AiPage() {
  const { scrollRef } = useDevice();
  const { state, hydrated, phase, mode, send, resolve, setVoiceOpen } = useAgent();
  const [input, setInput] = useState("");
  const [since, setSince] = useState(() => new Date().setHours(0, 0, 0, 0));
  const seen = useRef<Set<string> | null>(null);

  // messages present at first render are shown instantly; new agent replies type out
  if (seen.current === null && hydrated) seen.current = new Set(state.messages.map((m) => m.id));

  const messages = state.messages.filter((m) => m.ts >= since);
  const thinking = phase === "thinking";

  const scrollToEnd = useCallback(() => {
    const el = scrollRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [scrollRef]);

  useEffect(() => {
    scrollToEnd();
  }, [messages.length, thinking, scrollToEnd]);

  const submit = (text: string) => {
    if (!text.trim() || thinking) return;
    setInput("");
    void send(text);
  };

  const empty = messages.length === 0;

  return (
    <main className="relative flex min-h-full flex-col">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[520px] overflow-hidden">
        <div className="absolute -left-20 -top-24 size-80 rounded-full bg-accent blur-[90px]" />
        <div className="absolute -right-24 top-20 size-72 rounded-full bg-accent-2 blur-[90px]" />
      </div>

      <header className="sticky top-0 z-20 flex items-center gap-3 bg-canvas/70 px-5 pb-3 pt-[max(env(safe-area-inset-top),16px)] backdrop-blur-xl lg:pt-[60px]">
        <AiOrb className="size-10" thinking={thinking} />
        <div className="min-w-0 flex-1 leading-tight">
          <p className="flex items-center gap-2 text-[15px] tracking-[0.08em]">
            MIRA
            <span
              className={cn(
                "rounded-full px-2 py-[1px] text-[9px] tracking-[0.12em]",
                mode === "claude" ? "bg-ink text-white" : "bg-ink/[0.06] text-ink-soft",
              )}
              title={mode === "claude" ? "Claude で動作中" : "APIキー未設定のためデモエンジンで動作中"}
            >
              {mode === "claude" ? "LIVE" : "DEMO"}
            </span>
          </p>
          <p className="font-jp flex items-center gap-1.5 truncate text-[11px] text-ink-muted">
            <span className="size-1.5 shrink-0 rounded-full bg-[#34c38f]" />
            あなた専属のパーソナルエージェント
          </p>
        </div>
        <Link href="/ai/memory" aria-label="記憶と会話ログ" className="glass relative grid size-10 place-items-center rounded-full">
          <BrainCircuit className="size-[17px]" strokeWidth={1.5} />
          {hydrated && (
            <span className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-ink px-1 text-[9px] tabular-nums text-white">
              {state.memories.length}
            </span>
          )}
        </Link>
        <AnimatePresence>
          {!empty && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={() => setSince(Date.now())}
              aria-label="新しい会話"
              className="glass grid size-10 place-items-center rounded-full"
            >
              <RotateCcw className="size-[17px]" strokeWidth={1.5} />
            </motion.button>
          )}
        </AnimatePresence>
      </header>

      <div className="relative flex-1 px-5 pb-48">
        <AnimatePresence mode="popLayout">
          {empty ? (
            <motion.section key="empty" exit={{ opacity: 0, y: -20, filter: "blur(6px)" }} transition={{ duration: 0.4 }} className="pt-4">
              <motion.button
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                onClick={() => setVoiceOpen(true)}
                aria-label="音声で話しかける"
                className="relative mx-auto block"
              >
                <AiOrb className="size-28" />
                <span className="absolute -bottom-1 left-1/2 flex -translate-x-1/2 items-center gap-1 rounded-full bg-ink px-2.5 py-1 text-[10px] text-white shadow-float">
                  <Mic className="size-3" />
                  話しかける
                </span>
              </motion.button>
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                className="mt-8 text-center"
              >
                <p className="font-display text-[32px] font-light italic leading-tight">Hello, {state.settings.nickname}.</p>
                <p className="font-jp mt-2 text-[13px] font-light leading-[1.9] text-ink-soft">
                  相談も、予約も、買い物も。
                  <br />
                  あなたを覚えて、代わりに動きます。
                </p>
              </motion.div>

              <div className="mt-8 grid grid-cols-2 gap-3">
                {suggestions.map((s, i) => (
                  <motion.button
                    key={s.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + i * 0.07, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => submit(s.prompt)}
                    className="glass group rounded-[24px] p-4 text-left transition-shadow hover:shadow-float"
                  >
                    <span className="grid size-9 place-items-center rounded-full bg-[linear-gradient(135deg,#dde8ff,#f6e8ff)]">
                      <s.icon className="size-[17px]" strokeWidth={1.5} />
                    </span>
                    <p className="font-jp mt-4 text-[13px] font-medium">{s.title}</p>
                    <p className="font-jp mt-1 text-[10.5px] text-ink-muted">{s.sub}</p>
                  </motion.button>
                ))}
              </div>
            </motion.section>
          ) : (
            <motion.section key="chat" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5 pt-4">
              {messages.map((m) =>
                m.role === "user" ? (
                  <motion.div
                    key={m.id}
                    initial={{ opacity: 0, y: 16, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ type: "spring", stiffness: 360, damping: 30 }}
                    className="flex flex-col items-end"
                  >
                    <p className="font-jp max-w-[80%] rounded-[22px] rounded-br-[8px] bg-[linear-gradient(125deg,#b8c8ff,#d9c4ff)] px-4 py-3 text-[13px] leading-[1.7] text-ink shadow-soft">
                      {m.text}
                    </p>
                    {m.voice && (
                      <span className="mt-1 flex items-center gap-1 text-[10px] text-ink-muted">
                        <AudioLines className="size-3" />
                        音声
                      </span>
                    )}
                  </motion.div>
                ) : (
                  <AgentBubble key={m.id} msg={m} animate={!!seen.current && !seen.current.has(m.id)} onTick={scrollToEnd} onResolve={(i, ok) => resolve(m.id, i, ok)} />
                ),
              )}
              <AnimatePresence>
                {thinking && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex items-center gap-3">
                    <AiOrb className="size-7" thinking />
                    <div className="glass flex gap-1 rounded-full px-4 py-3">
                      {[0, 1, 2].map((i) => (
                        <motion.span
                          key={i}
                          className="size-1.5 rounded-full bg-ink/50"
                          animate={{ y: [0, -4, 0], opacity: [0.4, 1, 0.4] }}
                          transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15 }}
                        />
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.section>
          )}
        </AnimatePresence>
      </div>

      {/* Composer */}
      <div className="sticky bottom-[96px] z-20 mt-auto px-4 lg:bottom-[104px]">
        <div className="no-scrollbar -mx-4 mb-2.5 flex gap-2 overflow-x-auto px-4">
          {topics.map((t) => (
            <motion.button
              key={t}
              whileTap={{ scale: 0.94 }}
              onClick={() => submit(`${t}をお願いします`)}
              className="font-jp shrink-0 rounded-full border border-white/60 bg-white/70 px-3.5 py-2 text-[11.5px] text-ink-soft shadow-soft backdrop-blur-xl"
            >
              {t}
            </motion.button>
          ))}
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            submit(input);
          }}
          className="glass flex items-center gap-2 rounded-full py-1.5 pl-5 pr-1.5 shadow-float"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="MIRAに頼む…"
            aria-label="メッセージ"
            className="font-jp h-10 min-w-0 flex-1 bg-transparent text-[13.5px] outline-none placeholder:text-ink-muted"
          />
          <button type="button" onClick={() => setVoiceOpen(true)} aria-label="音声モード" className="grid size-9 place-items-center rounded-full text-ink-soft hover:bg-ink/5">
            <Mic className="size-[18px]" strokeWidth={1.5} />
          </button>
          <motion.button
            type="submit"
            whileTap={{ scale: 0.88 }}
            aria-label="送信"
            disabled={!input.trim() || thinking}
            className={cn(
              "grid size-10 place-items-center rounded-full transition-all duration-300",
              input.trim() ? "bg-ink text-white shadow-glow" : "bg-ink/10 text-ink/40",
            )}
          >
            <ArrowUp className="size-[18px]" strokeWidth={2} />
          </motion.button>
        </form>
      </div>
    </main>
  );
}

function AgentBubble({
  msg,
  animate,
  onTick,
  onResolve,
}: {
  msg: AgentMessage;
  animate: boolean;
  onTick: () => void;
  onResolve: (index: number, approve: boolean) => void;
}) {
  const [shown, setShown] = useState(animate ? 0 : msg.text.length);
  const done = shown >= msg.text.length;

  useEffect(() => {
    if (!animate) return;
    let i = 0;
    const id = setInterval(() => {
      i += 2;
      setShown(i);
      if (i % 24 === 0) onTick();
      if (i >= msg.text.length) {
        clearInterval(id);
        onTick();
      }
    }, 22);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="flex gap-3">
      <AiOrb className="mt-1 size-7 shrink-0" />
      <div className="min-w-0 flex-1">
        <div className="glass rounded-[22px] rounded-tl-[8px] px-4 py-3.5">
          <p className="font-jp whitespace-pre-line text-[13px] leading-[1.9] text-ink">
            {msg.text.slice(0, shown)}
            {!done && <span className="ml-0.5 inline-block h-3.5 w-[2px] translate-y-0.5 animate-pulse bg-ink/60" />}
          </p>
        </div>
        {done && msg.actions?.map((a, i) => <ActionCard key={i} action={a.action} status={a.status} onResolve={(ok) => onResolve(i, ok)} />)}
      </div>
    </motion.div>
  );
}
