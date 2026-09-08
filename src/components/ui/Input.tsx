import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  prefixText?: string;
  suffixText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      prefixText,
      suffixText,
      id,
      disabled,
      ...props
    },
    ref
  ) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-xs font-semibold text-slate-700 dark:text-slate-300 tracking-wide uppercase flex items-center justify-between"
          >
            <span>{label}</span>
            {props.required && <span className="text-rose-500 font-normal">*</span>}
          </label>
        )}

        <div className="relative flex items-center rounded-lg shadow-sm">
          {prefixText && (
            <span className="inline-flex items-center px-3 text-sm font-mono font-medium rounded-l-lg border border-r-0 border-slate-300 bg-slate-100 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 select-none py-2">
              {prefixText}
            </span>
          )}

          {leftIcon && !prefixText && (
            <div className="absolute left-3 flex items-center pointer-events-none text-slate-400">
              {leftIcon}
            </div>
          )}

          <input
            id={inputId}
            ref={ref}
            disabled={disabled}
            className={twMerge(
              clsx(
                'w-full bg-white dark:bg-slate-900 border text-slate-900 dark:text-slate-100 text-sm rounded-lg focus:outline-none focus:ring-2 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500 disabled:opacity-50 disabled:bg-slate-100 dark:disabled:bg-slate-800 py-2',
                prefixText ? 'rounded-l-none' : leftIcon ? 'pl-9' : 'pl-3',
                suffixText ? 'rounded-r-none' : rightIcon ? 'pr-9' : 'pr-3',
                error
                  ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/20'
                  : 'border-slate-300 dark:border-slate-700 focus:border-sky-500 focus:ring-sky-500/20 dark:focus:border-sky-500',
                className
              )
            )}
            {...props}
          />

          {suffixText && (
            <span className="inline-flex items-center px-3 text-sm font-mono text-slate-500 dark:text-slate-400 rounded-r-lg border border-l-0 border-slate-300 bg-slate-100 dark:border-slate-700 dark:bg-slate-800 py-2 select-none">
              {suffixText}
            </span>
          )}

          {rightIcon && !suffixText && (
            <div className="absolute right-3 flex items-center text-slate-400">{rightIcon}</div>
          )}
        </div>

        {error ? (
          <span className="text-xs text-rose-600 dark:text-rose-400 font-medium">{error}</span>
        ) : helperText ? (
          <span className="text-xs text-slate-500 dark:text-slate-400">{helperText}</span>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';
