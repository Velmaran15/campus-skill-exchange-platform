import React from 'react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  fullWidth?: boolean;
}

const variantClasses: Record<Variant, string> = {
  primary:
    'bg-ink-900 text-white hover:bg-ink-700 active:scale-[0.98] shadow-sm',
  secondary:
    'bg-amber text-ink-900 hover:bg-amber-dark hover:text-white active:scale-[0.98] shadow-sm',
  ghost:
    'bg-transparent text-ink-600 hover:bg-ink-100 border border-ink-200 active:scale-[0.98]',
  danger:
    'bg-coral text-white hover:bg-coral-dark active:scale-[0.98] shadow-sm',
};

const sizeClasses: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-7 py-3.5 text-base',
};

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  className = '',
  disabled,
  children,
  ...rest
}) => (
  <button
    className={[
      'inline-flex items-center justify-center gap-2 font-body font-medium rounded-xl transition-all duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed',
      variantClasses[variant],
      sizeClasses[size],
      fullWidth ? 'w-full' : '',
      className,
    ].join(' ')}
    disabled={disabled || loading}
    {...rest}
  >
    {loading && (
      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
      </svg>
    )}
    {children}
  </button>
);
