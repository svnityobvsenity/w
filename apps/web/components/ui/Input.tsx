import React from 'react'
import { cn } from '../../lib/utils'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, leftIcon, rightIcon, ...props }, ref) => {
    return (
      <div className="relative">
        {leftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-discord-text-secondary">
            {leftIcon}
          </div>
        )}
        <input
          className={cn(
            'flex h-10 w-full rounded-md border border-discord-elevated bg-discord-secondary px-3 py-2 text-sm text-discord-text-primary placeholder:text-discord-text-secondary focus:outline-none focus:ring-2 focus:ring-discord-accent-blue focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50',
            leftIcon && 'pl-10',
            rightIcon && 'pr-10',
            error && 'border-discord-accent-red focus:ring-discord-accent-red',
            className
          )}
          ref={ref}
          {...props}
        />
        {rightIcon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-discord-text-secondary">
            {rightIcon}
          </div>
        )}
      </div>
    )
  }
)
Input.displayName = 'Input'

export { Input }
