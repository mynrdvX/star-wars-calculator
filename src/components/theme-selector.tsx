import { Shield } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

export type ForceTheme = 'Balance' | 'Jedi' | 'Sith';
const themes: ForceTheme[] = ['Balance', 'Jedi', 'Sith'];

export function ThemeSelector({
  value,
  onChange,
  onOpenChange,
}: {
  value: ForceTheme;
  onChange: (theme: ForceTheme) => void;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Select
      value={value}
      onValueChange={(value) => onChange(value as ForceTheme)}
      onOpenChange={onOpenChange}
    >
      <SelectTrigger
        aria-label="Choose Force theme"
        className="h-9 w-[118px] gap-1 border-white/10 bg-white/2 px-2 font-mono text-[10px] text-muted-foreground"
      >
        <Shield className="size-3.5" aria-hidden="true" />
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {themes.map((theme) => (
          <SelectItem key={theme} value={theme}>
            {theme}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
