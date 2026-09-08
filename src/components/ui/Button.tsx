import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost' | 'success';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', icon, children, disabled, ...props }, ref) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium transition-all duration-150 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98] gap-2';

    const variants = {
      primary:
        'bg-sky-600 hover:bg-sky-500 text-white shadow-sm hover:shadow-md focus:ring-sky-500 dark:bg-sky-600 dark:hover:bg-sky-500 border border-sky-500/20',
      secondary:
        'bg-slate-200 hover:bg-slate-300 text-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-100 focus:ring-slate-400 border border-slate-300 dark:border-slate-700',
      outline:
        'bg-transparent hover:bg-slate-100 text-slate-700 dark:text-slate-200 dark:hover:bg-slate-800/80 border border-slate-300 dark:border-slate-700 focus:ring-slate-400',
      danger:
        'bg-rose-600 hover:bg-rose-500 text-white shadow-sm focus:ring-rose-500 border border-rose-500/20',
      ghost:
        'bg-transparent hover:bg-slate-100 text-slate-600 dark:text-slate-400 dark:hover:bg-slate-800/60 dark:hover:text-slate-200 focus:ring-slate-400',
      success:
        'bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm focus:ring-emerald-500 border border-emerald-500/20',
    };

    const sizes = {
      sm: 'text-xs px-2.5 py-1.5 rounded-md',
      md: 'text-sm px-4 py-2',
      lg: 'text-base px-5 py-2.5 rounded-xl font-semibold',
    };

    return (
      <button
        ref={ref}
        disabled={disabled}
        className={twMerge(clsx(baseStyles, variants[variant], sizes[size], className))}
        {...props}
      >
        {icon && <span className="shrink-0">{icon}</span>}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
