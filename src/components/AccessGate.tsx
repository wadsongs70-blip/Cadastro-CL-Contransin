import React, { useState, useEffect } from 'react';
import { KeyRound, ArrowRight, AlertCircle, ShieldCheck } from 'lucide-react';
import { Button } from './ui/Button';

// =========================================================================
// CÓDIGO DE ACESSO DO SISTEMA
// Altere o valor abaixo para trocar o código de acesso facilmente:
// =========================================================================
export const CODIGO_ACESSO = "PECAS2026";

const SESSION_STORAGE_KEY = 'cl_parts_auth_session';

interface AccessGateProps {
  children: React.ReactNode;
}

export function AccessGate({ children }: AccessGateProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return sessionStorage.getItem(SESSION_STORAGE_KEY) === 'true';
  });

  const [inputCode, setInputCode] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Check sessionStorage on mount
  useEffect(() => {
    const savedAuth = sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (savedAuth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleAccessSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = inputCode.trim();

    if (!trimmed) {
      setErrorMessage('Por favor, digite o código de acesso.');
      return;
    }

    // Compare code (case-insensitive for convenience and user-friendliness)
    if (trimmed.toUpperCase() === CODIGO_ACESSO.toUpperCase()) {
      sessionStorage.setItem(SESSION_STORAGE_KEY, 'true');
      setIsAuthenticated(true);
      setErrorMessage(null);
    } else {
      setErrorMessage('Código de acesso incorreto. Tente novamente.');
      setInputCode('');
    }
  };

  // If already authenticated in this session, render the full catalog
  if (isAuthenticated) {
    return <>{children}</>;
  }

  // Otherwise, render only the clean Access Screen
  return (
    <div className="min-h-screen w-screen flex items-center justify-center p-4 bg-slate-50 dark:bg-slate-950 font-sans select-none">
      {/* Subtle CAD engineering background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#0284c7_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />

      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6 animate-fade-in">
        {/* Official Branding Header */}
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="relative w-16 h-16 rounded-2xl overflow-hidden shadow-lg shadow-sky-500/10 border border-slate-200 dark:border-slate-700 bg-white flex items-center justify-center p-1">
            <img
              src="/logo.png"
              alt="CL Parts Manager Logo"
              className="w-full h-full object-contain rounded-xl"
            />
          </div>

          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
              CL Parts Manager
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Catálogo Técnico de Peças Mecânicas
            </p>
          </div>
        </div>

        {/* Security / Access Notice */}
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-sky-100 dark:bg-sky-950 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0">
            <KeyRound className="w-4 h-4" />
          </div>
          <div className="text-xs text-slate-600 dark:text-slate-300">
            Informe o código de acesso para desbloquear a consulta e o cadastro de peças.
          </div>
        </div>

        {/* Access Code Form */}
        <form onSubmit={handleAccessSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label
              htmlFor="access-code"
              className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center justify-between"
            >
              <span>Código de Acesso</span>
            </label>

            <div className="relative">
              <input
                id="access-code"
                type="password"
                autoFocus
                autoComplete="off"
                placeholder="Digite o código aqui..."
                value={inputCode}
                onChange={(e) => {
                  setInputCode(e.target.value);
                  if (errorMessage) setErrorMessage(null);
                }}
                className={`w-full bg-slate-50 dark:bg-slate-950/80 border text-slate-900 dark:text-slate-100 text-sm rounded-xl px-4 py-3 tracking-widest font-mono focus:outline-none focus:ring-2 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600 ${
                  errorMessage
                    ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/20'
                    : 'border-slate-300 dark:border-slate-700 focus:border-sky-500 focus:ring-sky-500/20'
                }`}
              />
            </div>

            {errorMessage && (
              <div className="flex items-center gap-1.5 text-xs text-rose-600 dark:text-rose-400 font-medium mt-2 animate-fade-in">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            icon={<ArrowRight className="w-4 h-4" />}
            className="w-full py-3 shadow-md shadow-sky-500/20"
          >
            Acessar Catálogo
          </Button>
        </form>

        {/* Footer info */}
        <div className="pt-2 text-center text-[11px] text-slate-400 dark:text-slate-500 flex items-center justify-center gap-1.5 border-t border-slate-100 dark:border-slate-800">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>Sessão segura ativa até fechar o navegador</span>
        </div>
      </div>
    </div>
  );
}
