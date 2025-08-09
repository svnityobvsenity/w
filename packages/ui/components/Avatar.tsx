import React from 'react'
import { cn } from '../../lib/utils'

export interface AvatarProps {
  src?: string | null
  alt?: string
  fallback?: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  status?: 'online' | 'idle' | 'dnd' | 'offline' | 'streaming'
  className?: string
  onClick?: () => void
}

const sizeClasses = {
  xs: 'w-6 h-6 text-xs',
  sm: 'w-8 h-8 text-sm',
  md: 'w-10 h-10 text-base',
  lg: 'w-12 h-12 text-lg',
  xl: 'w-16 h-16 text-xl',
  '2xl': 'w-20 h-20 text-2xl',
}

const statusColors = {
  online: 'bg-discord-accent-green',
  idle: 'bg-discord-accent-yellow',
  dnd: 'bg-discord-accent-red',
  offline: 'bg-discord-text-muted',
  streaming: 'bg-discord-accent-purple',
}

const statusSizes = {
  xs: 'w-2 h-2',
  sm: 'w-2.5 h-2.5',
  md: 'w-3 h-3',
  lg: 'w-3.5 h-3.5',
  xl: 'w-4 h-4',
  '2xl': 'w-5 h-5',
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt,
  fallback,
  size = 'md',
  status,
  className,
  onClick,
}) => {
  const [imageError, setImageError] = React.useState(false)
  const [imageLoaded, setImageLoaded] = React.useState(false)

  const handleImageError = () => {
    setImageError(true)
  }

  const handleImageLoad = () => {
    setImageLoaded(true)
  }

  const showFallback = !src || imageError

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const getFallbackColor = (name: string) => {
    const colors = [
      'bg-discord-accent-blue',
      'bg-discord-accent-green',
      'bg-discord-accent-purple',
      'bg-discord-accent-orange',
      'bg-discord-accent-red',
      'bg-discord-accent-yellow',
    ]
    const index = name.charCodeAt(0) % colors.length
    return colors[index]
  }

  return (
    <div className="relative inline-block">
      <div
        className={cn(
          'relative inline-flex items-center justify-center rounded-full overflow-hidden bg-discord-secondary border-2 border-discord-elevated',
          sizeClasses[size],
          onClick && 'cursor-pointer hover:border-discord-accent-blue transition-colors',
          className
        )}
        onClick={onClick}
      >
        {src && !imageError && (
          <img
            src={src}
            alt={alt || 'Avatar'}
            className={cn(
              'w-full h-full object-cover transition-opacity duration-200',
              imageLoaded ? 'opacity-100' : 'opacity-0'
            )}
            onError={handleImageError}
            onLoad={handleImageLoad}
          />
        )}
        
        {showFallback && (
          <div
            className={cn(
              'w-full h-full flex items-center justify-center text-discord-text-primary font-semibold',
              getFallbackColor(fallback || 'User')
            )}
          >
            {fallback ? getInitials(fallback) : 'U'}
          </div>
        )}
      </div>

      {status && (
        <div
          className={cn(
            'absolute bottom-0 right-0 rounded-full border-2 border-discord-background-primary',
            statusColors[status],
            statusSizes[size]
          )}
        />
      )}
    </div>
  )
}

export default Avatar
