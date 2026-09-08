import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  header?: React.ReactNode;
  footer?: React.ReactNode;
  badge?: React.ReactNode;
}

export function Card({ className, header, footer, badge, children, ...props }: CardProps) {
  return (
    <div
      className={twMerge(
        clsx(
          'bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl shadow-sm transition-all overflow-hidden',
          className
        )
      )}
      {...props}
    >
      {header && (
        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
          <div className="font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            {header}
          </div>
          {badge && <div>{badge}</div>}
        </div>
      )}
      <div className="p-5">{children}</div>
      {footer && (
        <div className="px-5 py-3.5 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-between">
          {footer}
        </div>
      )}
    </div>
  );
}
