import React from 'react'
import { Loading } from './ui/Loading'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  text?: string
  fullScreen?: boolean
}

export default function LoadingSpinner({ 
  size = 'lg', 
  text = 'Loading...', 
  fullScreen = false 
}: LoadingSpinnerProps) {
  return (
    <Loading 
      size={size} 
      text={text} 
      fullScreen={fullScreen}
      variant="accent"
    />
  )
}
