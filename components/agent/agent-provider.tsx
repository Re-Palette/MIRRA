"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { initialState } from "@/lib/agent/catalog";
import { localAgent } from "@/lib/agent/local-engine";
import {
  CONFIRM_ACTIONS,
  type AgentAction,
  type AgentMessage,
  type AgentReply,
  type AgentSettings,
  type AgentSnapshot,
  type AgentState,
} from "@/lib/agent/types";
import { salons } from "@/lib/data";

const STORAGE_KEY = "mirra-agent-v1";
const uid = () => Math.random().toString(36).slice(2, 10);
const today = () => new Date().toISOString().slice(0, 10);

type Op =
  | { t: "hydrate"; state: AgentState }
  | { t: "push"; msg: AgentMessage }
  | { t: "status"; msgId: string; index: number; status: "done" | "declined" }
  | { t: "apply"; action: AgentAction }
  | { t: "removeMemory"; id: string }
  | { t: "addMemory"; text: string; source: "user" | "agent" }
  | { t: "toggleReminder"; id: string }
  | { t: "removeReminder"; id: string }
  | { t: "settings"; patch: Partial<AgentSettings> }
  | { t: "clearLog" }
  | { t: "reset" };

function reducer(s: AgentState, op: Op): AgentState {
  switch (op.t) {
    case "hydrate":
      return op.state;
    case "push":
      return { ...s, messages: [...s.messages, op.msg].slice(-200) };
    case "status":
      return {
        ...s,
        messages: s.messages.map((m) =>
          m.id === op.msgId && m.actions ? { ...m, actions: m.actions.map((a, i) => (i === op.index ? { ...a, status: op.status } : a)) } : m,
        ),
      };
    case "addMemory":
      return { ...s, memories: [...s.memories, { id: uid(), text: op.text, date: today(), source: op.source }] };
    case "removeMemory":
      return { ...s, memories: s.memories.filter((m) => m.id !== op.id) };
    case "toggleReminder":
      return { ...s, reminders: s.reminders.map((r) => (r.id === op.id ? { ...r, done: !r.done } : r)) };
    case "removeReminder":
      return { ...s, reminders: s.reminders.filter((r) => r.id !== op.id) };
    case "settings":
      return { ...s, settings: { ...s.settings, ...op.patch } };
    case "clearLog":
      return { ...s, messages: [] };
    case "reset":
      return initialState;
    case "apply": {
      const a = op.action;
      switch (a.type) {
        case "remember":
          return reducer(s, { t: "addMemory", text: a.text, source: "agent" });
        case "forget":
          return reducer(s, { t: "removeMemory", id: a.id });
        case "add_to_cart": {
          const hit = s.cart.find((c) => c.productId === a.productId);
          return {
            ...s,
            cart: hit ? s.cart.map((c) => (c.productId === a.productId ? { ...c, qty: c.qty + 1 } : c)) : [...s.cart, { productId: a.productId, qty: 1 }],
          };
        }
        case "set_reminder":
          return { ...s, reminders: [...s.reminders, { id: uid(), title: a.title, when: a.when, done: false }] };
        case "book_salon": {
          const salon = salons.find((x) => x.id === a.salonId);
          if (!salon) return s;
          return {
            ...s,
            reservation: { salonId: salon.id, salon: `${salon.name} ${salon.area}`, stylist: salon.stylists[0].name, date: a.date, time: a.time, menu: a.menu },
          };
        }
        case "cancel_reservation":
          return { ...s, reservation: null };
        default:
          return s;
      }
    }
  }
}

type Phase = "idle" | "thinking" | "speaking";

type AgentContextValue = {
  state: AgentState;
  hydrated: boolean;
  phase: Phase;
  mode: "claude" | "demo";
  send: (text: string, opts?: { voice?: boolean }) => Promise<AgentMessage | null>;
  resolve: (msgId: string, index: number, approve: boolean) => void;
  speak: (text: string) => void;
  stopSpeaking: () => void;
  voiceOpen: boolean;
  setVoiceOpen: (v: boolean) => void;
  dispatch: React.Dispatch<Op>;
  snapshot: () => AgentSnapshot;
};

const AgentContext = createContext<AgentContextValue | null>(null);

export function useAgent() {
  const ctx = useContext(AgentContext);
  if (!ctx) throw new Error("useAgent must be used inside <AgentProvider>");
  return ctx;
}

export function AgentProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [hydrated, setHydrated] = useState(false);
  const [phase, setPhase] = useState<Phase>("idle");
  const [mode, setMode] = useState<"claude" | "demo">("demo");
  const [voiceOpen, setVoiceOpen] = useState(false);
  const stateRef = useRef(state);
  stateRef.current = state;
  const router = useRouter();

  // hydrate from this browser's storage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) dispatch({ t: "hydrate", state: { ...initialState, ...(JSON.parse(raw) as AgentState) } });
    } catch {
      /* storage unavailable: run with defaults */
    }
    setHydrated(true);
    fetch("/api/agent")
      .then((r) => r.json())
      .then((d: { enabled?: boolean }) => setMode(d.enabled ? "claude" : "demo"))
      .catch(() => setMode("demo"));
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* ignore quota / private mode */
    }
  }, [state, hydrated]);

  const snapshot = useCallback((): AgentSnapshot => {
    const s = stateRef.current;
    return {
      now: new Date().toLocaleString("ja-JP", { dateStyle: "full", timeStyle: "short" }),
      nickname: s.settings.nickname,
      memories: s.memories,
      reminders: s.reminders,
      cart: s.cart,
      reservation: s.reservation,
    };
  }, []);

  const stopSpeaking = useCallback(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    setPhase("idle");
  }, []);

  const speak = useCallback((text: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    const synth = window.speechSynthesis;
    synth.cancel();
    const u = new SpeechSynthesisUtterance(text.replace(/[・「」]/g, " "));
    u.lang = "ja-JP";
    u.rate = 1.05;
    u.pitch = 1.02;
    const voice = synth.getVoices().find((v) => v.lang.startsWith("ja") && /Kyoko|Nanami|Google|O-ren/i.test(v.name)) ?? synth.getVoices().find((v) => v.lang.startsWith("ja"));
    if (voice) u.voice = voice;
    u.onstart = () => setPhase("speaking");
    u.onend = () => setPhase("idle");
    u.onerror = () => setPhase("idle");
    synth.speak(u);
  }, []);

  const send = useCallback(
    async (text: string, opts?: { voice?: boolean }) => {
      const input = text.trim();
      if (!input) return null;
      const s = stateRef.current;
      dispatch({ t: "push", msg: { id: uid(), role: "user", text: input, ts: Date.now(), voice: opts?.voice } });
      setPhase("thinking");

      let reply: AgentReply;
      const started = Date.now();
      try {
        if (mode !== "claude") throw new Error("demo");
        const res = await fetch("/api/agent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: input,
            history: s.messages.slice(-20).map((m) => ({ role: m.role, text: m.text })),
            snapshot: snapshot(),
          }),
        });
        if (!res.ok) throw new Error(String(res.status));
        reply = (await res.json()) as AgentReply;
      } catch {
        reply = localAgent(input, snapshot());
        // keep a natural "thinking" beat in demo mode
        const wait = 700 - (Date.now() - started);
        if (wait > 0) await new Promise((r) => setTimeout(r, wait));
      }

      const msg: AgentMessage = {
        id: uid(),
        role: "agent",
        text: reply.text,
        ts: Date.now(),
        source: reply.source,
        actions: reply.actions.map((action) => ({ action, status: CONFIRM_ACTIONS.includes(action.type) ? "pending" : "done" })),
      };
      dispatch({ t: "push", msg });
      for (const a of reply.actions) {
        if (CONFIRM_ACTIONS.includes(a.type)) continue;
        if (a.type === "navigate") setTimeout(() => router.push(a.to), 900);
        else dispatch({ t: "apply", action: a });
      }
      setPhase("idle");
      if (opts?.voice && stateRef.current.settings.voiceReply) speak(reply.text);
      return msg;
    },
    [mode, router, snapshot, speak],
  );

  const resolve = useCallback((msgId: string, index: number, approve: boolean) => {
    const msg = stateRef.current.messages.find((m) => m.id === msgId);
    const entry = msg?.actions?.[index];
    if (!entry || entry.status !== "pending") return;
    if (approve) dispatch({ t: "apply", action: entry.action });
    dispatch({ t: "status", msgId, index, status: approve ? "done" : "declined" });
    const note = approve
      ? entry.action.type === "cancel_reservation"
        ? "予約をキャンセルしました。"
        : "予約を確定しました。カルテはサロンに共有済みです。"
      : "承知しました。今回は見送ります。";
    dispatch({ t: "push", msg: { id: uid(), role: "agent", text: note, ts: Date.now(), source: "demo" } });
  }, []);

  const value = useMemo(
    () => ({ state, hydrated, phase, mode, send, resolve, speak, stopSpeaking, voiceOpen, setVoiceOpen, dispatch, snapshot }),
    [state, hydrated, phase, mode, send, resolve, speak, stopSpeaking, voiceOpen, snapshot],
  );

  return <AgentContext.Provider value={value}>{children}</AgentContext.Provider>;
}
