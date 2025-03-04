
import * as React from "react"

import { cn } from "@/lib/utils"

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  neon?: boolean;
  neonColor?: 'blue' | 'purple' | 'green' | 'red' | 'pink';
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, neon = false, neonColor = 'blue', ...props }, ref) => {
    const neonClasses = {
      blue: 'focus:ring-blue-500 focus:border-blue-500 focus:shadow-[0_0_10px_rgba(59,130,246,0.5)]',
      purple: 'focus:ring-purple-500 focus:border-purple-500 focus:shadow-[0_0_10px_rgba(168,85,247,0.5)]',
      green: 'focus:ring-green-500 focus:border-green-500 focus:shadow-[0_0_10px_rgba(34,197,94,0.5)]',
      red: 'focus:ring-red-500 focus:border-red-500 focus:shadow-[0_0_10px_rgba(239,68,68,0.5)]',
      pink: 'focus:ring-pink-500 focus:border-pink-500 focus:shadow-[0_0_10px_rgba(236,72,153,0.5)]',
    };

    return (
      <textarea
        className={cn(
          "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-300",
          neon ? neonClasses[neonColor] : "",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }
