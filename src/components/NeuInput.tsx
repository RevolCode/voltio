import React from 'react'

interface NeuInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  icon?: React.ReactNode
  rightIcon?: React.ReactNode
}

export const NeuInput = React.forwardRef<HTMLInputElement, NeuInputProps>(
  ({ label, error, icon, rightIcon, className = '', ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label className="text-sm font-semibold text-gray-700 ml-1">
            {label}
          </label>
        )}
        <div className="relative flex items-center w-full">
          {icon && (
            <div className="absolute left-4 text-gray-400 pointer-events-none">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={`
              w-full bg-neu-bg text-gray-800 placeholder-gray-400
              shadow-neu-pressed rounded-2xl py-3 text-sm transition-all outline-none
              ${icon ? 'pl-11' : 'px-4'}
              ${rightIcon ? 'pr-11' : 'pr-4'}
              focus:ring-2 focus:ring-blue-500/30
              ${error ? 'border border-red-400' : ''}
              ${className}
            `}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-4 flex items-center justify-center">
              {rightIcon}
            </div>
          )}
        </div>
        {error && <span className="text-xs text-red-500 ml-1 font-medium">{error}</span>}
      </div>
    )
  }
)

NeuInput.displayName = 'NeuInput'