import { useState } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './components/ui/Toast';
import { PiecesProvider, usePieces } from './hooks/usePieces';
import { AccessGate } from './components/AccessGate';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
// Pages
import { Dashboard } from './pages/Dashboard';
import { Pieces } from './pages/Pieces';
import { NewPiece } from './pages/NewPiece';
import { EditPiece } from './pages/EditPiece';
import { PieceDetails } from './pages/PieceDetails';
import { Export } from './pages/Export';
import { Backup } from './pages/Backup';
import { Settings } from './pages/Settings';
function AppContent() {
  const { totalPieces } = usePieces();
  const [globalSearch, setGlobalSearch] = useState('');
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100">
      <Sidebar totalPieces={totalPieces} />
      <div className="flex flex-col flex-1 h-full min-w-0 overflow-hidden">
        <Header
          globalSearchValue={globalSearch}
          onGlobalSearchChange={setGlobalSearch}
        />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route
              path="/pecas"
              element={
                <Pieces
                  globalSearchQuery={globalSearch}
                  onGlobalSearchChange={setGlobalSearch}
                />
              }
            />
            <Route path="/nova-peca" element={<NewPiece />} />
            <Route path="/editar/:id" element={<EditPiece />} />
            <Route path="/peca/:id" element={<PieceDetails />} />
            <Route path="/exportacao" element={<Export />} />
            <Route path="/backup" element={<Backup />} />
            <Route path="/configuracoes" element={<Settings />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
export function App() {
  return (
    <ToastProvider>
      <PiecesProvider>
        <AccessGate>
          <HashRouter>
            <AppContent />
          </HashRouter>
        </AccessGate>
      </PiecesProvider>
    </ToastProvider>
  );
}
export default App;
