import { Input } from './ui/Input';
import { Ruler } from 'lucide-react';

interface DimensionSectionProps {
  height: string;
  width: string;
  thickness: string;
  onHeightChange: (val: string) => void;
  onWidthChange: (val: string) => void;
  onThicknessChange: (val: string) => void;
}

const COMMON_THICKNESSES = ['1/8"', '3/16"', '1/4"', '5/16"', '3/8"', '1/2"', '5/8"', '3/4"', '1"'];

export function DimensionSection({
  height,
  width,
  thickness,
  onHeightChange,
  onWidthChange,
  onThicknessChange,
}: DimensionSectionProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Input
          label="Altura (mm)"
          placeholder="Ex: 180"
          value={height}
          onChange={(e) => onHeightChange(e.target.value)}
          suffixText="mm"
        />

        <Input
          label="Largura (mm)"
          placeholder="Ex: 150"
          value={width}
          onChange={(e) => onWidthChange(e.target.value)}
          suffixText="mm"
        />

        <div>
          <Input
            label="Espessura"
            placeholder="Ex: 5/16&quot; ou 8 mm"
            value={thickness}
            onChange={(e) => onThicknessChange(e.target.value)}
            helperText="Aceita frações ou mm (ex: 5/16&quot;)"
          />
          {/* Quick-pick buttons for common engineering thicknesses */}
          <div className="mt-2 flex flex-wrap gap-1.5 items-center">
            <span className="text-[10px] uppercase font-semibold text-slate-400 dark:text-slate-500 mr-1 flex items-center gap-1">
              <Ruler className="w-3 h-3" /> Padrões:
            </span>
            {COMMON_THICKNESSES.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => onThicknessChange(t)}
                className={`text-[11px] font-mono px-1.5 py-0.5 rounded border transition-colors ${
                  thickness === t
                    ? 'bg-sky-100 dark:bg-sky-950/80 border-sky-400 text-sky-700 dark:text-sky-300 font-bold'
                    : 'bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
