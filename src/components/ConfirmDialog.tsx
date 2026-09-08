import React from 'react';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';
import { AlertTriangle } from 'lucide-react';

export interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'primary';
  loading?: boolean;
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = 'Excluir peça?',
  description = 'Esta ação não poderá ser desfeita.',
  confirmLabel = 'Excluir peça',
  cancelLabel = 'Cancelar',
  variant = 'danger',
  loading = false,
}: ConfirmDialogProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400">
          <AlertTriangle className="w-5 h-5" />
          <span>{title}</span>
        </div>
      }
      maxWidth="md"
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            {cancelLabel}
          </Button>
          <Button
            variant={variant}
            onClick={() => {
              onConfirm();
            }}
            disabled={loading}
          >
            {loading ? 'Processando...' : confirmLabel}
          </Button>
        </>
      }
    >
      <div className="text-sm text-slate-600 dark:text-slate-300 py-2 leading-relaxed">
        {description}
      </div>
    </Modal>
  );
}
