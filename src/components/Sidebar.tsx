import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Layers,
  PlusCircle,
  FileSpreadsheet,
  Database,
  Settings,
  ChevronLeft,
  ChevronRight,
  Boxes,
} from 'lucide-react';
import { clsx } from 'clsx';

interface SidebarProps {
  totalPieces?: number;
}

export function Sidebar({ totalPieces }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(() => {
    return localStorage.getItem('cl_parts_sidebar_collapsed') === 'true';
  });

  useEffect(() => {
    localStorage.setItem('cl_parts_sidebar_collapsed', String(collapsed));
  }, [collapsed]);

  const navItems = [
    {
      to: '/',
      label: 'Dashboard',
      icon: LayoutDashboard,
      end: true,
    },
    {
      to: '/pecas',
      label: 'Central de Peças',
      icon: Layers,
      badge: totalPieces !== undefined ? totalPieces : undefined,
    },
    {
      to: '/nova-peca',
      label: 'Nova Peça',
      icon: PlusCircle,
      highlight: true,
    },
    {
      to: '/exportacao',
      label: 'Exportação',
      icon: FileSpreadsheet,
    },
    {
      to: '/backup',
      label: 'Backup',
      icon: Database,
    },
    {
      to: '/configuracoes',
      label: 'Configurações',
      icon: Settings,
    },
  ];

  return (
    <aside
      className={clsx(
        'relative flex flex-col border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-all duration-300 z-30 shrink-0 select-none shadow-sm',
        collapsed ? 'w-20' : 'w-64'
      )}
    >
      {/* Top Header & Official Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-slate-100 dark:border-slate-800/80 overflow-hidden">
        <div className="relative w-11 h-11 shrink-0 rounded-xl overflow-hidden shadow-md shadow-sky-500/10 border border-slate-200 dark:border-slate-700 bg-white flex items-center justify-center p-0.5">
          <img
            src="/logo.png"
            alt="CL Parts Manager Logo"
            className="w-full h-full object-contain rounded-lg"
          />
        </div>

        {!collapsed && (
          <div className="flex flex-col min-w-0 transition-opacity duration-200">
            <span className="font-bold text-base tracking-tight text-slate-900 dark:text-white leading-none flex items-center gap-1.5">
              CL Parts
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-sky-500 animate-pulse" />
            </span>
            <span className="text-[11px] font-medium uppercase tracking-widest text-sky-600 dark:text-sky-400 mt-1">
              Parts Manager
            </span>
          </div>
        )}
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              title={collapsed ? item.label : undefined}
              className={({ isActive }) =>
                clsx(
                  'group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150',
                  isActive
                    ? item.highlight
                      ? 'bg-sky-600 text-white shadow-sm shadow-sky-500/30'
                      : 'bg-sky-50 dark:bg-sky-950/50 text-sky-700 dark:text-sky-300 border border-sky-200/80 dark:border-sky-800/60'
                    : item.highlight
                    ? 'bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400 hover:bg-sky-100 dark:hover:bg-sky-900/50'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-100',
                  collapsed && 'justify-center px-0'
                )
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    className={clsx(
                      'w-5 h-5 shrink-0 transition-transform duration-150 group-hover:scale-105',
                      isActive
                        ? item.highlight
                          ? 'text-white'
                          : 'text-sky-600 dark:text-sky-400'
                        : item.highlight
                        ? 'text-sky-600 dark:text-sky-400'
                        : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-300'
                    )}
                  />

                  {!collapsed && (
                    <span className="truncate flex-1 flex items-center justify-between">
                      <span>{item.label}</span>
                      {item.badge !== undefined && (
                        <span
                          className={clsx(
                            'text-xs font-mono px-2 py-0.5 rounded-full font-semibold',
                            isActive
                              ? 'bg-sky-200/70 text-sky-800 dark:bg-sky-900 dark:text-sky-200'
                              : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                          )}
                        >
                          {item.badge}
                        </span>
                      )}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Engineering Blueprint Badge / System status */}
      {!collapsed && (
        <div className="p-3 mx-3 mb-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200/60 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-2">
          <Boxes className="w-4 h-4 text-sky-500 shrink-0" />
          <div className="truncate">
            <div className="font-semibold text-slate-700 dark:text-slate-300">IndexedDB Local</div>
            <div>Persistência Permanente</div>
          </div>
        </div>
      )}

      {/* Collapse Toggle Button */}
      <div className="p-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-end">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center p-2 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title={collapsed ? 'Expandir menu lateral' : 'Recolher menu lateral'}
        >
          {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>
      </div>
    </aside>
  );
}
