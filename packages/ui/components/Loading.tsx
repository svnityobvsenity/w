import * as React from "react"
import { cn } from "../index"
import { cva, type VariantProps } from "class-variance-authority"

const loadingVariants = cva(
  "animate-spin rounded-full border-2 border-current border-t-transparent",
  {
    variants: {
      size: {
        sm: "h-4 w-4",
        md: "h-6 w-6",
        lg: "h-8 w-8",
        xl: "h-12 w-12",
      },
      variant: {
        default: "text-primary",
        secondary: "text-secondary",
        accent: "text-accent-primary",
        white: "text-white",
      },
    },
    defaultVariants: {
      size: "md",
      variant: "default",
    },
  }
)

export interface LoadingProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof loadingVariants> {
  text?: string
  fullScreen?: boolean
}

export function Loading({
  className,
  size,
  variant,
  text,
  fullScreen = false,
  ...props
}: LoadingProps) {
  const content = (
    <div className="flex flex-col items-center justify-center space-y-2" {...props}>
      <div className={cn(loadingVariants({ size, variant, className }))} />
      {text && (
        <p className="text-sm text-muted-foreground">{text}</p>
      )}
    </div>
  )

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
        {content}
      </div>
    )
  }

  return content
}

// Individual spinner component
export function Spinner({ className, size, variant, ...props }: Omit<LoadingProps, 'text' | 'fullScreen'>) {
  return (
    <div className={cn(loadingVariants({ size, variant, className }))} {...props} />
  )
}
