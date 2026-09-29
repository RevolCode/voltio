'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Mail, Lock, Eye, EyeOff, Loader2, LogIn, X } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { NeuButton } from '@/components/NeuButton'
import { NeuInput } from '@/components/NeuInput'
import { NeuCheckbox } from '@/components/NeuCheckbox'
import { supabase } from '@/lib/supabase'

const loginSchema = z.object({
  email: z.string().min(1, 'El correo es requerido').email('Formato de correo inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
  remember: z.boolean().optional(),
})

type LoginFormValues = z.infer<typeof loginSchema>

export default function LoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '', remember: false },
  })

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true)
    setErrorMessage(null)

    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    })

    setIsLoading(false)

    if (error) {
      setErrorMessage(error.message)
      return
    }

    router.push('/dashboard') // Redirige a tu panel principal o la ruta que prefieras
  }

  const handleSocialLogin = async (provider: 'google' | 'github') => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    if (error) setErrorMessage(error.message)
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-[#e0e5ec]">
      <div className="w-full max-w-md p-8 rounded-3xl bg-[#e0e5ec] shadow-neu-flat flex flex-col gap-6">
        
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="w-16 h-16 rounded-2xl bg-[#e0e5ec] shadow-neu-flat flex items-center justify-center text-[#6D3BFF] mb-1">
            <LogIn className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Bienvenido a Voltio</h1>
          <p className="text-sm text-gray-500">Ingresa tus credenciales para continuar</p>
        </div>

        {errorMessage && (
          <div className="p-3.5 bg-[#e0e5ec] shadow-neu-pressed border border-red-400/40 text-red-600 text-xs rounded-2xl text-center font-medium flex items-center justify-center gap-2">
            <X className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <NeuInput
            label="Correo electrónico"
            type="email"
            placeholder="ejemplo@voltio.com"
            icon={<Mail className="w-5 h-5" />}
            error={errors.email?.message}
            {...register('email')}
          />

          <NeuInput
            label="Contraseña"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            icon={<Lock className="w-5 h-5" />}
            rightIcon={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-400 hover:text-gray-600 focus:outline-none cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            }
            error={errors.password?.message}
            {...register('password')}
          />

          <div className="flex items-center justify-between text-xs mt-1">
            <NeuCheckbox label="Recordarme" {...register('remember')} />
            <Link href="/forgot-password" className="text-[#6D3BFF] font-medium hover:underline">
              ¿Olvidaste tu contraseña?
            </Link>
          </div>

          <NeuButton type="submit" variant="primary" size="lg" disabled={isLoading} className="w-full mt-2">
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Iniciando sesión...</span>
              </>
            ) : (
              <span>Iniciar Sesión</span>
            )}
          </NeuButton>
        </form>

        <div className="relative flex py-1 items-center">
          <div className="flex-grow border-t border-gray-300/60"></div>
          <span className="flex-shrink mx-4 text-xs text-gray-400 font-medium">O continuar con</span>
          <div className="flex-grow border-t border-gray-300/60"></div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <NeuButton type="button" variant="default" onClick={() => handleSocialLogin('google')} className="flex items-center justify-center gap-2 py-3">
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
              <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.13 0-5.78-2.11-6.73-4.96H1.18v3.15C3.15 21.32 7.18 24 12 24z"/>
              <path fill="#FBBC05" d="M5.27 14.24c-.25-.72-.38-1.49-.38-2.24s.13-1.52.38-2.24V6.61H1.18C.43 8.13 0 9.87 0 12s.43 3.87 1.18 5.39l4.09-3.15z"/>
              <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.18 0 3.15 2.68 1.18 6.61l4.09 3.15c.95-2.85 3.6-4.96 6.73-4.96z"/>
            </svg>
            <span className="text-xs font-semibold text-gray-700">Google</span>
          </NeuButton>

          <NeuButton type="button" variant="default" onClick={() => handleSocialLogin('github')} className="flex items-center justify-center gap-2 py-3">
            <svg className="w-4 h-4 fill-current text-gray-800" viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
            </svg>
            <span className="text-xs font-semibold text-gray-700">GitHub</span>
          </NeuButton>
        </div>

        <div className="text-center text-xs text-gray-500 pt-2 border-t border-gray-300/40">
          ¿No tienes una cuenta?{' '}
          <Link href="/register" className="text-[#FF3D9A] font-bold hover:underline">
            Regístrate aquí
          </Link>
        </div>
      </div>
    </main>
  )
}