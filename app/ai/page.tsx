"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUp, CalendarHeart, Droplet, Mic, Package, RotateCcw, ShieldPlus, Sparkles } from "lucide-react";
import { AiOrb } from "@/components/ai/ai-orb";
import { ProductVisual } from "@/components/ui/product-visual";
import { useDevice } from "@/components/shell/device-context";
import { replyFor, suggestions, topics, type AiReply } from "@/lib/ai";
import { user } from "@/lib/data";
import { cn, yen } from "@/lib/utils";

type Message =
  | { id: number; role: "user"; text: string }
  | { id: number; role: "ai"; reply: AiReply; done: boolean };

const suggestionIcons = { diagnosis: ShieldPlus, care: Droplet, products: Package, next: CalendarHeart } as const;

export default function AiPage() {
  const { scrollRef } = useDevice();
  const [messages, setMessages] = useState<Message[]>([]);
  const [thinking, setThinking] = useState(false);
  const [input, setInput] = useState("");
  const idRef = useRef(0);

  const scrollToEnd = useCallback(() => {
    const el = scrollRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [scrollRef]);

  useEffect(() => {
    scrollToEnd();
  }, [messages.length, thinking, scrollToEnd]);

  const send = (text: string) => {
    const t = text.trim();
    if (!t || thinking) return;
    setInput("");
    setMessages((m) => [...m, { id: ++idRef.current, role: "user", text: t }]);
    setThinking(true);
    setTimeout(() => {
      setThinking(false);
      setMessages((m) => [...m, { id: ++idRef.current, role: "ai", reply: replyFor(t), done: false }]);
    }, 1100);
  };

  const markDone = (id: number) => setMessages((m) => m.map((x) => (x.id === id && x.role === "ai" ? { ...x, done: true } : x)));

  const empty = messages.length === 0;

  return (
    <main className="relative flex min-h-full flex-col">
      {/* soft ambient */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[520px] overflow-hidden">
        <div className="absolute -left-20 -top-24 size-80 rounded-full bg-accent blur-[90px]" />
        <div className="absolute -right-24 top-20 size-72 rounded-full bg-accent-2 blur-[90px]" />
      </div>

      <header className="sticky top-0 z-20 flex items-center gap-3 bg-canvas/70 px-5 pb-3 pt-[max(env(safe-area-inset-top),16px)] backdrop-blur-xl lg:pt-[60px]">
        <AiOrb className="size-10" thinking={thinking} />
        <div className="flex-1 leading-tight">
          <p className="text-[15px] tracking-[0.08em]">MIRRA AI</p>
          <p className="font-jp flex items-center gap-1.5 text-[11px] text-ink-muted">
            <span className="size-1.5 rounded-full bg-[#34c38f]" />
            あなた専属のビューティーコンシェルジュ
          </p>
        </div>
        <AnimatePresence>
          {!empty && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={() => setMessages([])}
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
            <motion.section key="empty" exit={{ opacity: 0, y: -20, filter: "blur(6px)" }} transition={{ duration: 0.4 }} className="pt-6">
              <motion.div initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}>
                <AiOrb className="mx-auto size-28" />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                className="mt-8 text-center"
              >
                <p className="font-display text-[32px] font-light italic leading-tight">Hello, {user.name.split(" ")[1]}.</p>
                <p className="font-jp mt-2 text-[13px] font-light leading-[1.9] text-ink-soft">
                  あなたの髪のことなら、なんでも。
                  <br />
                  カルテをもとに24時間いつでもお答えします。
                </p>
              </motion.div>

              <div className="mt-8 grid grid-cols-2 gap-3">
                {suggestions.map((s, i) => {
                  const Icon = suggestionIcons[s.id];
                  return (
                    <motion.button
                      key={s.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 + i * 0.07, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                      whileTap={{ scale: 0.96 }}
                      onClick={() => send(s.prompt)}
                      className="glass group rounded-[24px] p-4 text-left transition-shadow hover:shadow-float"
                    >
                      <span className="grid size-9 place-items-center rounded-full bg-[linear-gradient(135deg,#dde8ff,#f6e8ff)]">
                        <Icon className="size-[17px]" strokeWidth={1.5} />
                      </span>
                      <p className="font-jp mt-4 text-[13px] font-medium">{s.title}</p>
                      <p className="font-jp mt-1 text-[10.5px] text-ink-muted">{s.sub}</p>
                    </motion.button>
                  );
                })}
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
                    className="flex justify-end"
                  >
                    <p className="font-jp max-w-[80%] rounded-[22px] rounded-br-[8px] bg-[linear-gradient(125deg,#b8c8ff,#d9c4ff)] px-4 py-3 text-[13px] leading-[1.7] text-ink shadow-soft">
                      {m.text}
                    </p>
                  </motion.div>
                ) : (
                  <AiMessage key={m.id} reply={m.reply} done={m.done} onDone={() => markDone(m.id)} onTick={scrollToEnd} />
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
              onClick={() => send(`${t}をお願いします`)}
              className="font-jp shrink-0 rounded-full border border-white/60 bg-white/70 px-3.5 py-2 text-[11.5px] text-ink-soft shadow-soft backdrop-blur-xl"
            >
              {t}
            </motion.button>
          ))}
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
          className="glass flex items-center gap-2 rounded-full py-1.5 pl-5 pr-1.5 shadow-float"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="メッセージを入力…"
            aria-label="メッセージ"
            className="font-jp h-10 min-w-0 flex-1 bg-transparent text-[13.5px] outline-none placeholder:text-ink-muted"
          />
          <button type="button" aria-label="音声入力" className="grid size-9 place-items-center rounded-full text-ink-soft hover:bg-ink/5">
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

function AiMessage({ reply, done, onDone, onTick }: { reply: AiReply; done: boolean; onDone: () => void; onTick: () => void }) {
  const [shown, setShown] = useState(done ? reply.text.length : 0);

  useEffect(() => {
    if (done) return;
    let i = 0;
    const id = setInterval(() => {
      i += 2;
      setShown(i);
      if (i % 24 === 0) onTick();
      if (i >= reply.text.length) {
        clearInterval(id);
        onDone();
      }
    }, 22);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const streaming = shown < reply.text.length;

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="flex gap-3">
      <AiOrb className="mt-1 size-7 shrink-0" />
      <div className="min-w-0 flex-1">
        <div className="glass rounded-[22px] rounded-tl-[8px] px-4 py-3.5">
          <p className="font-jp text-[13px] leading-[1.9] text-ink">
            {reply.text.slice(0, shown)}
            {streaming && <span className="ml-0.5 inline-block h-3.5 w-[2px] translate-y-0.5 animate-pulse bg-ink/60" />}
          </p>
        </div>

        <AnimatePresence>
          {done && reply.diagnosis && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass mt-2.5 grid grid-cols-3 gap-2 rounded-[22px] p-3">
              {reply.diagnosis.map((d, i) => (
                <div key={d.label} className="rounded-[16px] bg-white/70 p-3 text-center">
                  <p className="font-jp text-[10px] text-ink-muted">{d.label}</p>
                  <p className="mt-1 text-[14px]">{d.value}</p>
                  <div className="mt-2 h-1 overflow-hidden rounded-full bg-ink/[0.06]">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${d.level}%` }}
                      transition={{ delay: 0.2 + i * 0.1, duration: 1 }}
                      className="h-full rounded-full bg-[linear-gradient(90deg,#9fb4ff,#c79bff)]"
                    />
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {done && reply.plan && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass mt-2.5 rounded-[22px] p-4">
              <p className="font-jp flex items-center gap-1.5 text-[12px] font-medium">
                <Sparkles className="size-3.5 text-[#8b7bff]" />
                おすすめのプラン
              </p>
              <ol className="mt-3 space-y-2.5">
                {reply.plan.map((p, i) => (
                  <motion.li
                    key={p.title}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.08 }}
                    className="flex items-center gap-3"
                  >
                    <span className="grid size-8 shrink-0 place-items-center rounded-full bg-[linear-gradient(135deg,#dde8ff,#f6e8ff)] text-[12px] tabular-nums">
                      {i + 1}
                    </span>
                    <div className="leading-tight">
                      <p className="font-jp text-[12.5px]">{p.title}</p>
                      <p className="font-jp mt-0.5 text-[10.5px] text-ink-muted">{p.detail}</p>
                    </div>
                  </motion.li>
                ))}
              </ol>
            </motion.div>
          )}

          {done && reply.products && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="no-scrollbar -mr-5 mt-2.5 flex gap-2.5 overflow-x-auto pr-5">
              {reply.products.map((p) => (
                <div key={p.id} className="glass w-[132px] shrink-0 rounded-[20px] p-2">
                  <div className="relative aspect-square overflow-hidden rounded-[14px] bg-[#f1f0ee]">
                    <ProductVisual kind={p.kind} />
                  </div>
                  <p className="font-jp mt-2 truncate px-1 text-[11.5px]">{p.name}</p>
                  <div className="flex items-center justify-between px-1 pb-0.5 pt-1">
                    <span className="text-[12px] tabular-nums">{yen(p.price)}</span>
                    <span className="text-[10px] text-[#6a4a86]">{p.match}%</span>
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

