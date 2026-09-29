"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { useDevice } from "@/components/shell/device-context";

export const easeApple = [0.32, 0.72, 0, 1] as const;
export const easeOutExpo = [0.22, 1, 0.36, 1] as const;

/** Fades content up as it scrolls into the device viewport. */
export function Reveal({ delay = 0, y = 24, ...props }: HTMLMotionProps<"div"> & { delay?: number; y?: number }) {
  const { scrollRef } = useDevice();
  return (
    <motion.div
      initial={{ opacity: 0, y, filter: "blur(6px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ root: scrollRef, once: true, margin: "0px 0px -40px 0px" }}
      transition={{ duration: 0.9, delay, ease: easeOutExpo }}
      {...props}
    />
  );
}
