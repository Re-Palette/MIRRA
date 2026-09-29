import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-[3px] text-[10.5px] font-normal tracking-[0.04em]",
  {
    variants: {
      variant: {
        default: "bg-accent text-[#3c4a7a]",
        lilac: "bg-accent-2 text-[#6a4a86]",
        outline: "border border-ink/10 text-ink-soft",
        ink: "bg-ink text-white",
        glass: "bg-white/70 text-ink backdrop-blur-md",
        success: "bg-[#e3f6ec] text-[#1f7a4d]",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

function Badge({ className, variant, ...props }: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return <span data-slot="badge" className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
