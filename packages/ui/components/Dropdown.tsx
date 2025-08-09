import * as React from "react"
import { cn } from "../index"
import { ChevronDown, Check } from "lucide-react"

export interface DropdownOption {
  value: string
  label: string
  icon?: React.ReactNode
  disabled?: boolean
  divider?: boolean
}

export interface DropdownProps {
  options: DropdownOption[]
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  trigger?: React.ReactNode
  className?: string
  disabled?: boolean
  size?: 'sm' | 'md' | 'lg'
}

const sizeClasses = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg'
}

export function Dropdown({
  options,
  value,
  onChange,
  placeholder = "Select option",
  trigger,
  className,
  disabled = false,
  size = 'md'
}: DropdownProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [selectedOption, setSelectedOption] = React.useState<DropdownOption | null>(
    options.find(opt => opt.value === value) || null
  )

  const handleSelect = (option: DropdownOption) => {
    if (option.disabled || option.divider) return
    
    setSelectedOption(option)
    onChange?.(option.value)
    setIsOpen(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false)
    }
  }

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isOpen && !(event.target as Element).closest('.dropdown-container')) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  return (
    <div className={cn("relative dropdown-container", className)}>
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        onKeyDown={handleKeyDown}
        className={cn(
          "flex items-center justify-between w-full px-3 py-2 text-left bg-background border border-input rounded-md shadow-sm hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors",
          sizeClasses[size]
        )}
      >
        {trigger || (
          <span className={selectedOption ? "text-foreground" : "text-muted-foreground"}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        )}
        <ChevronDown className={cn(
          "h-4 w-4 transition-transform",
          isOpen && "rotate-180"
        )} />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-popover border border-border rounded-md shadow-lg max-h-60 overflow-auto">
          {options.map((option, index) => (
            <React.Fragment key={option.value || index}>
              {option.divider ? (
                <div className="h-px bg-border my-1" />
              ) : (
                <button
                  type="button"
                  onClick={() => handleSelect(option)}
                  disabled={option.disabled}
                  className={cn(
                    "flex items-center w-full px-3 py-2 text-left hover:bg-accent hover:text-accent-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-colors",
                    selectedOption?.value === option.value && "bg-accent text-accent-foreground",
                    sizeClasses[size]
                  )}
                >
                  {option.icon && <span className="mr-2">{option.icon}</span>}
                  <span className="flex-1">{option.label}</span>
                  {selectedOption?.value === option.value && (
                    <Check className="h-4 w-4 ml-2" />
                  )}
                </button>
              )}
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  )
}
