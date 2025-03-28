// components/ui/input.jsx
import * as React from "react"
import { cn } from "../../lib/utils"

const Input = React.forwardRef(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-9 w-full rounded-lg border-2 border-input/50 bg-background/50 backdrop-blur-sm px-3 py-1 text-sm shadow-lg transition-all duration-300 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground/70 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary/50 hover:border-primary/30 disabled:cursor-not-allowed disabled:opacity-50 hover:shadow-primary/20",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
