import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from './ui/Card';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { DimensionSection } from './DimensionSection';
import { HoleSection } from './HoleSection';
import { Piece, PieceFormData, HoleData } from '../types/piece';
import { extractIdNumber, formatFullId, formatIdNumber } from '../utils/generateId';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  Save,
  ArrowLeft,
  Hash,
  Maximize2,
  CircleDot,
  Wrench,
  RotateCcw,
} from 'lucide-react';

interface PieceFormProps {
  initialData?: Piece | null;
  nextSuggestedIdNumber: string;
  onSave: (piece: Piece) => Promise<Piece>;
  onCalculateNextId: () => Promise<string>;
  isEditing?: boolean;
}

const emptyHoleData: HoleData = {
  quantity: '',
  diameter: '',
  centerH: '',
  centerV: '',
};

export function PieceForm({
  initialData,
  nextSuggestedIdNumber,
  onSave,
  onCalculateNextId,
  isEditing = false,
}: PieceFormProps) {
  const navigate = useNavigate();
  const descriptionInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<PieceFormData>(() => {
    if (initialData) {
      const num = extractIdNumber(initialData.id);
      return {
        idNumber: num !== null ? formatIdNumber(num) : '001',
        description: initialData.description,
        height: initialData.height,
        width: initialData.width,
        thickness: initialData.thickness,
        holesA: { ...initialData.holesA },
        holesB: { ...initialData.holesB },
        observation: initialData.observation,
        paUsed: initialData.paUsed,
        systemCode: initialData.systemCode,
      };
    }
    return {
      idNumber: nextSuggestedIdNumber,
      description: '',
      height: '',
      width: '',
      thickness: '',
      holesA: { ...emptyHoleData },
      holesB: { ...emptyHoleData },
      observation: '',
      paUsed: '',
      systemCode: '',
    };
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  // Update idNumber when nextSuggestedIdNumber changes if new form
  useEffect(() => {
    if (!initialData && nextSuggestedIdNumber) {
      setFormData((prev) => ({ ...prev, idNumber: nextSuggestedIdNumber }));
    }
  }, [nextSuggestedIdNumber, initialData]);

  // Focus description input on load
  useEffect(() => {
    descriptionInputRef.current?.focus();
  }, []);

  const handleNextIdClick = async () => {
    const nextFull = await onCalculateNextId();
    const num = extractIdNumber(nextFull);
    if (num !== null) {
      setFormData((prev) => ({ ...prev, idNumber: formatIdNumber(num) }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.idNumber || formData.idNumber.trim() === '') {
      newErrors.idNumber = 'Informe o número do ID.';
    } else if (!/^\d+$/.test(formData.idNumber.trim())) {
      newErrors.idNumber = 'O ID deve conter apenas números.';
    }

    if (!formData.description || formData.description.trim() === '') {
      newErrors.description = 'A descrição da peça é obrigatória.';
    } else if (formData.description.trim().length < 2) {
      newErrors.description = 'A descrição deve ter pelo menos 2 caracteres.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const constructPiece = (): Piece => {
    const fullId = formatFullId(formData.idNumber);
    const now = new Date().toISOString();
    return {
      id: fullId,
      description: formData.description.trim(),
      height: formData.height.trim(),
      width: formData.width.trim(),
      thickness: formData.thickness.trim(),
      holesA: { ...formData.holesA },
      holesB: { ...formData.holesB },
      observation: formData.observation.trim(),
      paUsed: formData.paUsed.trim(),
      systemCode: formData.systemCode.trim(),
      createdAt: initialData?.createdAt || now,
      updatedAt: now,
    };
  };

  // Submit and save (regular)
  const handleSubmitAndExit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setSubmitting(true);
      const piece = constructPiece();
      await onSave(piece);
      navigate('/pecas');
    } catch {
      // Error handled by hook toast
    } finally {
      setSubmitting(false);
    }
  };

  // Fundamental "Salvar e criar próxima" workflow
  const handleSaveAndCreateNext = async () => {
    if (!validate()) return;

    try {
      setSubmitting(true);
      const piece = constructPiece();
      await onSave(piece);

      // Micro-confetti celebratory burst
      try {
        confetti({
          particleCount: 35,
          spread: 60,
          origin: { y: 0.8 },
          colors: ['#0284c7', '#38bdf8', '#10b981'],
        });
      } catch {
        // ignore
      }

      // Calculate next available ID
      const nextFull = await onCalculateNextId();
      const nextNum = extractIdNumber(nextFull);

      // Reset form but retain focus for continuous CAD registration
      setFormData({
        idNumber: nextNum !== null ? formatIdNumber(nextNum) : '001',
        description: '',
        height: '',
        width: '',
        thickness: '',
        holesA: { ...emptyHoleData },
        holesB: { ...emptyHoleData },
        observation: '',
        paUsed: '',
        systemCode: '',
      });
      setErrors({});

      setTimeout(() => {
        descriptionInputRef.current?.focus();
      }, 100);
    } catch {
      // Error handled in hook
    } finally {
      setSubmitting(false);
    }
  };

  const handleClearForm = () => {
    setFormData((prev) => ({
      ...prev,
      description: '',
      height: '',
      width: '',
      thickness: '',
      holesA: { ...emptyHoleData },
      holesB: { ...emptyHoleData },
      observation: '',
      paUsed: '',
      systemCode: '',
    }));
    descriptionInputRef.current?.focus();
  };

  return (
    <form onSubmit={handleSubmitAndExit} className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* CARD 01 — IDENTIFICAÇÃO */}
      <Card
        header={
          <div className="flex items-center gap-2 text-sky-600 dark:text-sky-400">
            <Hash className="w-5 h-5" />
            <span>CARD 01 — IDENTIFICAÇÃO</span>
          </div>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
          {/* Locked Prefix ID Input */}
          <div className="md:col-span-4">
            <div className="flex items-end gap-2">
              <div className="flex-1">
                <Input
                  label="Código ID"
                  prefixText="ID-CL-"
                  placeholder="001"
                  value={formData.idNumber}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      idNumber: e.target.value.replace(/\D/g, ''),
                    }))
                  }
                  error={errors.idNumber}
                  required
                />
              </div>
              {!isEditing && (
                <Button
                  type="button"
                  variant="outline"
                  size="md"
                  onClick={handleNextIdClick}
                  className="mb-[1px] whitespace-nowrap text-xs"
                  title="Consultar maior número existente e sugerir próximo"
                >
                  Próximo ID
                </Button>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="md:col-span-8">
            <Input
              ref={descriptionInputRef}
              label="Peça / Descrição Técnica"
              placeholder="Ex: Suporte lateral do cubo, Placa base..."
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, description: e.target.value }))
              }
              error={errors.description}
              required
            />
          </div>
        </div>
      </Card>

      {/* CARD 02 — DIMENSÕES */}
      <Card
        header={
          <div className="flex items-center gap-2 text-sky-600 dark:text-sky-400">
            <Maximize2 className="w-5 h-5" />
            <span>CARD 02 — DIMENSÕES</span>
          </div>
        }
      >
        <DimensionSection
          height={formData.height}
          width={formData.width}
          thickness={formData.thickness}
          onHeightChange={(val) => setFormData((prev) => ({ ...prev, height: val }))}
          onWidthChange={(val) => setFormData((prev) => ({ ...prev, width: val }))}
          onThicknessChange={(val) =>
            setFormData((prev) => ({ ...prev, thickness: val }))
          }
        />
      </Card>

      {/* CARD 03 — FUROS A */}
      <Card
        header={
          <div className="flex items-center gap-2 text-sky-600 dark:text-sky-400">
            <CircleDot className="w-5 h-5" />
            <span>CARD 03 — FUROS A</span>
          </div>
        }
      >
        <HoleSection
          title="Furos A"
          data={formData.holesA}
          onChange={(field, val) =>
            setFormData((prev) => ({
              ...prev,
              holesA: { ...prev.holesA, [field]: val },
            }))
          }
        />
      </Card>

      {/* CARD 04 — FUROS B */}
      <Card
        header={
          <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400">
            <CircleDot className="w-5 h-5" />
            <span>CARD 04 — FUROS B</span>
          </div>
        }
      >
        <HoleSection
          title="Furos B"
          data={formData.holesB}
          onChange={(field, val) =>
            setFormData((prev) => ({
              ...prev,
              holesB: { ...prev.holesB, [field]: val },
            }))
          }
        />
      </Card>

      {/* CARD 05 — FABRICAÇÃO */}
      <Card
        header={
          <div className="flex items-center gap-2 text-sky-600 dark:text-sky-400">
            <Wrench className="w-5 h-5" />
            <span>CARD 05 — FABRICAÇÃO & RASTREABILIDADE</span>
          </div>
        }
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="PA Utilizado"
              placeholder="Ex: PA0220846"
              value={formData.paUsed}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, paUsed: e.target.value }))
              }
            />

            <Input
              label="Código Sistema"
              placeholder="Ex: MP0100280"
              value={formData.systemCode}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, systemCode: e.target.value }))
              }
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 tracking-wide uppercase">
              Observação Técnica
            </label>
            <textarea
              rows={3}
              placeholder="Ex: Chanfro 25 mm em todos os lados, tolerância H7, rosca M16..."
              value={formData.observation}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, observation: e.target.value }))
              }
              className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-sm rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
            />
          </div>
        </div>
      </Card>

      {/* ACTION BUTTONS BAR */}
      <div className="sticky bottom-4 z-20 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button
            type="button"
            variant="outline"
            size="md"
            icon={<ArrowLeft className="w-4 h-4" />}
            onClick={() => navigate(-1)}
          >
            Voltar
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="md"
            icon={<RotateCcw className="w-4 h-4" />}
            onClick={handleClearForm}
          >
            Limpar
          </Button>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          {!isEditing && (
            <Button
              type="button"
              variant="primary"
              size="lg"
              icon={<Sparkles className="w-4 h-4 text-sky-200" />}
              onClick={handleSaveAndCreateNext}
              disabled={submitting}
              className="bg-emerald-600 hover:bg-emerald-500 border-emerald-500/30 text-white shadow-md shadow-emerald-600/20"
            >
              {submitting ? 'Salvando...' : 'Salvar e criar próxima'}
            </Button>
          )}

          <Button
            type="submit"
            variant={isEditing ? 'primary' : 'secondary'}
            size="lg"
            icon={<Save className="w-4 h-4" />}
            disabled={submitting}
          >
            {submitting
              ? 'Salvando...'
              : isEditing
              ? 'Salvar Alterações'
              : 'Salvar e Ver Peças'}
          </Button>
        </div>
      </div>
    </form>
  );
}
