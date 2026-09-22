import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({ label, error, icon, className = '', ...rest }) => (
  <div className="flex flex-col gap-1.5">
    {label && (
      <label className="text-sm font-medium text-ink-700 font-body">{label}</label>
    )}
    <div className="relative">
      {icon && (
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-300">{icon}</span>
      )}
      <input
        className={[
          'w-full bg-white border border-ink-200 rounded-xl px-4 py-2.5 text-ink-900 font-body text-sm placeholder:text-ink-300',
          'focus:outline-none focus:border-ink-900 focus:ring-2 focus:ring-ink-900/10 transition-all duration-150',
          error ? 'border-coral' : '',
          icon ? 'pl-10' : '',
          className,
        ].join(' ')}
        {...rest}
      />
    </div>
    {error && <p className="text-xs text-coral font-body">{error}</p>}
  </div>
);

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
}

export const Select: React.FC<SelectProps> = ({ label, error, className = '', children, ...rest }) => (
  <div className="flex flex-col gap-1.5">
    {label && (
      <label className="text-sm font-medium text-ink-700 font-body">{label}</label>
    )}
    <select
      className={[
        'w-full bg-white border border-ink-200 rounded-xl px-4 py-2.5 text-ink-900 font-body text-sm',
        'focus:outline-none focus:border-ink-900 focus:ring-2 focus:ring-ink-900/10 transition-all duration-150 cursor-pointer',
        error ? 'border-coral' : '',
        className,
      ].join(' ')}
      {...rest}
    >
      {children}
    </select>
    {error && <p className="text-xs text-coral font-body">{error}</p>}
  </div>
);

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea: React.FC<TextareaProps> = ({ label, error, className = '', ...rest }) => (
  <div className="flex flex-col gap-1.5">
    {label && (
      <label className="text-sm font-medium text-ink-700 font-body">{label}</label>
    )}
    <textarea
      rows={4}
      className={[
        'w-full bg-white border border-ink-200 rounded-xl px-4 py-2.5 text-ink-900 font-body text-sm placeholder:text-ink-300 resize-none',
        'focus:outline-none focus:border-ink-900 focus:ring-2 focus:ring-ink-900/10 transition-all duration-150',
        error ? 'border-coral' : '',
        className,
      ].join(' ')}
      {...rest}
    />
    {error && <p className="text-xs text-coral font-body">{error}</p>}
  </div>
);
