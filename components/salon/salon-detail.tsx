"use client";

import Image from "next/image";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronLeft, Clock, Heart, MapPin, Share, Sparkles, Star } from "lucide-react";
import type { Salon } from "@/lib/data";
import { DeviceOverlay } from "@/components/shell/device-context";
import { Button } from "@/components/ui/button";
import { cn, yen } from "@/lib/utils";

const days = [
  { d: "10/12", w: "月" },
  { d: "10/13", w: "火" },
  { d: "10/14", w: "水" },
  { d: "10/15", w: "木" },
  { d: "10/16", w: "金" },
];
const slots = ["11:00", "13:30", "14:00", "16:00", "18:30"];

export function SalonDetail({ salon, onClose }: { salon: Salon; onClose: () => void }) {
  const [menu, setMenu] = useState(0);
  const [day, setDay] = useState(0);
  const [slot, setSlot] = useState(2);
  const [fav, setFav] = useState(false);
  const [booked, setBooked] = useState(false);

  return (
    <DeviceOverlay>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, transition: { duration: 0.3, delay: 0.1 } }}
        className="absolute inset-0 bg-canvas"
        role="dialog"
        aria-modal
        aria-label={`${salon.name}の詳細`}
      >
        <div className="no-scrollbar h-full overflow-y-auto pb-40">
          {/* hero */}
          <div className="relative h-[380px] overflow-hidden">
            <motion.div initial={{ scale: 1.2, opacity: 0 }} animate={{ scale: 1.1, opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.8 }} className="absolute inset-0">
              <Image src={salon.image} alt="" fill sizes="402px" className="object-cover blur-2xl saturate-[1.2]" />
            </motion.div>
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(247,248,250,0.1),rgba(247,248,250,0.3)_60%,#f7f8fa)]" />

            <div className="absolute inset-x-0 top-0 flex items-center justify-between px-5 pt-[max(env(safe-area-inset-top),16px)] lg:pt-[60px]">
              <motion.button whileTap={{ scale: 0.9 }} onClick={onClose} aria-label="戻る" className="glass grid size-10 place-items-center rounded-full">
                <ChevronLeft className="size-5" strokeWidth={1.5} />
              </motion.button>
              <div className="flex gap-2">
                <button aria-label="共有" className="glass grid size-10 place-items-center rounded-full">
                  <Share className="size-[17px]" strokeWidth={1.5} />
                </button>
                <motion.button whileTap={{ scale: 0.85 }} onClick={() => setFav((f) => !f)} aria-label="お気に入り" aria-pressed={fav} className="glass grid size-10 place-items-center rounded-full">
                  <Heart className={cn("size-[17px] transition-colors", fav && "fill-[#ff5d7a] text-[#ff5d7a]")} strokeWidth={1.5} />
                </motion.button>
              </div>
            </div>

            <div className="absolute inset-x-0 bottom-6 flex flex-col items-center">
              <motion.div
                layoutId={`salon-img-${salon.id}`}
                className="relative h-[200px] w-[168px] overflow-hidden rounded-[32px] shadow-float ring-4 ring-white/70"
                transition={{ type: "spring", stiffness: 260, damping: 30 }}
              >
                <Image src={salon.image} alt={salon.name} fill sizes="168px" className="object-cover" />
              </motion.div>
            </div>
          </div>

          <div className="px-6 text-center">
            <motion.h2 layoutId={`salon-name-${salon.id}`} className="text-[26px] font-light tracking-[0.08em]">
              {salon.name}
              <span className="font-jp ml-2 text-[13px] text-ink-muted">{salon.area}</span>
            </motion.h2>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <div className="mt-2 flex items-center justify-center gap-4 text-[12px] text-ink-soft">
                <span className="flex items-center gap-1">
                  <Star className="size-3.5 fill-[#f5b94a] text-[#f5b94a]" />
                  <span className="tabular-nums">{salon.rating}</span>
                  <span className="text-ink-muted">（{salon.reviews}件）</span>
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="size-3.5" />
                  {salon.distance}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="size-3.5" />
                  {salon.hours}
                </span>
              </div>
              <div className="mt-3 flex justify-center gap-1.5">
                {salon.specialties.map((t) => (
                  <span key={t} className="font-jp rounded-full bg-accent px-3 py-1 text-[11px] text-[#3c4a7a]">
                    {t}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>

          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.7, ease: [0.22, 1, 0.36, 1] }} className="mt-6 space-y-4 px-4">
            <div className="rounded-card bg-[linear-gradient(125deg,#dde8ff,#f6e8ff)] p-5">
              <p className="flex items-center gap-1.5 text-[10.5px] tracking-[0.28em] text-ink/60">
                <Sparkles className="size-3" />
                WHY IT MATCHES · {salon.match}%
              </p>
              <p className="font-jp mt-2 text-[13px] leading-[1.9] text-ink/80">{salon.description}</p>
            </div>

            <section className="glass rounded-card p-5">
              <h3 className="font-jp text-[14px] font-medium">スタイリスト</h3>
              <div className="mt-3 flex gap-4">
                {salon.stylists.map((st) => (
                  <div key={st.name} className="flex items-center gap-2.5">
                    <div className="relative size-11 overflow-hidden rounded-full ring-2 ring-white">
                      <Image src={st.image} alt="" fill sizes="44px" className="object-cover" />
                    </div>
                    <div className="leading-tight">
                      <p className="font-jp text-[12.5px]">{st.name}</p>
                      <p className="text-[10px] tracking-[0.1em] text-ink-muted">{st.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="glass rounded-card p-5">
              <h3 className="font-jp text-[14px] font-medium">メニュー</h3>
              <div className="mt-3 space-y-2">
                {salon.menus.map((m, i) => (
                  <button
                    key={m.name}
                    onClick={() => setMenu(i)}
                    className={cn(
                      "relative flex w-full items-center justify-between rounded-[18px] px-4 py-3 text-left transition-colors",
                      menu === i ? "text-white" : "bg-white/60",
                    )}
                  >
                    {menu === i && <motion.span layoutId="menu-sel" className="absolute inset-0 rounded-[18px] bg-ink" />}
                    <span className="relative">
                      <span className="font-jp block text-[13px]">{m.name}</span>
                      <span className={cn("text-[10.5px]", menu === i ? "text-white/60" : "text-ink-muted")}>{m.time}</span>
                    </span>
                    <span className="relative text-[13px] tabular-nums">{yen(m.price)}</span>
                  </button>
                ))}
              </div>
            </section>

            <section className="glass rounded-card p-5">
              <h3 className="font-jp text-[14px] font-medium">日時を選択</h3>
              <div className="no-scrollbar -mx-5 mt-3 flex gap-2 overflow-x-auto px-5">
                {days.map((d, i) => (
                  <button
                    key={d.d}
                    onClick={() => setDay(i)}
                    className={cn(
                      "flex h-16 w-14 shrink-0 flex-col items-center justify-center rounded-[18px] transition-all",
                      day === i ? "bg-ink text-white shadow-float" : "bg-white/70 text-ink",
                    )}
                  >
                    <span className={cn("font-jp text-[10px]", day === i ? "text-white/60" : "text-ink-muted")}>{d.w}</span>
                    <span className="mt-0.5 text-[13px] tabular-nums">{d.d}</span>
                  </button>
                ))}
              </div>
              <div className="mt-3 grid grid-cols-5 gap-1.5">
                {slots.map((s, i) => (
                  <button
                    key={s}
                    onClick={() => setSlot(i)}
                    className={cn(
                      "rounded-full py-2 text-[11.5px] tabular-nums transition-colors",
                      slot === i ? "bg-[linear-gradient(120deg,#dde8ff,#f6e8ff)] text-ink ring-1 ring-ink/20" : "bg-white/60 text-ink-soft",
                    )}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </section>
          </motion.div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ y: 120 }}
          animate={{ y: 0 }}
          exit={{ y: 120 }}
          transition={{ type: "spring", stiffness: 300, damping: 32, delay: 0.15 }}
          className="absolute inset-x-0 bottom-0 px-4 pb-[max(env(safe-area-inset-bottom),16px)] lg:pb-7"
        >
          <div className="glass flex items-center gap-3 rounded-[30px] p-2 pl-5 shadow-float">
            <div className="min-w-0 flex-1 leading-tight">
              <p className="font-jp truncate text-[11px] text-ink-muted">
                {days[day].d}（{days[day].w}）{slots[slot]} · {salon.menus[menu].name}
              </p>
              <p className="text-[17px] tabular-nums">{yen(salon.menus[menu].price)}</p>
            </div>
            <Button size="lg" onClick={() => setBooked(true)} className="font-jp">
              このサロンを予約する
            </Button>
          </div>
        </motion.div>

        <AnimatePresence>
          {booked && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-10 grid place-items-center bg-ink/30 px-8 backdrop-blur-md"
              onClick={() => setBooked(false)}
            >
              <motion.div
                initial={{ scale: 0.85, y: 30, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 26 }}
                className="glass w-full rounded-[32px] p-7 text-center"
                onClick={(e) => e.stopPropagation()}
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 16, delay: 0.15 }}
                  className="mx-auto grid size-16 place-items-center rounded-full bg-ink text-white shadow-glow"
                >
                  <Check className="size-7" strokeWidth={2} />
                </motion.div>
                <p className="font-jp mt-5 text-[17px]">ご予約が完了しました</p>
                <p className="font-jp mt-2 text-[12px] leading-[1.8] text-ink-soft">
                  {salon.name} {salon.area}
                  <br />
                  {days[day].d}（{days[day].w}）{slots[slot]}〜
                  <br />
                  カルテは自動でサロンに共有されます。
                </p>
                <Button className="font-jp mt-6 w-full" onClick={onClose}>
                  閉じる
                </Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </DeviceOverlay>
  );
}
