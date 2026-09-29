'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Mail, Lock, User, Eye, EyeOff, Loader2, UserPlus } from 'lucide-react'
import Link from 'next/link'
import { NeuButton } from '@/components/NeuButton'
import { NeuInput } from '@/components/NeuInput'
import { NeuCheckbox } from '@/components/NeuCheckbox'

const registerSchema = z.object({
  name: z.string().min(2, 'El nombre completo es requerido'),
  email: z
    .string()
    .min(1, 'El correo electrónico es requerido')
    .email('Formato de correo inválido'),
  password: z
    .string()
    .min(6, 'La contraseña debe tener al menos 6 caracteres'),
  confirmPassword: z.string().min(1, 'Confirma tu contraseña'),
  terms: z.boolean().refine((val) => val === true, 'Debes aceptar los términos y condiciones'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'],
})

type RegisterFormValues = z.infer<typeof registerSchema>

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [passwordValue, setPasswordValue] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      terms: false,
    },
  })

  // Evaluación de fortaleza simplificada
  const getPasswordStrength = (pass: string) => {
    if (!pass) return { score: 0, label: '', color: '', bgBar: '' }
    
    let score = 0
    if (pass.length >= 6) score += 1
    if (pass.length >= 8) score += 1
    if (/[A-Z]/.test(pass)) score += 1
    if (/[0-9]/.test(pass)) score += 1
    if (/[^A-Za-z0-9]/.test(pass)) score += 1

    if (score <= 2) {
      return { score: 33, label: 'Baja', color: 'text-red-500', bgBar: 'bg-red-500' }
    } else if (score <= 4) {
      return { score: 66, label: 'Media', color: 'text-amber-500', bgBar: 'bg-amber-500' }
    } else {
      return { score: 100, label: 'Alta', color: 'text-emerald-500', bgBar: 'bg-emerald-500' }
    }
  }

  const strength = getPasswordStrength(passwordValue)

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true)
    console.log('Datos de Registro:', data)
    await new Promise((resolve) => setTimeout(resolve, 1800))
    setIsLoading(false)
    alert('¡Cuenta creada con éxito!')
  }

  const handleSocialRegister = (provider: string) => {
    alert(`Registrándose con ${provider}...`)
  }

  const passwordRegisterProps = register('password')

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-[#e0e5ec]">
      <div className="w-full max-w-md p-8 rounded-3xl bg-[#e0e5ec] shadow-neu-flat flex flex-col gap-6">
        
        {/* Cabecera del Formulario */}
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="w-16 h-16 rounded-2xl bg-[#e0e5ec] shadow-neu-flat flex items-center justify-center text-[#FF3D9A] mb-1">
            <UserPlus className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Crea tu cuenta</h1>
          <p className="text-sm text-gray-500">Regístrate para comenzar a usar Voltio</p>
        </div>

        {/* Formulario de Registro */}
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

          {/* Campo de Contraseña con Indicador Neumórfico Directo */}
          <div className="flex flex-col gap-1.5">
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
              {...passwordRegisterProps}
              onChange={(e) => {
                passwordRegisterProps.onChange(e)
                setPasswordValue(e.target.value)
              }}
            />

            {/* Medidor Directo sin Títulos Extras */}
            {passwordValue && (
              <div className="flex items-center gap-2 px-1 mt-1">
                <div className="flex-1 h-2 bg-[#e0e5ec] shadow-neu-pressed rounded-full overflow-hidden p-0.5">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${strength.bgBar}`}
                    style={{ width: `${strength.score}%` }}
                  />
                </div>
                <span className={`text-xs font-bold ${strength.color}`}>
                  {strength.label}
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
                className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer focus:outline-none"
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            }
            error={errors.confirmPassword?.message}
            {...register('confirmPassword')}
          />

          {/* Aceptación de Términos */}
          <div className="flex flex-col gap-1 mt-1">
            <NeuCheckbox
              label="Acepto los términos y condiciones de uso"
              {...register('terms')}
            />
            {errors.terms && (
              <span className="text-xs text-red-500 font-medium ml-1">
                {errors.terms.message}
              </span>
            )}
          </div>

          {/* Botón de Registro (#FF3D9A) */}
          <NeuButton
            type="submit"
            variant="accent"
            size="lg"
            disabled={isLoading}
            className="w-full mt-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Creando cuenta...</span>
              </>
            ) : (
              <span>Registrarse</span>
            )}
          </NeuButton>
        </form>

        {/* Divisor */}
        <div className="relative flex items-center justify-center my-1">
          <div className="border-t border-gray-300 w-full"></div>
          <span className="bg-[#e0e5ec] px-3 text-xs text-gray-500 font-medium absolute">
            O registrarte con
          </span>
        </div>

        {/* Botones Sociales (Google & GitHub) */}
        <div className="grid grid-cols-2 gap-4">
          <NeuButton
            type="button"
            variant="default"
            size="md"
            onClick={() => handleSocialRegister('Google')}
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
            onClick={() => handleSocialRegister('GitHub')}
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
          ¿Ya tienes una cuenta?{' '}
          <Link href="/" className="text-[#6D3BFF] font-bold hover:underline">
            Inicia sesión aquí
          </Link>
        </div>
      </div>
    </main>
  )
}