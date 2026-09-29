import React from 'react'
import { Check } from 'lucide-react'

interface NeuCheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
}

export const NeuCheckbox = React.forwardRef<HTMLInputElement, NeuCheckboxProps>(
  ({ label, className = '', ...props }, ref) => {
    return (
      <label className="flex items-center gap-3 cursor-pointer select-none text-sm text-gray-600 font-medium">
        <div className="relative flex items-center justify-center">
          <input
            type="checkbox"
            ref={ref}
            className="peer sr-only"
            {...props}
          />
          <div className="w-5 h-5 bg-neu-bg rounded-md shadow-neu-sm-pressed peer-checked:shadow-neu-sm peer-checked:bg-blue-600 transition-all flex items-center justify-center">
            <Check className="w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity" />
          </div>
        </div>
        <span>{label}</span>
      </label>
    )
  }
)

NeuCheckbox.displayName = 'NeuCheckbox'