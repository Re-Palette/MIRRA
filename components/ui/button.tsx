import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap font-medium transition-[transform,background-color,box-shadow,opacity] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50 outline-none focus-visible:ring-2 focus-visible:ring-[#9fb5ff] focus-visible:ring-offset-2 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-ink text-white shadow-[0_8px_20px_-8px_rgba(16,24,40,0.5)] hover:bg-[#1d2939]",
        glass: "glass text-ink hover:bg-white/90",
        outline: "border border-ink/10 bg-white/60 text-ink hover:bg-white",
        ghost: "text-ink hover:bg-ink/5",
        light: "bg-white text-ink shadow-soft hover:bg-white/90",
        accent: "bg-[linear-gradient(120deg,#dde8ff,#f6e8ff)] text-ink hover:brightness-[1.02]",
      },
      size: {
        default: "h-11 rounded-full px-5 text-[13px] tracking-[0.04em]",
        sm: "h-9 rounded-full px-4 text-[12px] tracking-[0.04em]",
        lg: "h-[52px] rounded-full px-7 text-[14px] tracking-[0.06em]",
        icon: "size-10 rounded-full",
        "icon-sm": "size-8 rounded-full",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> & VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "button";
  return <Comp data-slot="button" className={cn(buttonVariants({ variant, size, className }))} {...props} />;
}

export { Button, buttonVariants };
