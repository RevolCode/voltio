'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Mail, Lock, User, Eye, EyeOff, Loader2, UserPlus, Check, X, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { NeuButton } from '@/components/NeuButton'
import { NeuInput } from '@/components/NeuInput'
import { NeuCheckbox } from '@/components/NeuCheckbox'
import { supabase } from '@/lib/supabase'

const registerSchema = z.object({
  name: z.string().min(2, 'El nombre completo es requerido'),
  email: z.string().min(1, 'El correo es requerido').email('Formato de correo inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
  confirmPassword: z.string().min(1, 'Confirma tu contraseña'),
  terms: z.boolean().refine((val) => val === true, 'Debes aceptar los términos y condiciones'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'],
})

type RegisterFormValues = z.infer<typeof registerSchema>

export default function RegisterPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [passwordValue, setPasswordValue] = useState('')

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: '', email: '', password: '', confirmPassword: '', terms: false },
  })

  const checks = {
    length: passwordValue.length >= 8,
    capital: /[A-Z]/.test(passwordValue),
    number: /[0-9]/.test(passwordValue),
    special: /[^A-Za-z0-9]/.test(passwordValue),
  }

  const activeScore = Object.values(checks).filter(Boolean).length

  const getBorderGlowStyle = (score: number, hasValue: boolean) => {
    if (!hasValue) return 'shadow-neu-pressed border-transparent'
    if (score <= 1) return 'shadow-[inset_2px_2px_5px_#b8becc,inset_-2px_-2px_5px_#ffffff,0_0_8px_rgba(239,68,68,0.5)] border border-red-500/60'
    if (score <= 3) return 'shadow-[inset_2px_2px_5px_#b8becc,inset_-2px_-2px_5px_#ffffff,0_0_8px_rgba(245,158,11,0.5)] border border-amber-500/60'
    return 'shadow-[inset_2px_2px_5px_#b8becc,inset_-2px_-2px_5px_#ffffff,0_0_10px_rgba(16,185,129,0.7)] border border-emerald-500/80'
  }

  const passwordRegisterProps = register('password')

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true)
    setErrorMessage(null)
    setSuccessMessage(null)

    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          full_name: data.name,
        },
      },
    })

    setIsLoading(false)

    if (error) {
      setErrorMessage(error.message)
      return
    }

    setSuccessMessage('¡Cuenta creada con éxito! Redirigiendo al inicio de sesión...')
    
    setTimeout(() => {
      router.push('/')
    }, 2500)
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
          <div className="w-16 h-16 rounded-2xl bg-[#e0e5ec] shadow-neu-flat flex items-center justify-center text-[#FF3D9A] mb-1">
            <UserPlus className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Crea tu cuenta</h1>
          <p className="text-sm text-gray-500">Regístrate para comenzar a usar Voltio</p>
        </div>

        {errorMessage && (
          <div className="p-3.5 bg-[#e0e5ec] shadow-neu-pressed border border-red-400/40 text-red-600 text-xs rounded-2xl text-center font-medium flex items-center justify-center gap-2">
            <X className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="p-4 bg-[#e0e5ec] shadow-neu-pressed border border-emerald-500/40 text-emerald-600 text-xs rounded-2xl text-center font-semibold flex items-center justify-center gap-2 animate-pulse">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <NeuInput
            label="Nombre completo"
            type="text"
            placeholder="Juan Pérez"
            icon={<User className="w-5 h-5" />}
            error={errors.name?.message}
            {...register('name')}
          />

          <NeuInput
            label="Correo electrónico"
            type="email"
            placeholder="ejemplo@voltio.com"
            icon={<Mail className="w-5 h-5" />}
            error={errors.email?.message}
            {...register('email')}
          />

          <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-gray-600 ml-1">Contraseña</label>
              
              <div className={`relative flex items-center rounded-2xl transition-all duration-300 bg-[#e0e5ec] ${getBorderGlowStyle(activeScore, !!passwordValue)}`}>
                <span className="absolute left-3.5 text-gray-400 flex items-center pointer-events-none">
                  <Lock className="w-5 h-5" />
                </span>
                
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="w-full bg-transparent py-3.5 pl-12 pr-12 text-sm text-gray-700 placeholder-gray-400 focus:outline-none"
                  {...passwordRegisterProps}
                  onChange={(e) => {
                    passwordRegisterProps.onChange(e)
                    setPasswordValue(e.target.value)
                  }}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 text-gray-400 hover:text-gray-600 focus:outline-none cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              {errors.password && (
                <span className="text-xs text-red-500 font-medium ml-1">
                  {errors.password.message}
                </span>
              )}
            </div>

            {passwordValue && (
              <div className="grid grid-cols-2 gap-2 px-1 pt-1 text-[11px] font-medium text-gray-500">
                <span className={`flex items-center gap-1 transition-colors ${checks.length ? 'text-emerald-600 font-semibold' : ''}`}>
                  {checks.length ? <Check className="w-3 h-3 text-emerald-600" /> : <X className="w-3 h-3 text-gray-400" />} 8+ caracteres
                </span>
                <span className={`flex items-center gap-1 transition-colors ${checks.capital ? 'text-emerald-600 font-semibold' : ''}`}>
                  {checks.capital ? <Check className="w-3 h-3 text-emerald-600" /> : <X className="w-3 h-3 text-gray-400" />} Mayúscula
                </span>
                <span className={`flex items-center gap-1 transition-colors ${checks.number ? 'text-emerald-600 font-semibold' : ''}`}>
                  {checks.number ? <Check className="w-3 h-3 text-emerald-600" /> : <X className="w-3 h-3 text-gray-400" />} Número
                </span>
                <span className={`flex items-center gap-1 transition-colors ${checks.special ? 'text-emerald-600 font-semibold' : ''}`}>
                  {checks.special ? <Check className="w-3 h-3 text-emerald-600" /> : <X className="w-3 h-3 text-gray-400" />} Símbolo (!@#)
                </span>
              </div>
            )}
          </div>

          <NeuInput
            label="Confirmar contraseña"
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="••••••••"
            icon={<Lock className="w-5 h-5" />}
            rightIcon={
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="text-gray-400 hover:text-gray-600 focus:outline-none cursor-pointer"
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            }
            error={errors.confirmPassword?.message}
            {...register('confirmPassword')}
          />

          <div className="flex flex-col gap-1 mt-1">
            <NeuCheckbox label="Acepto los términos y condiciones de uso" {...register('terms')} />
            {errors.terms && <span className="text-xs text-red-500 font-medium ml-1">{errors.terms.message}</span>}
          </div>

          <NeuButton type="submit" variant="accent" size="lg" disabled={isLoading || !!successMessage} className="w-full mt-2">
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Registrando...</span>
              </>
            ) : (
              <span>Registrarse</span>
            )}
          </NeuButton>
        </form>

        {/* Separador O continuar con */}
        <div className="relative flex py-1 items-center">
          <div className="flex-grow border-t border-gray-300/60"></div>
          <span className="flex-shrink mx-4 text-xs text-gray-400 font-medium">O continuar con</span>
          <div className="flex-grow border-t border-gray-300/60"></div>
        </div>

        {/* Botones Sociales */}
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
          ¿Ya tienes una cuenta?{' '}
          <Link href="/" className="text-[#6D3BFF] font-bold hover:underline">
            Inicia sesión aquí
          </Link>
        </div>
      </div>
    </main>
  )
}