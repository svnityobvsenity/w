import React, { useEffect, useState } from 'react'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { supabase } from '../lib/supabaseClient'
import { useAuthStore } from '../lib/auth'
import { Loading } from '@fride/ui'

interface AuthFormProps {
  onSuccess?: () => void
  className?: string
}

export function AuthForm({ onSuccess, className }: AuthFormProps) {
  const [loading, setLoading] = useState(false)
  const { setUser } = useAuthStore()

  useEffect(() => {
    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          setLoading(true)
          try {
            // Get or create user profile
            const { data: existingUser } = await supabase
              .from('users')
              .select('*')
              .eq('id', session.user.id)
              .single()

            if (existingUser) {
              setUser(existingUser)
            } else {
              // Create new user profile
              const { data: newUser, error } = await supabase
                .from('users')
                .insert({
                  id: session.user.id,
                  email: session.user.email!,
                  username: session.user.email!.split('@')[0],
                  display_name: session.user.email!.split('@')[0],
                  discriminator: Math.floor(Math.random() * 9000 + 1000).toString(),
                  role: 'user',
                  is_online: true,
                  created_at: new Date().toISOString(),
                  updated_at: new Date().toISOString()
                })
                .select()
                .single()

              if (error) {
                console.error('Error creating user profile:', error)
              } else {
                setUser(newUser)
              }
            }

            onSuccess?.()
          } catch (error) {
            console.error('Error handling auth state change:', error)
          } finally {
            setLoading(false)
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [setUser, onSuccess])

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loading size="lg" />
      </div>
    )
  }

  return (
    <div className={`max-w-md mx-auto p-6 ${className || ''}`}>
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-text-primary mb-2">
          Welcome to Fride
        </h1>
        <p className="text-text-secondary">
          Join the Discord-style community
        </p>
      </div>

      <Auth
        supabaseClient={supabase}
        appearance={{
          theme: ThemeSupa,
          variables: {
            default: {
              colors: {
                brand: '#5865F2',
                brandAccent: '#4752C4',
                brandButtonText: '#FFFFFF',
                defaultButtonBackground: '#2C2F33',
                defaultButtonBackgroundHover: '#40444B',
                defaultButtonBorder: '#40444B',
                defaultButtonText: '#FFFFFF',
                dividerBackground: '#40444B',
                inputBackground: '#2C2F33',
                inputBorder: '#40444B',
                inputBorderHover: '#5865F2',
                inputBorderFocus: '#5865F2',
                inputText: '#FFFFFF',
                inputLabelText: '#B9BBBE',
                inputPlaceholder: '#72767D',
                messageText: '#B9BBBE',
                messageTextDanger: '#ED4245',
                anchorTextColor: '#5865F2',
                anchorTextHoverColor: '#4752C4',
              },
              space: {
                inputPadding: '12px',
                buttonPadding: '12px 24px',
                borderRadius: '8px',
              },
              fontSizes: {
                baseBodySize: '14px',
                baseInputSize: '14px',
                baseLabelSize: '14px',
                baseButtonSize: '14px',
              },
            },
          },
        }}
        providers={['google', 'github']}
        redirectTo={`${typeof window !== 'undefined' ? window.location.origin : ''}/auth/callback`}
        showLinks={true}
        view="sign_in"
      />
    </div>
  )
}
