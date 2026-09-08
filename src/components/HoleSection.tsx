import { HoleData } from '../types/piece';
import { Input } from './ui/Input';

interface HoleSectionProps {
  title: string;
  data: HoleData;
  onChange: (field: keyof HoleData, value: string) => void;
  accentColor?: string;
}

export function HoleSection({
  title,
  data,
  onChange,
}: HoleSectionProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Input
          label="Quantidade"
          placeholder="Ex: 4"
          value={data.quantity}
          onChange={(e) => onChange('quantity', e.target.value)}
        />

        <Input
          label="Diâmetro (mm)"
          placeholder="Ex: 13 ou 25 x 75 mm"
          value={data.diameter}
          onChange={(e) => onChange('diameter', e.target.value)}
          helperText="Aceita diâmetros ou oblongos"
        />

        <Input
          label="Entre Centros Horizontal"
          placeholder="Ex: 100"
          value={data.centerH}
          onChange={(e) => onChange('centerH', e.target.value)}
          suffixText="mm"
        />

        <Input
          label="Entre Centros Vertical"
          placeholder="Ex: 130"
          value={data.centerV}
          onChange={(e) => onChange('centerV', e.target.value)}
          suffixText="mm"
        />
      </div>
    </div>
  );
}
