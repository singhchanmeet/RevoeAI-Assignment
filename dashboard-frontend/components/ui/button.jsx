// components/ui/button.jsx
import * as React from "react"
import { cva } from "class-variance-authority"
import { cn } from "../../lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-all duration-300 transform hover:scale-105 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 relative overflow-hidden",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-r from-primary via-accent to-secondary text-primary-foreground shadow-lg hover:shadow-primary/50 hover:animate-pulse before:absolute before:inset-0 before:bg-white/20 before:transform before:translate-x-[-150%] hover:before:translate-x-[150%] before:transition-transform before:duration-700 neon-border",
        destructive: "bg-gradient-to-r from-destructive via-red-500 to-destructive text-destructive-foreground shadow-lg hover:shadow-destructive/50 animate-border-pulse",
        outline: "border-2 border-primary/50 bg-background/50 backdrop-blur-sm shadow-lg hover:border-primary hover:text-primary hover:scale-105 neon-text",
        secondary: "bg-gradient-to-r from-secondary via-cyan-400 to-blue-500 text-secondary-foreground shadow-lg hover:shadow-secondary/50",
        ghost: "hover:bg-gradient-to-r hover:from-primary/20 hover:to-secondary/20 hover:text-accent-foreground backdrop-blur-sm",
        link: "text-primary underline-offset-4 hover:underline hover:text-primary/80 transition-colors neon-text",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const Button = React.forwardRef(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }