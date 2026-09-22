import React from 'react';
import { Star } from 'lucide-react';
import { getInitials } from '../../utils/helpers';

// ─── Badge ────────────────────────────────────────────────────────────────────
interface BadgeProps {
  children: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ children, className = '' }) => (
  <span
    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium font-body ${className}`}
  >
    {children}
  </span>
);

// ─── Avatar ───────────────────────────────────────────────────────────────────
interface AvatarProps {
  name: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizeMap = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-14 h-14 text-base',
  xl: 'w-20 h-20 text-xl',
};

export const Avatar: React.FC<AvatarProps> = ({ name, size = 'md', className = '' }) => (
  <div
    className={`${sizeMap[size]} rounded-2xl bg-ink-900 text-white font-display font-bold flex items-center justify-center flex-shrink-0 ${className}`}
  >
    {getInitials(name)}
  </div>
);

// ─── StarRating ───────────────────────────────────────────────────────────────
interface StarRatingProps {
  value: number;
  max?: number;
  size?: number;
  interactive?: boolean;
  onChange?: (val: number) => void;
}

export const StarRating: React.FC<StarRatingProps> = ({
  value,
  max = 5,
  size = 16,
  interactive = false,
  onChange,
}) => (
  <div className="flex items-center gap-0.5">
    {Array.from({ length: max }).map((_, i) => (
      <Star
        key={i}
        size={size}
        className={[
          'transition-colors',
          i < Math.round(value) ? 'text-amber fill-amber' : 'text-ink-200 fill-ink-200',
          interactive ? 'cursor-pointer hover:text-amber hover:fill-amber' : '',
        ].join(' ')}
        onClick={() => interactive && onChange && onChange(i + 1)}
      />
    ))}
  </div>
);

// ─── Spinner ──────────────────────────────────────────────────────────────────
export const Spinner: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`flex justify-center items-center py-16 ${className}`}>
    <div className="w-8 h-8 border-2 border-ink-200 border-t-ink-900 rounded-full animate-spin" />
  </div>
);

// ─── Empty State ──────────────────────────────────────────────────────────────
interface EmptyProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export const Empty: React.FC<EmptyProps> = ({ icon, title, description, action }) => (
  <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
    {icon && <div className="text-ink-200">{icon}</div>}
    <div>
      <p className="font-display font-semibold text-ink-700 text-lg">{title}</p>
      {description && <p className="text-ink-400 text-sm font-body mt-1">{description}</p>}
    </div>
    {action}
  </div>
);

// ─── Card ─────────────────────────────────────────────────────────────────────
interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className = '', hover = false }) => (
  <div
    className={[
      'bg-white rounded-2xl border border-ink-100 p-6',
      hover ? 'hover:border-ink-300 hover:shadow-lg transition-all duration-200 cursor-pointer' : '',
      className,
    ].join(' ')}
  >
    {children}
  </div>
);

// ─── Toast ────────────────────────────────────────────────────────────────────
interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
}

export const Toast: React.FC<ToastProps> = ({ message, type = 'info' }) => {
  const colors = {
    success: 'bg-jade text-white',
    error: 'bg-coral text-white',
    info: 'bg-ink-900 text-white',
  };
  return (
    <div
      className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-2xl shadow-xl font-body text-sm animate-fade-up ${colors[type]}`}
    >
      {message}
    </div>
  );
};
