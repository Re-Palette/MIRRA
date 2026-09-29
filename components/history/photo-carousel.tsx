"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { motion, useMotionValue, animate, type PanInfo } from "framer-motion";
import { cn } from "@/lib/utils";

export function PhotoCarousel({ photos, alt }: { photos: string[]; alt: string }) {
  const [index, setIndex] = useState(0);
  const wrap = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);

  const go = (i: number) => {
    const w = wrap.current?.offsetWidth ?? 0;
    const next = Math.max(0, Math.min(photos.length - 1, i));
    setIndex(next);
    animate(x, -next * w, { type: "spring", stiffness: 320, damping: 36 });
  };

  const onDragEnd = (_: unknown, info: PanInfo) => {
    const w = wrap.current?.offsetWidth ?? 1;
    const swipe = info.offset.x + info.velocity.x * 0.2;
    if (swipe < -w * 0.18) go(index + 1);
    else if (swipe > w * 0.18) go(index - 1);
    else go(index);
  };

  return (
    <div ref={wrap} className="relative aspect-[4/5] overflow-hidden bg-[#eceef3]">
      <motion.div
        className="flex h-full"
        style={{ x }}
        drag={photos.length > 1 ? "x" : false}
        dragConstraints={wrap}
        dragElastic={0.12}
        onDragEnd={onDragEnd}
      >
        {photos.map((src, i) => (
          <div key={src + i} className="relative h-full w-full shrink-0">
            <Image src={src} alt={`${alt} ${i + 1}`} fill sizes="(max-width: 1024px) 90vw, 330px" draggable={false} className="pointer-events-none object-cover" />
          </div>
        ))}
      </motion.div>

      {photos.length > 1 && (
        <>
          <span className="absolute right-3 top-3 rounded-full bg-ink/40 px-2.5 py-1 text-[10.5px] tabular-nums text-white backdrop-blur-md">
            {index + 1}/{photos.length}
          </span>
          <div className="absolute inset-x-0 bottom-3 flex justify-center gap-1.5">
            {photos.map((_, i) => (
              <button
                key={i}
                aria-label={`${i + 1}枚目`}
                onClick={() => go(i)}
                className={cn("h-1.5 rounded-full bg-white transition-all duration-500", i === index ? "w-4 opacity-100" : "w-1.5 opacity-55")}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
