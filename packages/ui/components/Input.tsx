import React from 'react'
import { cn } from '../../lib/utils'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  variant?: 'default' | 'discord' | 'search'
  size?: 'sm' | 'md' | 'lg'
}

const inputVariants = {
  default: 'border-input bg-background text-foreground',
  discord: 'border-discord-elevated bg-discord-secondary text-discord-text-primary placeholder:text-discord-text-muted focus:border-discord-accent-blue',
  search: 'border-discord-elevated bg-discord-tertiary text-discord-text-primary placeholder:text-discord-text-muted focus:border-discord-accent-blue',
}

const inputSizes = {
  sm: 'h-8 px-3 text-sm',
  md: 'h-10 px-4 text-base',
  lg: 'h-12 px-4 text-lg',
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, error, leftIcon, rightIcon, variant = 'default', size = 'md', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-discord-text-secondary mb-2">
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-discord-text-muted">
              {leftIcon}
            </div>
          )}
          <input
            type={type}
            className={cn(
              'flex w-full rounded-md border bg-transparent transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
              inputVariants[variant],
              inputSizes[size],
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              error && 'border-discord-accent-red focus-visible:ring-discord-accent-red',
              className
            )}
            ref={ref}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-discord-text-muted">
              {rightIcon}
            </div>
          )}
        </div>
        {error && (
          <p className="mt-1 text-sm text-discord-accent-red">{error}</p>
        )}
      </div>
    )
  }
)
Input.displayName = 'Input'

export default Input
