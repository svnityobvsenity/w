import React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-98',
  {
    variants: {
      variant: {
        default: 'bg-discord-accent-blue text-white hover:bg-discord-accent-blue/90 focus-visible:ring-discord-accent-blue',
        secondary: 'bg-discord-secondary text-discord-text-primary hover:bg-discord-tertiary focus-visible:ring-discord-accent-blue',
        destructive: 'bg-discord-accent-red text-white hover:bg-discord-accent-red/90 focus-visible:ring-discord-accent-red',
        outline: 'border border-discord-elevated bg-transparent text-discord-text-primary hover:bg-discord-secondary focus-visible:ring-discord-accent-blue',
        ghost: 'text-discord-text-primary hover:bg-discord-secondary focus-visible:ring-discord-accent-blue',
        link: 'text-discord-text-link underline-offset-4 hover:underline focus-visible:ring-discord-accent-blue',
        discord: 'bg-discord-accent-blue text-white hover:bg-discord-accent-blue/90 focus-visible:ring-discord-accent-blue',
        discordSecondary: 'bg-discord-secondary text-discord-text-primary hover:bg-discord-tertiary focus-visible:ring-discord-accent-blue',
        discordTertiary: 'bg-discord-tertiary text-discord-text-primary hover:bg-discord-elevated focus-visible:ring-discord-accent-blue',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-8 px-3 text-xs',
        lg: 'h-12 px-8 text-base',
        xl: 'h-14 px-10 text-lg',
        icon: 'h-10 w-10',
        iconSm: 'h-8 w-8',
        iconLg: 'h-12 w-12',
      },
      rounded: {
        default: 'rounded-md',
        full: 'rounded-full',
        none: 'rounded-none',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      rounded: 'default',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, rounded, loading, leftIcon, rightIcon, children, disabled, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, rounded, className }))}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <svg
            className="mr-2 h-4 w-4 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {!loading && leftIcon && <span className="mr-2">{leftIcon}</span>}
        {children}
        {!loading && rightIcon && <span className="ml-2">{rightIcon}</span>}
      </button>
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
