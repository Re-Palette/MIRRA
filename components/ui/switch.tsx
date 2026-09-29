"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function Switch({
  checked,
  onCheckedChange,
  label,
}: {
  checked: boolean;
  onCheckedChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={(e) => {
        e.stopPropagation();
        onCheckedChange(!checked);
      }}
      className={cn(
        "relative flex h-[30px] w-[50px] shrink-0 items-center rounded-full p-[2px] transition-colors duration-300",
        checked ? "justify-end bg-ink" : "justify-start bg-ink/12",
      )}
    >
      <motion.span layout transition={{ type: "spring", stiffness: 600, damping: 36 }} className="size-[26px] rounded-full bg-white shadow-[0_2px_6px_rgba(0,0,0,0.18)]" />
    </button>
  );
}
