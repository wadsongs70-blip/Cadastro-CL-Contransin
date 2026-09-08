import React from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Plus, Search, Sun, Moon, Monitor, ChevronRight } from 'lucide-react';
import { Button } from './ui/Button';
import { Theme, useTheme } from '../hooks/useTheme';

interface HeaderProps {
  onSearchFocus?: () => void;
  globalSearchValue?: string;
  onGlobalSearchChange?: (val: string) => void;
}

export function Header({
  globalSearchValue = '',
  onGlobalSearchChange,
}: HeaderProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, setTheme } = useTheme();

  // Generate page title and breadcrumbs based on route
  const getRouteInfo = () => {
    const path = location.pathname;
    if (path === '/') return { title: 'Dashboard', breadcrumb: ['Visão Geral'] };
    if (path === '/pecas') return { title: 'Central de Peças', breadcrumb: ['Catálogo', 'Peças'] };
    if (path === '/nova-peca') return { title: 'Nova Peça', breadcrumb: ['Catálogo', 'Novo Cadastro'] };
    if (path.startsWith('/editar/')) return { title: 'Editar Peça', breadcrumb: ['Catálogo', 'Edição'] };
    if (path.startsWith('/peca/')) return { title: 'Detalhes da Peça', breadcrumb: ['Catálogo', 'Visualização'] };
    if (path === '/exportacao') return { title: 'Exportação Excel', breadcrumb: ['Relatórios', 'Excel'] };
    if (path === '/backup') return { title: 'Backup & Restauração', breadcrumb: ['Sistema', 'Backup'] };
    if (path === '/configuracoes') return { title: 'Configurações', breadcrumb: ['Sistema', 'Preferências'] };
    return { title: 'CL Parts Manager', breadcrumb: ['Início'] };
  };

  const { title, breadcrumb } = getRouteInfo();

  const handleGlobalSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (location.pathname !== '/pecas') {
      navigate('/pecas');
    }
  };

  return (
    <header className="sticky top-0 z-20 w-full h-16 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-6 flex items-center justify-between gap-4">
      {/* Page Title & Breadcrumb */}
      <div className="flex flex-col min-w-0">
        <div className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500 font-medium">
          <Link to="/" className="hover:text-slate-700 dark:hover:text-slate-300 transition-colors">
            Início
          </Link>
          {breadcrumb.map((crumb, idx) => (
            <React.Fragment key={idx}>
              <ChevronRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600 shrink-0" />
              <span className="text-slate-600 dark:text-slate-400 font-semibold">{crumb}</span>
            </React.Fragment>
          ))}
        </div>
        <h1 className="text-lg font-bold text-slate-900 dark:text-white truncate tracking-tight">
          {title}
        </h1>
      </div>

      {/* Center Search Input */}
      <div className="flex-1 max-w-md hidden md:block">
        <form onSubmit={handleGlobalSearchSubmit} className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Pesquisar por ID, descrição, PA, código..."
            value={globalSearchValue}
            onChange={(e) => {
              if (onGlobalSearchChange) {
                onGlobalSearchChange(e.target.value);
              }
              if (location.pathname !== '/pecas' && e.target.value.trim() !== '') {
                navigate('/pecas');
              }
            }}
            onFocus={() => {
              if (location.pathname !== '/pecas') {
                navigate('/pecas');
              }
            }}
            className="w-full bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 rounded-xl pl-9 pr-4 py-1.5 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all"
          />
        </form>
      </div>

      {/* Right Controls: Theme selector & + Nova Peça button */}
      <div className="flex items-center gap-2.5 shrink-0">
        {/* Theme mode switcher */}
        <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg p-1 border border-slate-200 dark:border-slate-700">
          <button
            onClick={() => setTheme('light')}
            className={`p-1.5 rounded-md transition-colors ${
              theme === 'light'
                ? 'bg-white dark:bg-slate-700 text-sky-600 dark:text-sky-400 shadow-xs'
                : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
            }`}
            title="Modo Claro"
          >
            <Sun className="w-4 h-4" />
          </button>
          <button
            onClick={() => setTheme('dark')}
            className={`p-1.5 rounded-md transition-colors ${
              theme === 'dark'
                ? 'bg-white dark:bg-slate-700 text-sky-600 dark:text-sky-400 shadow-xs'
                : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
            }`}
            title="Modo Escuro"
          >
            <Moon className="w-4 h-4" />
          </button>
          <button
            onClick={() => setTheme('system')}
            className={`p-1.5 rounded-md transition-colors ${
              theme === 'system'
                ? 'bg-white dark:bg-slate-700 text-sky-600 dark:text-sky-400 shadow-xs'
                : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
            }`}
            title="Modo Sistema"
          >
            <Monitor className="w-4 h-4" />
          </button>
        </div>

        {/* + Nova Peça Primary Button */}
        <Button
          variant="primary"
          size="md"
          icon={<Plus className="w-4 h-4" />}
          onClick={() => navigate('/nova-peca')}
          className="shadow-sm font-semibold"
        >
          Nova Peça
        </Button>
      </div>
    </header>
  );
}
