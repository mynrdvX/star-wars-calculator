import { Button } from './ui/button';
import { cn } from '../lib/utils';

const keys = [
  'AC',
  '()',
  '%',
  '÷',
  '7',
  '8',
  '9',
  '×',
  '4',
  '5',
  '6',
  '−',
  '1',
  '2',
  '3',
  '+',
  '±',
  '0',
  '.',
  '=',
];
const labels: Record<string, string> = {
  '±': 'Change sign',
  AC: 'Clear all',
  '()': 'Parentheses',
};

function keyStyle(key: string) {
  if (key === '=')
    return 'bg-primary text-primary-foreground border-primary text-[26px] hover:bg-primary/90 shadow-[0_0_18px_rgba(var(--accent-rgb),0.1)]';
  if (['÷', '×', '−', '+'].includes(key))
    return 'border-primary/20 bg-primary/8 text-[26px] text-primary hover:bg-primary/15';
  if (['AC', '()', '%'].includes(key))
    return 'bg-secondary text-base text-secondary-foreground hover:bg-secondary/80';
  return 'bg-linear-to-b from-key-top to-key-bottom text-[22px] text-foreground hover:from-key-hover hover:to-key-hover';
}

export function CalculatorKeypad({
  onPress,
}: {
  onPress: (key: string) => void;
}) {
  return (
    <div className="grid grid-cols-4 gap-[9px] pt-5">
      {keys.map((key) => (
        <Button
          key={key}
          variant="outline"
          aria-label={labels[key] ?? key}
          onClick={() => onPress(key)}
          className={cn(
            'h-[59px] min-w-0 rounded-md border-key-border p-0 font-medium shadow-[0_2px_2px_#0002,inset_0_1px_0_#ffffff04] min-[701px]:h-14',
            keyStyle(key),
          )}
        >
          {key}
        </Button>
      ))}
    </div>
  );
}
