import React from 'react'

interface NeuButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  variant?: 'primary' | 'accent' | 'default' | 'danger'
  size?: 'sm' | 'md' | 'lg'
}

export const NeuButton: React.FC<NeuButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}) => {
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm rounded-xl',
    md: 'px-5 py-2.5 text-base rounded-2xl',
    lg: 'px-7 py-3.5 text-lg rounded-2xl',
  }

  const variantClasses = {
    primary: 'bg-[#6D3BFF] text-white font-semibold hover:bg-[#5b2ee6] shadow-neu-flat active:shadow-neu-pressed',
    accent: 'bg-[#FF3D9A] text-white font-semibold hover:bg-[#e03285] shadow-neu-flat active:shadow-neu-pressed',
    default: 'bg-[#e0e5ec] text-gray-700 hover:text-gray-900 shadow-neu-flat active:shadow-neu-pressed',
    danger: 'bg-[#FF4D6D] text-white font-semibold hover:bg-[#e63956] shadow-neu-flat active:shadow-neu-pressed',
  }

  return (
    <button
      className={`
        transition-all duration-200 ease-in-out
        focus:outline-none flex items-center justify-center gap-2 cursor-pointer
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  )
}