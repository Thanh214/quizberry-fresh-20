
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
        success:
          "border-transparent bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
        warning:
          "border-transparent bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
        info:
          "border-transparent bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
        purple:
          "border-transparent bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  neon?: boolean;
  neonColor?: "purple" | "blue" | "green" | "red" | "pink";
}

function Badge({ className, variant, neon, neonColor = "purple", ...props }: BadgeProps) {
  const neonClasses = {
    purple: "shadow-[0_0_5px_rgba(168,85,247,0.5)]",
    blue: "shadow-[0_0_5px_rgba(59,130,246,0.5)]",
    green: "shadow-[0_0_5px_rgba(34,197,94,0.5)]",
    red: "shadow-[0_0_5px_rgba(239,68,68,0.5)]",
    pink: "shadow-[0_0_5px_rgba(236,72,153,0.5)]",
  };

  return (
    <div
      className={cn(
        badgeVariants({ variant }), 
        neon ? neonClasses[neonColor] : "", 
        className
      )}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
