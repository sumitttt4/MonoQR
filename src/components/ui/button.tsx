import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
    "inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
    {
        variants: {
            variant: {
                default: "bg-zinc-900 text-zinc-50 hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200 shadow-[0_1px_2px_rgba(0,0,0,0.1),0_1px_0_rgba(255,255,255,0.1)_inset] dark:shadow-[0_1px_2px_rgba(0,0,0,0.5),0_1px_0_rgba(255,255,255,0.1)_inset] transition-all active:scale-95",
                destructive:
                    "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm",
                outline:
                    "border border-zinc-200 bg-white hover:bg-zinc-50 hover:text-zinc-900 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:bg-zinc-800 dark:hover:text-zinc-50 shadow-sm transition-colors",
                secondary:
                    "bg-zinc-100 text-zinc-900 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-50 dark:hover:bg-zinc-700 shadow-sm",
                ghost: "hover:bg-zinc-100 text-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800",
                link: "text-zinc-900 dark:text-zinc-100 underline-offset-4 hover:underline",

                // New Premium Variant: "Shiny"
                shiny: "relative overflow-hidden rounded-full bg-zinc-900 text-white shadow-xl hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 ring-1 ring-zinc-900/5 ring-offset-1 ring-offset-zinc-200 dark:ring-offset-zinc-900",
            },
            size: {
                default: "h-9 px-4 py-2 rounded-lg text-sm", // Standardizing on h-9 (small/modern)
                sm: "h-8 rounded-lg px-3 text-xs",
                lg: "h-11 rounded-xl px-8",
                xl: "h-14 rounded-full px-10 text-lg font-semibold",
                icon: "h-9 w-9 rounded-lg",
            },
            shape: {
                default: "",
                pill: "rounded-full"
            }
        },
        defaultVariants: {
            variant: "default",
            size: "default",
            shape: "default"
        },
    }
)

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, shape, asChild = false, children, ...props }, ref) => {
        const Comp = asChild ? Slot : "button"
        return (
            <Comp
                className={cn(buttonVariants({ variant, size, shape, className }))}
                ref={ref}
                {...props}
            >
                {variant === 'shiny' ? (
                    <>
                        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] animate-[shimmer_2.5s_infinite]" />
                        {children}
                    </>
                ) : children}
            </Comp>
        )
    }
)
Button.displayName = "Button"

export { Button, buttonVariants }
