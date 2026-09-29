'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Mail, Lock, Eye, EyeOff, LogIn, Loader2 } from 'lucide-react'
import { NeuButton } from '@/components/NeuButton'
import { NeuInput } from '@/components/NeuInput'
import { NeuCheckbox } from '@/components/NeuCheckbox'

// Esquema de validación con Zod
const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'El correo electrónico es requerido')
    .email('Formato de correo inválido'),
  password: z
    .string()
    .min(6, 'La contraseña debe tener al menos 6 caracteres'),
  rememberMe: z.boolean().optional(),
})

type LoginFormValues = z.infer<typeof loginSchema>

export default function Home() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  })

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true)
    console.log('Datos de Login:', data)
    await new Promise((resolve) => setTimeout(resolve, 1800))
    setIsLoading(false)
    alert('¡Inicio de sesión exitoso!')
  }

  const handleSocialLogin = (provider: string) => {
    alert(`Iniciando sesión con ${provider}...`)
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-[#e0e5ec]">
      <div className="w-full max-w-md p-8 rounded-3xl bg-[#e0e5ec] shadow-neu-flat flex flex-col gap-6">
        
        {/* Cabecera del Formulario */}
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="w-16 h-16 rounded-2xl bg-[#e0e5ec] shadow-neu-flat flex items-center justify-center text-[#6D3BFF] mb-1">
            <LogIn className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Bienvenido a Voltio</h1>
          <p className="text-sm text-gray-500">Ingresa tus credenciales para continuar</p>
        </div>

        {/* Formulario de Login */}
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
                className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer focus:outline-none"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            }
            error={errors.password?.message}
            {...register('password')}
          />

          {/* Recordarme & Olvidé mi contraseña */}
          <div className="flex items-center justify-between text-xs mt-1">
            <NeuCheckbox label="Recordarme" {...register('rememberMe')} />
            <a
              href="#"
              className="text-[#6D3BFF] hover:underline font-semibold transition-all"
            >
              ¿Olvidaste tu contraseña?
            </a>
          </div>

          {/* Botón de Inicio de Sesión Principal (#6D3BFF) */}
          <NeuButton
            type="submit"
            variant="primary"
            size="lg"
            disabled={isLoading}
            className="w-full mt-2"
          >
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

        {/* Divisor "O continuar con" */}
        <div className="relative flex items-center justify-center my-1">
          <div className="border-t border-gray-300 w-full"></div>
          <span className="bg-[#e0e5ec] px-3 text-xs text-gray-500 font-medium absolute">
            O continuar con
          </span>
        </div>

        {/* Botones Sociales (Google & GitHub) */}
        <div className="grid grid-cols-2 gap-4">
          <NeuButton
            type="button"
            variant="default"
            size="md"
            onClick={() => handleSocialLogin('Google')}
            className="w-full text-xs font-semibold"
          >
            <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24">
              <path
                fill="#EA4335"
                d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.3 9 5 12 5z"
              />
              <path
                fill="#4285F4"
                d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
              />
              <path
                fill="#FBBC05"
                d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 10.8 0 12s.7 2.3 1.9 4.7l3.7-2.9z"
              />
              <path
                fill="#34A853"
                d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.3-6.4-5.2L1.9 16C3.7 19.7 7.5 23 12 23z"
              />
            </svg>
            Google
          </NeuButton>

          <NeuButton
            type="button"
            variant="default"
            size="md"
            onClick={() => handleSocialLogin('GitHub')}
            className="w-full text-xs font-semibold"
          >
            <svg className="w-4 h-4 mr-1 fill-gray-800" viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
            GitHub
          </NeuButton>
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-gray-500 pt-2 border-t border-gray-300/40">
          ¿No tienes una cuenta?{' '}
          <a href="#" className="text-[#FF3D9A] font-bold hover:underline">
            Regístrate aquí
          </a>
        </div>
      </div>
    </main>
  )
}